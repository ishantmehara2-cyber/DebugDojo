import { AlertCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { mistakeTaxonomyMap } from '../../data/mistakesTaxonomy'
import type { MistakeCategory } from '../../types/challenge'

interface MistakePatternCardProps {
  category: string
}

const descriptions: Record<string, { label: string; explanation: string }> = {
  boundary_comparison: {
    label: 'BOUNDARY COMPARISON',
    explanation: 'Your logic acts differently when input sizes hit the extreme or empty edge.',
  },
  off_by_one: {
    label: 'OFF-BY-ONE INDEXING',
    explanation: 'Your loop or range stops one item too early or starts one index late.',
  },
  unhandled_short_input: {
    label: 'UNHANDLED SHORT INPUT',
    explanation: 'The code assumes a minimum input size that isn’t guaranteed.',
  },
  print_not_return: {
    label: 'PRINT INSTEAD OF RETURN',
    explanation: 'The function prints output to console instead of returning a value.',
  },
  mutates_input: {
    label: 'INPUT WAS MODIFIED',
    explanation: 'Modifying the input list directly causes unexpected side effects.',
  },
  incorrect_accumulator: {
    label: 'ACCUMULATOR LOGIC',
    explanation: 'A value built across a loop may be replaced instead of accumulated.',
  },
  incorrect_string_handling: {
    label: 'STRING HANDLING',
    explanation: 'The words are processed, but the requested transformation within each word may be missing.',
  },
  incorrect_transformation: {
    label: 'VALUE TRANSFORMATION',
    explanation: 'The selected values may not receive the transformation required by the task.',
  },
}

export function MistakePatternCard({ category }: MistakePatternCardProps) {
  const info = descriptions[category] ?? {
    label: category.replace(/_/g, ' ').toUpperCase(),
    explanation: 'A coding issue was detected in your attempt. Review the coach’s explanation and hint.',
  }

  return (
    <div className="mistake-pattern-card">
      <div className="mistake-pattern-card__head">
        <AlertCircle size={15} className="text-rose" />
        <span className="mistake-pattern-card__tag">PATTERN DETECTED</span>
        <b className="mistake-pattern-card__label">{info.label}</b>
      </div>
      <p className="mistake-pattern-card__desc">{info.explanation}</p>
      {mistakeTaxonomyMap[category as MistakeCategory] && (
        <div className="mistake-pattern-card__action">
          <Link
            to={`/practice?category=${category}`}
            className="button button--secondary button--sm"
          >
            <span>PRACTICE THIS MISTAKE →</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </div>
  )
}
