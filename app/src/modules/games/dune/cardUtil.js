/**
 * Shared utilities for Dune card rendering.
 */

/**
 * Split multiline ability text into formatted lines.
 */
export function textLines(text) {
  if (!text) {
    return []
  }
  return text.split('\n').filter(l => l.trim())
}

/**
 * Detect the card type from its data shape.
 * Returns one of: 'imperium', 'intrigue', 'contract', 'tech', or null.
 */
export function cardType(card) {
  if (!card) {
    return null
  }
  if ('tier' in card && 'rewards' in card) {
    return 'conflict'
  }
  if ('plotEffect' in card || 'combatEffect' in card || 'endgameEffect' in card) {
    return 'intrigue'
  }
  if ('spiceCost' in card && 'effect' in card) {
    return 'tech'
  }
  if ('reward' in card && !('agentIcons' in card)) {
    return 'contract'
  }
  return 'imperium'
}

/**
 * Build the reveal text string from a card's reveal fields.
 */
export function revealText(card) {
  const parts = []
  const p = card.revealPersuasion || 0
  const s = card.revealSwords || 0
  if (p > 0) {
    parts.push(`+${p} persuasion`)
  }
  if (s > 0) {
    parts.push(`+${s} sword${s > 1 ? 's' : ''}`)
  }
  if (card.revealAbility) {
    parts.push(card.revealAbility)
  }
  return parts.join(', ') || null
}

/**
 * Build an ordered list of { label, text, highlight? } sections for a card.
 * This is the single source of truth for what sections a card type shows.
 */
export function cardSections(card) {
  if (!card) {
    return []
  }
  const sections = []
  const type = cardType(card)

  if (type === 'conflict') {
    if (card.rewards) {
      sections.push({ label: '1st', text: card.rewards.first })
      sections.push({ label: '2nd', text: card.rewards.second })
      if (card.rewards.third) {
        sections.push({ label: '3rd', text: card.rewards.third })
      }
    }
  }
  else if (type === 'imperium') {
    if (card.agentAbility) {
      sections.push({ label: 'Agent', text: card.agentAbility })
    }
    const reveal = revealText(card)
    if (reveal) {
      sections.push({ label: 'Reveal', text: reveal, highlight: true })
    }
    if (card.passiveAbility) {
      sections.push({ label: 'Passive', text: card.passiveAbility })
    }
    if (card.acquisitionBonus) {
      sections.push({ label: 'Acquire', text: card.acquisitionBonus })
    }
  }
  else if (type === 'intrigue') {
    if (card.plotEffect) {
      sections.push({ label: 'Plot', text: card.plotEffect })
    }
    if (card.combatEffect) {
      sections.push({ label: 'Combat', text: card.combatEffect })
    }
    if (card.endgameEffect) {
      sections.push({ label: 'Endgame', text: card.endgameEffect })
    }
  }
  else if (type === 'contract') {
    if (card.reward) {
      sections.push({ label: 'Reward', text: card.reward })
    }
  }
  else if (type === 'tech') {
    if (card.acquisitionBonus) {
      sections.push({ label: 'Acquire', text: card.acquisitionBonus })
    }
    if (card.effect) {
      sections.push({ label: 'Effect', text: card.effect })
    }
  }

  return sections
}

/**
 * Get a brief detail string for a card (shown in chips next to the name).
 */
export function cardDetail(card) {
  if (!card) {
    return ''
  }
  const type = cardType(card)
  if (type === 'conflict') {
    return `Tier ${card.tier}`
  }
  if (type === 'intrigue') {
    if (card.plotEffect) {
      return 'Plot'
    }
    if (card.combatEffect) {
      return 'Combat'
    }
    if (card.endgameEffect) {
      return 'Endgame'
    }
    return ''
  }
  if (type === 'contract') {
    return 'Contract'
  }
  if (type === 'tech') {
    return `${card.spiceCost} spice`
  }
  if (card.persuasionCost) {
    return `${card.persuasionCost}`
  }
  return ''
}

/**
 * Get the chip CSS class for a card type.
 */
export function cardChipClass(card) {
  if (!card) {
    return 'chip-card'
  }
  const type = cardType(card)
  if (type === 'conflict') {
    return 'chip-conflict'
  }
  if (type === 'intrigue') {
    return 'chip-intrigue'
  }
  if (type === 'contract') {
    return 'chip-contract'
  }
  if (type === 'tech') {
    return 'chip-tech'
  }
  return 'chip-card'
}
