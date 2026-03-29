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

  // Normalize newlines to spaces for cleaner parsing
  text = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()

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

  // "Having N Faction Influence: Effect"
  const havingInfluenceMatch = text.match(/^Having\s+(\d+)\s+(Emperor|Spacing Guild|Bene Gesserit|Fremen)\s+Influence:\s*(.+)$/i)
  if (havingInfluenceMatch) {
    const condition = { type: 'influence', amount: parseInt(havingInfluenceMatch[1]), faction: normalizeFaction(havingInfluenceMatch[2]) }
    const parsedEffect = parseAgentAbility(havingInfluenceMatch[3].trim())
    if (parsedEffect) {
      return [{ type: 'conditional', condition, effects: parsedEffect }]
    }
  }

  // "Having X Alliance: Effect" — may be followed by another Having clause (period-separated)
  const havingMultiMatch = text.match(/^(Having\s+.+?\.\s*)+$/i)
  if (havingMultiMatch) {
    const clauses = text.match(/Having\s+[^.]+/gi)
    if (clauses) {
      const effects = []
      for (const clause of clauses) {
        const parsed = parseAgentAbility(clause.trim())
        if (parsed) {
          effects.push(...parsed)
        }
      }
      if (effects.length > 0) {
        return effects
      }
    }
  }

  // "Having X Alliance: Effect"
  const havingAllianceMatch = text.match(/^Having\s+(Emperor|Spacing Guild|Bene Gesserit|Fremen)\s+Alliance:\s*(.+)$/i)
  if (havingAllianceMatch) {
    const condition = { type: 'has-specific-alliance', faction: normalizeFaction(havingAllianceMatch[1]) }
    const parsedEffect = parseAgentAbility(havingAllianceMatch[2].trim())
    if (parsedEffect) {
      return [{ type: 'conditional', condition, effects: parsedEffect }]
    }
  }

  // "With another Faction card in play: Effect"
  const withFactionCardMatch = text.match(/^With\s+(?:another\s+)?(Emperor|Spacing Guild|Bene Gesserit|Fremen)\s+card\s+in\s+play:\s*(.+)$/i)
  if (withFactionCardMatch) {
    const condition = { type: 'faction-card-in-play', faction: withFactionCardMatch[1].toLowerCase() }
    const parsedEffect = parseAgentAbility(withFactionCardMatch[2].trim())
    if (parsedEffect) {
      return [{ type: 'conditional', condition, effects: parsedEffect }]
    }
  }

  // "Complete one of your contracts"
  if (/^Complete one of your contracts/i.test(text)) {
    return [{ type: 'complete-contract' }]
  }

  // "Pay N Solari: +N Troops to Garrison or Conflict"
  const paySolariTroopsMatch = text.match(/^Pay\s+(\d+)\s+[Ss]olari:\s*\+(\d+)\s+Troops?\s+to\s+Garrison\s+or\s+Conflict/i)
  if (paySolariTroopsMatch) {
    return [{
      type: 'choice',
      choices: [
        {
          label: `Pay ${paySolariTroopsMatch[1]} Solari for ${paySolariTroopsMatch[2]} troops to Garrison`,
          cost: { solari: parseInt(paySolariTroopsMatch[1]) },
          effects: [{ type: 'troop', amount: parseInt(paySolariTroopsMatch[2]) }],
        },
        {
          label: `Pay ${paySolariTroopsMatch[1]} Solari for ${paySolariTroopsMatch[2]} troops to Conflict`,
          cost: { solari: parseInt(paySolariTroopsMatch[1]) },
          effects: [{ type: 'deploy-to-conflict', amount: parseInt(paySolariTroopsMatch[2]) }],
        },
        { label: 'Decline', effects: [] },
      ],
    }]
  }

  // "Pay N Solari -> +1 Victory Point"
  const payVPMatch = text.match(/^Pay\s+(\d+)\s+(Solari|Spice|Water)\s*(?:-->?|:|->\s*|for\s+)\+?(\d+)\s+Victory\s+[Pp]oints?/i)
  if (payVPMatch) {
    return [{
      type: 'choice',
      choices: [
        { label: text, cost: { [payVPMatch[2].toLowerCase()]: parseInt(payVPMatch[1]) }, effects: [{ type: 'vp', amount: parseInt(payVPMatch[3]) }] },
        { label: 'Decline', effects: [] },
      ],
    }]
  }

  // "+N Persuation/Persuasion for each X" variable patterns
  const forEachMatch = text.match(/^\+(\d+)\s+Persuat?ion\s+for\s+each\s+(.+)/i)
  if (forEachMatch) {
    return [{ type: 'persuasion-per', amount: parseInt(forEachMatch[1]), per: forEachMatch[2].trim().toLowerCase() }]
  }

  // "+N Sword for each X" variable patterns
  const swordsForEachMatch = text.match(/^\+(\d+)\s+Swords?\s+for\s+each\s+(.+)/i)
  if (swordsForEachMatch) {
    return [{ type: 'swords-per', amount: parseInt(swordsForEachMatch[1]), per: swordsForEachMatch[2].trim().toLowerCase() }]
  }

  // "You may deploy a troop from your Garrison to the Conflict"
  if (/^You may deploy (?:a|one) troop/i.test(text)) {
    return [{ type: 'deploy-to-conflict', amount: 1 }]
  }

  // Skip remaining complex patterns
  if (/^(This |Block |Look at|Put one|Send one|Enemy|You may (take another|acquire)|Gain rewards|The next|Ignore Influence|Flip |The card|Remove|Give |At the)/i.test(text)) {
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

  // Handle discard-as-cost patterns: "Discard a card -> Effect" / "Discard N cards -> Effect"
  const discardCostMatch = text.match(/^Discard\s+(?:a|(\d+))\s+cards?\s*(?:-->?|:)\s*(.+)$/i)
  if (discardCostMatch) {
    const discardCount = discardCostMatch[1] ? parseInt(discardCostMatch[1]) : 1
    const effectText = discardCostMatch[2].trim()
    const subEffects = parseAgentAbility(effectText)
    if (!subEffects) {
      return null
    }
    const discardEffects = []
    for (let i = 0; i < discardCount; i++) {
      discardEffects.push({ type: 'discard-card' })
    }
    return [...discardEffects, ...subEffects]
  }

  // Handle lose-as-cost patterns: "Lose N troops/influence -> Effect"
  const loseCostMatch = text.match(/^Lose\s+(?:(\d+)|one|two|three)\s+(?:of\s+your\s+)?(troops?|Influence)\s*(?:-->?|:)?\s*(.+)$/i)
  if (loseCostMatch) {
    const numMap = { one: 1, two: 2, three: 3 }
    const amount = loseCostMatch[1] ? parseInt(loseCostMatch[1]) : (numMap[loseCostMatch[0].match(/one|two|three/i)?.[0]?.toLowerCase()] || 1)
    const what = loseCostMatch[2].toLowerCase()
    const effectText = loseCostMatch[3]?.trim()
    if (effectText) {
      const subEffects = parseAgentAbility(effectText)
      if (!subEffects) {
        return null
      }
      const costType = what.startsWith('troop') ? 'lose-troops' : 'lose-influence'
      return [{ type: costType, amount }, ...subEffects]
    }
  }

  // Handle retreat-as-cost patterns: "Retreat N Troops -> Effect"
  const retreatCostMatch = text.match(/^Retreat\s+(\d+)\s+(?:of\s+your\s+)?Troops?\s*->\s*(.+)$/i)
  if (retreatCostMatch) {
    const retreatCount = parseInt(retreatCostMatch[1])
    const effectText = retreatCostMatch[2].trim()
    const subEffects = parseAgentAbility(effectText)
    if (!subEffects) {
      return null
    }
    return [
      { type: 'retreat-troops', amount: retreatCount },
      ...subEffects,
    ]
  }

  // Handle cost-effect patterns: "Pay/Spend N Resource: Effect" or "N Resource -> Effect"
  const costMatch = text.match(/^(?:Pay|Spend)?\s*(\d+)\s+(Solari|Spice|Water|Influence)\s*(?:-->?|:)\s*(.+)$/i)
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

  // Split compound abilities: ", " or " and " or " AND " or newline
  const parts = text.split(/\s*[,\n]\s*|\s+(?:and|AND)\s+/).filter(p => p.trim())
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

  // "Trash this card" / "Trash this card -> Effect" / "Trash this card: Effect"
  if (/^Trash this card$/i.test(text)) {
    return { type: 'trash-self' }
  }
  const trashSelfCostMatch = text.match(/^Trash this card\s*(?:-->?|:)\s*(.+)$/i)
  if (trashSelfCostMatch) {
    const subEffects = parseAgentAbility(trashSelfCostMatch[1].trim())
    if (subEffects) {
      return [{ type: 'trash-self' }, ...subEffects]
    }
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

  // "+1 Influence with Specific Faction" / "+1 Influence with the Emperor"
  const infWithMatch = text.match(/^\+(\d+)\s+Influence\s+with\s+(?:the\s+)?(Emperor|Spacing Guild|Bene Gesserit|Fremen)$/i)
  if (infWithMatch) {
    return { type: 'influence', faction: normalizeFaction(infWithMatch[2]), amount: parseInt(infWithMatch[1]) }
  }

  // "+1 Influence" (generic, no faction specified — offer choice)
  if (/^\+(\d+)\s+Influence$/i.test(text)) {
    const m = text.match(/(\d+)/)
    return { type: 'influence-choice', amount: parseInt(m[1]) }
  }

  // "Gain N Influence instead of one" / "Gain two influence instead of one"
  if (/^Gain\s+(?:2|two)\s+[Ii]nfluence\s+instead\s+of\s+one/i.test(text)) {
    return { type: 'extra-influence' }
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

  // "Recall an Agent" / "Recall one of your Agents"
  if (/^Recall (?:an|one of your) Agents?$/i.test(text)) {
    return { type: 'recall-agent' }
  }

  // "+N Faction Influence or +N Resource" lowercase "or"
  const infOrResourceMatch = text.match(/^\+(\d+)\s+(Emperor|Spacing Guild|Bene Gesserit|Fremen)\s+Influence\s+or\s+\+?(\d+)\s+(Spice|Solari|Water|Swords?)/i)
  if (infOrResourceMatch) {
    const inf = { type: 'influence', faction: normalizeFaction(infOrResourceMatch[2]), amount: parseInt(infOrResourceMatch[1]) }
    const res = infOrResourceMatch[4].toLowerCase().startsWith('sword')
      ? { type: 'swords', amount: parseInt(infOrResourceMatch[3]) }
      : { type: 'gain', resource: infOrResourceMatch[4].toLowerCase(), amount: parseInt(infOrResourceMatch[3]) }
    return [{ type: 'choice', choices: [
      { label: `+${infOrResourceMatch[1]} ${infOrResourceMatch[2]} Influence`, effects: [inf] },
      { label: `+${infOrResourceMatch[3]} ${infOrResourceMatch[4]}`, effects: [res] },
    ]}]
  }

  // "Opponents discard N card or lose N troop"
  const opponentsChoiceMatch = text.match(/^Opponents?\s+discard\s+(\d+)\s+cards?\s+or\s+lose\s+(\d+)\s+(?:deployed\s+)?Troops?/i)
  if (opponentsChoiceMatch) {
    return [{ type: 'opponent-discard-or-lose', discardCount: parseInt(opponentsChoiceMatch[1]), troopCount: parseInt(opponentsChoiceMatch[2]) }]
  }

  // "Double base spice harvest (not bonus)"
  if (/^Double base spice harvest/i.test(text)) {
    return { type: 'double-harvest' }
  }

  // "Discard a card" (for cost patterns, not standalone effect)
  if (/^Discard a card$/i.test(text)) {
    return { type: 'discard-card' }
  }

  // "+N Persuasion" / "+N Persuation" (handle typo in card data)
  const persuasionMatch = text.match(/^\+(\d+)\s+Persuat?ion$/i)
  if (persuasionMatch) {
    return { type: 'gain', resource: 'persuasion', amount: parseInt(persuasionMatch[1]) }
  }

  // "Deploy troops" / "Deploy up to N troops from garrison to Conflict"
  if (/^Deploy troops\.?$/i.test(text)) {
    return { type: 'deploy-troops' }
  }
  const deployMatch = text.match(/^Deploy\s+(?:up to\s+)?(\d+)\s+[Tt]roops?\s+(?:from\s+(?:your\s+)?garrison\s+)?to\s+(?:the\s+)?Conflict/i)
  if (deployMatch) {
    return { type: 'deploy-to-conflict', amount: parseInt(deployMatch[1]) }
  }
  if (/^Deploy\s+(?:any\s+number\s+of\s+)?(?:your\s+)?(?:garrisoned\s+)?troops?\s+to\s+(?:the\s+)?Conflict/i.test(text)) {
    return { type: 'deploy-to-conflict', amount: 99 }
  }

  // "Each opponent discards a card" / "Each opponent loses N troop(s)"
  if (/^Each opponent discards?\s+(?:a|\d+)\s+cards?/i.test(text)) {
    return { type: 'opponent-discard', amount: 1 }
  }
  const opponentLoseMatch = text.match(/^Each opponent loses?\s+(?:(\d+)|one)\s+(?:Garrisoned\s+)?[Tt]roops?/i)
  if (opponentLoseMatch) {
    return { type: 'opponent-lose-troop', amount: opponentLoseMatch[1] ? parseInt(opponentLoseMatch[1]) : 1 }
  }

  // "Force an enemy troop to retreat"
  if (/^Force an enemy (?:troop|unit) to retreat/i.test(text)) {
    return { type: 'force-retreat' }
  }

  // "Blow the Shield Wall" / "Destroy the Shield Wall"
  if (/^(?:Blow|Destroy)\s+the Shield Wall/i.test(text)) {
    return { type: 'break-shield-wall' }
  }

  // "+1 Victory point" / "+1 VP"
  const vpMatch = text.match(/^\+(\d+)\s+Victory\s+[Pp]oints?$/i)
  if (vpMatch) {
    return { type: 'vp', amount: parseInt(vpMatch[1]) }
  }

  // "Shuffle your discard pile into your deck"
  if (/^Shuffle your discard pile into your deck/i.test(text)) {
    return { type: 'shuffle-discard' }
  }

  // "Recal/Recall one of your Agents"
  if (/^Recal?l?\s+(?:one of\s+)?your\s+Agents?/i.test(text)) {
    return { type: 'recall-agent' }
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

  // "+N Troops"
  const troopGainMatch = text.match(/^\+(\d+)\s+Troops$/i)
  if (troopGainMatch) {
    return { type: 'troop', amount: parseInt(troopGainMatch[1]) }
  }

  // "Retreat N Troops" / "Retreat up to N Troops" / "Retreat any number of Troops"
  const retreatMatch = text.match(/^Retreat\s+(?:up to\s+)?(?:(\d+)\s+)?(?:of\s+your\s+|your\s+)?(?:any number of\s+(?:your\s+)?)?Troops?(?:\s+from\s+Conflict)?$/i)
  if (retreatMatch) {
    const amount = retreatMatch[1] ? parseInt(retreatMatch[1]) : 99
    return { type: 'retreat-troops', amount }
  }
  if (/^Retreat any number of\s+(?:your\s+)?Troops/i.test(text)) {
    return { type: 'retreat-troops', amount: 99 }
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

  // "you have a seat on the High Council"
  if (/you have a seat on the High Council/i.test(text)) {
    return { type: 'has-high-council' }
  }

  // "you have a Swordmaster" / "you ALSO have a Swordmaster"
  if (/you (?:ALSO )?have (?:a |your )?Swordmaster/i.test(text)) {
    return { type: 'has-swordmaster' }
  }

  // "you have a Faction Alliance" / "you have an Alliance"
  if (/you have (?:a Faction |an? )?Alliance/i.test(text)) {
    return { type: 'has-alliance' }
  }

  // "you are occupying a Maker board space"
  if (/you are occupying a Maker board space/i.test(text)) {
    return { type: 'occupying-maker-space' }
  }

  // "you sent an Agent to a Maker board space this turn"
  if (/you sent an Agent to a Maker board space\s+this turn/i.test(text)) {
    return { type: 'sent-to-maker' }
  }

  // "you sent an Agent to a Faction board space this turn"
  if (/you sent an Agent to a Faction board space this turn/i.test(text)) {
    return { type: 'sent-to-faction' }
  }

  // "you have N+ Spice" / "you have N+ Solari" / "you have N+ Water"
  const resourceMatch = text.match(/you have (\d+)\+?\s+or more\s+(Spice|Solari|Water)/i)
    || text.match(/you have (\d+)\+?\s+(Spice|Solari|Water)/i)
  if (resourceMatch) {
    return { type: 'has-resource', resource: resourceMatch[2].toLowerCase(), amount: parseInt(resourceMatch[1]) }
  }

  // "you have 6+ Persuasion"
  const persuasionCondMatch = text.match(/you have (\d+)\+?\s+Persuasion/i)
  if (persuasionCondMatch) {
    return { type: 'has-persuasion', amount: parseInt(persuasionCondMatch[1]) }
  }

  // "you have 4+ garrisoned units"
  const garrisonMatch = text.match(/you have (\d+)\+?\s+garrisoned units/i)
  if (garrisonMatch) {
    return { type: 'has-garrison', amount: parseInt(garrisonMatch[1]) }
  }

  // "you have two or more Spies on the board"
  const spyCountMatch = text.match(/you have (?:(\d+)|two|three)\s+or more Spies on the board/i)
  if (spyCountMatch) {
    const count = spyCountMatch[1] ? parseInt(spyCountMatch[1]) : (text.includes('three') ? 3 : 2)
    return { type: 'has-spies-on-board', amount: count }
  }

  return null
}

module.exports = { parseAgentAbility, parseCondition, normalizeFaction }
