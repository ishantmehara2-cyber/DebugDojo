"""Secure-ish evaluator for learner Python submissions.

This project intentionally avoids claiming OS-level security guarantees in a local
sandbox host. The evaluator still enforces a bounded subprocess, denies dangerous
modules in the learner namespace, strips the environment, and caps output.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
from typing import Any

ALLOWED_ENV = {
    "PYTHONPATH": "",
    "HOME": "",
    "PATH": os.environ.get("PATH", ""),
    "PYTHONNOUSERSITE": "1",
    "USER": "sandbox",
    "TMPDIR": "",
    "TEMP": "",
    "TMP": "",
}

BLOCKED_IMPORTS = {
    "os",
    "subprocess",
    "socket",
    "requests",
    "urllib",
    "ctypes",
    "multiprocessing",
    "pathlib",
    "glob",
    "shlex",
    "sqlite3",
    "http",
    "http.client",
}

BLOCKLIST_PATTERNS = (
    "import os",
    "import socket",
    "import subprocess",
    "import multiprocessing",
    "import requests",
    "import urllib",
    "import ctypes",
    "socket.create_connection",
    "subprocess.run",
    "os.environ",
    "open(",
    "urllib.request",
    "pathlib",
    "ctypes.",
    "os.system",
    "multiprocessing.",
)


def _contains_blocked_pattern(code: str) -> bool:
    lower = code.lower()
    return any(pattern in lower for pattern in BLOCKLIST_PATTERNS)


def _safe_import(name: str, globals: dict[str, Any] | None = None, locals: dict[str, Any] | None = None, fromlist: tuple[str, ...] = (), level: int = 0):
    if name.split(".")[0] in BLOCKED_IMPORTS:
        raise ImportError(f"Import of {name!r} is not allowed in the sandbox.")
    return __import__(name, globals, locals, fromlist, level)


def _safe_builtins() -> dict[str, Any]:
    import builtins as _builtins

    safe = dict(_builtins.__dict__)
    safe["__import__"] = _safe_import
    safe["open"] = None
    safe["exec"] = None
    safe["eval"] = None
    safe["compile"] = None
    safe["input"] = None
    return safe


def _coerce_value(value: Any) -> Any:
    if isinstance(value, (list, tuple)):
        return [ _coerce_value(v) for v in value ]
    if isinstance(value, dict):
        return {str(k): _coerce_value(v) for k, v in value.items()}
    return value


def _compare_outputs(actual: Any, expected: Any) -> bool:
    return _coerce_value(actual) == _coerce_value(expected)


def _build_runner_script(code: str, challenge: dict[str, Any]) -> str:
    function_name = challenge["function_name"]
    tests = challenge["visible_tests"] + challenge["hidden_tests"]
    tests_literal = repr(tests)
    lines = [
        "import json",
        "import builtins",
        "",
        "BLOCKED = {'os', 'subprocess', 'socket', 'requests', 'urllib', 'ctypes', 'multiprocessing', 'pathlib', 'glob', 'shlex', 'sqlite3'}",
        "",
        "def safe_import(name, globals=None, locals=None, fromlist=(), level=0):",
        "    root = name.split('.')[0]",
        "    if root in BLOCKED:",
        "        raise ImportError(f'Import of {name!r} is not allowed in the sandbox.')",
        "    return __import__(name, globals, locals, fromlist, level)",
        "",
        "safe_builtins = dict(builtins.__dict__)",
        "safe_builtins['__import__'] = safe_import",
        "safe_builtins['open'] = None",
        "safe_builtins['eval'] = None",
        "safe_builtins['exec'] = None",
        "safe_builtins['compile'] = None",
        "safe_builtins['input'] = None",
        "",
        "code = r'''" + code.replace("'''", "\\'\\'\\'") + "'''",
        "ns = {'__builtins__': safe_builtins}",
        "try:",
        "    exec(code, ns, ns)",
        "    fn = ns.get('" + function_name + "')",
        "    if fn is None:",
        "        raise NameError('Function not found')",
        "    tests = " + tests_literal,
        "    results = []",
        "    for test in tests:",
        "        out = fn(*test['input_args'])",
        "        results.append({'id': test['id'], 'actual': out, 'expected': test['expected_output']})",
        "    print(json.dumps({'status': 'ok', 'results': results}))",
        "except Exception as exc:",
        "    print(json.dumps({'status': 'error', 'error': type(exc).__name__, 'message': str(exc)[:200]}))",
        "    raise",
    ]
    return "\n".join(lines)


def run_submission(challenge: dict[str, Any], code: str, timeout_seconds: float = 3.0) -> dict[str, Any]:
    """Run a learner submission in an isolated subprocess and classify the outcome."""
    if _contains_blocked_pattern(code):
        return {
            "overall_status": "runtime error",
            "safe_message": "The program violated the sandbox restrictions.",
            "detail": "runtime failure",
        }

    runner = _build_runner_script(code, challenge)
    with tempfile.TemporaryDirectory(prefix="debugdojo_") as temp_dir:
        env = os.environ.copy()
        env.update(ALLOWED_ENV)
        env["PYTHONPATH"] = ""
        env["HOME"] = temp_dir
        env["TEMP"] = temp_dir
        env["TMP"] = temp_dir
        env["TMPDIR"] = temp_dir

        try:
            proc = subprocess.run(
                [sys.executable, "-c", runner],
                capture_output=True,
                text=True,
                timeout=timeout_seconds,
                cwd=temp_dir,
                env=env,
            )
        except subprocess.TimeoutExpired:
            return {
                "overall_status": "timeout",
                "safe_message": "The program exceeded the execution time limit.",
                "detail": "timeout",
            }

        stdout = proc.stdout.strip()
        stderr = proc.stderr.strip()

        if len(stdout) > 12000 or len(stderr) > 12000:
            return {
                "overall_status": "runtime error",
                "safe_message": "The program exceeded the output limit.",
                "detail": "output limit",
            }

        if proc.returncode != 0:
            return {
                "overall_status": "runtime error",
                "safe_message": "The program crashed while running.",
                "detail": "runtime failure",
            }

        if not stdout:
            return {
                "overall_status": "runtime error",
                "safe_message": "The program produced no output.",
                "detail": "empty output",
            }

        try:
            payload = json.loads(stdout)
        except json.JSONDecodeError:
            return {
                "overall_status": "runtime error",
                "safe_message": "The program crashed while running.",
                "detail": "invalid process output",
            }

        if payload.get("status") == "error":
            return {
                "overall_status": "runtime error",
                "safe_message": "The program crashed while running.",
                "detail": "runtime failure",
            }

        results = payload.get("results", [])
        all_passed = True
        for test in challenge["visible_tests"] + challenge["hidden_tests"]:
            actual = None
            for item in results:
                if item.get("id") == test["id"]:
                    actual = item.get("actual")
                    break
            if actual is None or not _compare_outputs(actual, test["expected_output"]):
                all_passed = False
                break

        if all_passed:
            return {
                "overall_status": "passed",
                "safe_message": "All checks passed.",
                "detail": None,
            }

        return {
            "overall_status": "wrong output",
            "safe_message": "The submission did not match the expected output.",
            "detail": "wrong output",
        }
