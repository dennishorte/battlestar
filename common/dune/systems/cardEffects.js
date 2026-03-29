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

  // Signet Ring handled specially
  if (/^Signet Ring$/i.test(text)) {
    return null
  }

  // Handle "If condition: effect" patterns
  const ifMatch = text.match(/^If (.+?):\s*(.+)$/i)
  if (ifMatch) {
    const condition = parseCondition(ifMatch[1].trim())
    const effectText = ifMatch[2].trim()

    // Handle chained conditions: "If X: effect1. If Y: effect2."
    const dotSplit = effectText.split(/\.\s*If\s+/i)
    if (dotSplit.length > 1) {
      const effects = []
      // First part is the effect of the first condition
      const firstEffect = parseAgentAbility(dotSplit[0].trim().replace(/\.$/, ''))
      if (condition && firstEffect) {
        effects.push({ type: 'conditional', condition, effects: firstEffect })
      }
      // Remaining parts are "condition: effect" pairs
      for (let i = 1; i < dotSplit.length; i++) {
        const subMatch = dotSplit[i].match(/^(.+?):\s*(.+?)\.?$/i)
        if (subMatch) {
          const subCondition = parseCondition(subMatch[1].trim())
          const subEffect = parseAgentAbility(subMatch[2].trim().replace(/\.$/, ''))
          if (subCondition && subEffect) {
            effects.push({ type: 'conditional', condition: subCondition, effects: subEffect })
          }
        }
      }
      return effects.length > 0 ? effects : null
    }

    if (!condition) {
      return null
    }
    const parsedEffect = parseAgentAbility(effectText.replace(/\.$/, ''))
    if (!parsedEffect) {
      return null
    }
    return [{ type: 'conditional', condition, effects: parsedEffect }]
  }

  // Handle "With N Influence with Faction: effect" patterns
  const withMatch = text.match(/^With (\d+) Influence with (\w[\w\s]*?):\s*(.+)$/i)
  if (withMatch) {
    const condition = {
      type: 'influence',
      faction: normalizeFaction(withMatch[2].trim()),
      amount: parseInt(withMatch[1]),
    }
    const effectText = withMatch[3].trim()
    const parsedEffect = parseAgentAbility(effectText)
    if (!parsedEffect) {
      return null
    }
    return [{ type: 'conditional', condition, effects: parsedEffect }]
  }

  // Skip remaining complex patterns
  if (/^(This |Each opponent|Block |For each|Look at|Put one|Send one|Enemy|You may (take another|acquire|deploy)|Gain rewards|The next|Ignore Influence)/i.test(text)) {
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

  // "+N Sword(s)"
  const swordMatch = text.match(/^\+(\d+)\s+Swords?$/i)
  if (swordMatch) {
    return { type: 'swords', amount: parseInt(swordMatch[1]) }
  }

  return null
}

/**
 * Normalize faction name from card text to internal ID.
 */
function normalizeFaction(text) {
  const map = {
    'emperor': 'emperor',
    'the emperor': 'emperor',
    'spacing guild': 'guild',
    'the spacing guild': 'guild',
    'bene gesserit': 'bene-gesserit',
    'the bene gesserit': 'bene-gesserit',
    'fremen': 'fremen',
    'the fremen': 'fremen',
  }
  return map[text.toLowerCase()] || text.toLowerCase()
}

/**
 * Parse a condition phrase from "If condition:" text.
 * Returns a condition object or null if unparseable.
 */
function parseCondition(text) {
  // "you have N+ Influence with Faction"
  const infMatch = text.match(/you have (\d+)\+?\s+Influence with (?:the )?(\w[\w\s]*)/i)
  if (infMatch) {
    return {
      type: 'influence',
      amount: parseInt(infMatch[1]),
      faction: normalizeFaction(infMatch[2].trim()),
    }
  }

  // "you have completed N+ contracts"
  const contractMatch = text.match(/you have completed (\d+)\+?\s+contracts/i)
  if (contractMatch) {
    return { type: 'completed-contracts', amount: parseInt(contractMatch[1]) }
  }

  // "you recalled a Spy this turn"
  if (/you recalled a Spy this turn/i.test(text)) {
    return { type: 'recalled-spy' }
  }

  // "you completed a contract this turn"
  if (/you completed a contract this turn/i.test(text)) {
    return { type: 'completed-contract-this-turn' }
  }

  // "you gained N+ Spice this turn"
  const spiceGainMatch = text.match(/you gained (\d+)\+?\s+Spice this turn/i)
  if (spiceGainMatch) {
    return { type: 'gained-spice', amount: parseInt(spiceGainMatch[1]) }
  }

  // "you have another Faction card in play"
  const factionCardMatch = text.match(/you have another (\w[\w\s]*?) card in play/i)
  if (factionCardMatch) {
    return { type: 'faction-card-in-play', faction: factionCardMatch[1].trim().toLowerCase() }
  }

  // "you have N+ Sandworms in the Conflict"
  const sandwormMatch = text.match(/you have (\d+)\+?\s+Sandworms? in the Conflict/i)
  if (sandwormMatch) {
    return { type: 'sandworms-in-conflict', amount: parseInt(sandwormMatch[1]) }
  }

  // "you have three or more units in the conflict"
  if (/you have three or more units in the conflict/i.test(text)) {
    return { type: 'units-in-conflict', amount: 3 }
  }

  // "you have more deployed troops than each opponent"
  if (/you have more deployed troops than each opponent/i.test(text)) {
    return { type: 'most-deployed-troops' }
  }

  // "grafted" (expansion mechanic)
  if (/grafted/i.test(text)) {
    return { type: 'grafted' }
  }

  return null
}

module.exports = { parseAgentAbility, parseCondition, normalizeFaction }
