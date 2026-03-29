/**
 * Parse card agent ability text into executable effects.
 * Returns an array of effect objects for simple abilities, or null for complex ones.
 *
 * Handles patterns like:
 *   "+1 Troop" / "+2 Troops"
 *   "+1 Solari" / "+3 Solari"
 *   "+1 Water" / "+1 Spice"
 *   "Draw 1 card" / "Draw 2 cards"
 *   "+1 Intrigue card" / "+1 Intrigue"
 *   "Trash this card"
 *   "Trash a card" / "Trash 1 card"
 *   "+1 Spy"
 *   "+1 Influence with a Faction" / "+1 Influence with any Faction"
 *   Compound: "X, Y" or "X and Y" or "X AND Y"
 *   Cost-effect: "Pay N Resource: Effect" or "N Resource -> Effect"
 *   Choice: "X OR Y"
 */
function parseAgentAbility(text) {
  if (!text) {
    return null
  }

  // Skip known complex patterns we can't handle yet
  if (/^(Signet Ring|If |With |When |This |Each opponent|Block |For each|Look at|Put one|Send one|Enemy|You may (take another|acquire|deploy)|Gain rewards|The next|Ignore Influence)/i.test(text)) {
    return null
  }

  // Handle OR choices
  if (/\bOR\b/.test(text)) {
    const parts = text.split(/\s+OR\s+/)
    const parsed = parts.map(p => parseAgentAbility(p.trim()))
    if (parsed.some(p => p === null)) {
      return null
    }
    return [{
      type: 'choice',
      choices: parts.map((p, i) => ({
        label: p.trim(),
        effects: parsed[i],
      })),
    }]
  }

  // Handle cost-effect patterns: "Pay N Resource: Effect" or "N Resource -> Effect"
  const costMatch = text.match(/^(?:Pay\s+)?(\d+)\s+(Solari|Spice|Water|Influence)\s*(?:-->?|:)\s*(.+)$/i)
  if (costMatch) {
    const costAmount = parseInt(costMatch[1])
    const costResource = costMatch[2].toLowerCase()
    const effectText = costMatch[3].trim()
    const subEffects = parseAgentAbility(effectText)
    if (!subEffects) {
      return null
    }
    return [{
      type: 'choice',
      choices: [
        { label: text, cost: { [costResource]: costAmount }, effects: subEffects },
        { label: 'Decline', effects: [] },
      ],
    }]
  }

  // Split compound abilities: ", " or " and " or " AND "
  const parts = text.split(/\s*,\s*|\s+(?:and|AND)\s+/)
  const effects = []

  for (const part of parts) {
    const effect = parseSingleAbility(part.trim())
    if (!effect) {
      return null
    } // Can't parse one part — bail
    effects.push(effect)
  }

  return effects
}

/**
 * Parse a single ability phrase.
 */
function parseSingleAbility(text) {
  // "+N Troop(s)"
  const troopMatch = text.match(/^\+?(\d+)\s+Troops?$/i)
  if (troopMatch) {
    return { type: 'troop', amount: parseInt(troopMatch[1]) }
  }

  // "+N Solari"
  const solariMatch = text.match(/^\+(\d+)\s+Solari$/i)
  if (solariMatch) {
    return { type: 'gain', resource: 'solari', amount: parseInt(solariMatch[1]) }
  }

  // "+N Spice"
  const spiceMatch = text.match(/^\+(\d+)\s+Spice$/i)
  if (spiceMatch) {
    return { type: 'gain', resource: 'spice', amount: parseInt(spiceMatch[1]) }
  }

  // "+N Water"
  const waterMatch = text.match(/^\+(\d+)\s+Water$/i)
  if (waterMatch) {
    return { type: 'gain', resource: 'water', amount: parseInt(waterMatch[1]) }
  }

  // "Draw N card(s)" / "Draw a card"
  const drawMatch = text.match(/^Draw\s+(\d+)\s+cards?$/i)
  if (drawMatch) {
    return { type: 'draw', amount: parseInt(drawMatch[1]) }
  }
  if (/^Draw\s+a\s+card$/i.test(text)) {
    return { type: 'draw', amount: 1 }
  }

  // "+N Intrigue card(s)" / "+N Intrigue"
  const intrigueMatch = text.match(/^\+(\d+)\s+Intrigue(?:\s+cards?)?$/i)
  if (intrigueMatch) {
    return { type: 'intrigue', amount: parseInt(intrigueMatch[1]) }
  }
  if (/^Draw\s+(\d+)\s+Intrigue\s+cards?$/i.test(text)) {
    const m = text.match(/(\d+)/)
    return { type: 'intrigue', amount: parseInt(m[1]) }
  }

  // "Trash this card"
  if (/^Trash this card$/i.test(text)) {
    return { type: 'trash-self' }
  }

  // "Trash a card" / "Trash 1 card"
  if (/^Trash (?:a|1) card$/i.test(text)) {
    return { type: 'trash-card' }
  }

  // "+1 Spy"
  if (/^\+1\s+Spy$/i.test(text)) {
    return { type: 'spy' }
  }

  // "+1 Influence with a Faction" / "+1 Influence with any Faction"
  const infChoiceMatch = text.match(/^\+(\d+)\s+Influence\s+with\s+(?:a|any)\s+Faction$/i)
  if (infChoiceMatch) {
    return { type: 'influence-choice', amount: parseInt(infChoiceMatch[1]) }
  }

  // "+1 Faction Influence" (specific faction)
  const infSpecificMatch = text.match(/^\+(\d+)\s+(Emperor|Spacing Guild|Bene Gesserit|Fremen)\s+Influence$/i)
  if (infSpecificMatch) {
    const factionMap = {
      'emperor': 'emperor',
      'spacing guild': 'guild',
      'bene gesserit': 'bene-gesserit',
      'fremen': 'fremen',
    }
    return { type: 'influence', faction: factionMap[infSpecificMatch[2].toLowerCase()], amount: parseInt(infSpecificMatch[1]) }
  }

  // "Recall an Agent"
  if (/^Recall an Agent$/i.test(text)) {
    return { type: 'recall-agent' }
  }

  // "Discard a card" (for cost patterns, not standalone effect)
  if (/^Discard a card$/i.test(text)) {
    return { type: 'discard-card' }
  }

  // "+1 Contract"
  if (/^\+1\s+Contract$/i.test(text)) {
    return { type: 'contract' }
  }

  return null
}

module.exports = { parseAgentAbility }
