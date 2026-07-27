/** Standard icon for occupation requirements on Agricola cards. */
export const OCCUPATION_ICON = '👤'

export const OCCUPATION_PREREQ_KEYS = new Set([
  'occupations',
  'occupationsExact',
  'occupationsAtMost',
  'exactlyOccupations',
  'noOccupations',
  'occupationsInHand',
])

/**
 * Format occupation prerequisites for chip/card display.
 * Returns { text, title } or null when there is no occupation requirement.
 *
 * Examples: "2👤", "=2👤", "≤1👤", "0👤", "3👤✋"
 */
export function formatOccupationPrereq(prereqs) {
  if (!prereqs) {
    return null
  }

  if (prereqs.noOccupations || prereqs.occupations === 0) {
    return { text: `0${OCCUPATION_ICON}`, title: 'Requires no occupations played' }
  }
  if (prereqs.exactlyOccupations !== undefined) {
    const n = prereqs.exactlyOccupations
    return { text: `=${n}${OCCUPATION_ICON}`, title: `Requires exactly ${n} occupations` }
  }
  if (prereqs.occupations !== undefined) {
    const n = prereqs.occupations
    if (prereqs.occupationsExact) {
      return { text: `=${n}${OCCUPATION_ICON}`, title: `Requires exactly ${n} occupations` }
    }
    if (prereqs.occupationsAtMost) {
      return { text: `≤${n}${OCCUPATION_ICON}`, title: `Requires at most ${n} occupations` }
    }
    return { text: `${n}${OCCUPATION_ICON}`, title: `Requires ${n}+ occupations` }
  }
  if (prereqs.occupationsAtMost !== undefined) {
    const n = prereqs.occupationsAtMost
    return { text: `≤${n}${OCCUPATION_ICON}`, title: `Requires at most ${n} occupations` }
  }
  if (prereqs.occupationsInHand !== undefined) {
    const n = prereqs.occupationsInHand
    return { text: `${n}${OCCUPATION_ICON}✋`, title: `Requires ${n}+ occupations in hand` }
  }

  return null
}

export function hasNonOccupationPrereqs(prereqs) {
  if (!prereqs) {
    return false
  }
  return Object.keys(prereqs).some(key => !OCCUPATION_PREREQ_KEYS.has(key))
}
