export const defaultMatchers = [
  {
    pattern: /card\(([^()]+)\)/,
    type: 'card',
    props: (match) => ({ name: match[1] }),
  },
  {
    pattern: /player\(([^()]+)\)/,
    type: 'player',
    props: (match) => ({ name: match[1] }),
  },
  {
    pattern: /loc\(([^()]+)\)/,
    type: 'loc',
    props: (match) => ({ name: match[1] }),
  },
]

export function tokenize(text, matchers = defaultMatchers) {
  if (!text) {
    return []
  }

  const tokens = []

  while (text.length > 0) {
    let earliest = null
    let earliestIndex = Infinity
    let earliestMatcher = null

    for (const matcher of matchers) {
      const match = text.match(matcher.pattern)
      if (match && match.index < earliestIndex) {
        earliest = match
        earliestIndex = match.index
        earliestMatcher = matcher
      }
    }

    if (!earliest) {
      tokens.push({ type: 'text', value: text })
      break
    }

    if (earliestIndex > 0) {
      tokens.push({ type: 'text', value: text.slice(0, earliestIndex) })
    }

    tokens.push({
      type: earliestMatcher.type,
      props: earliestMatcher.props(earliest),
    })

    text = text.slice(earliestIndex + earliest[0].length)
  }

  return tokens
}
