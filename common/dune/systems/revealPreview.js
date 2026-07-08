'use strict'

const constants = require('../res/constants.js')

const FACTION_LABELS = {
  emperor: 'Emperor',
  guild: 'Spacing Guild',
  'bene-gesserit': 'Bene Gesserit',
  fremen: 'Fremen',
}

/**
 * Build a "what would happen if I revealed now" summary for a player. Pure
 * read-only — does not touch game state. Returns aggregated totals for the
 * deterministic part (base card stats, met-condition effects, High Council
 * seat bonus) plus two lists: `resolved` for tooltip breakdowns and `pending`
 * for effects that need a player choice or can't be parsed.
 *
 * Card-level extension: a card whose reveal logic lives in a `revealEffect`
 * function (instead of pure `revealAbility` text) can opt in by exporting a
 * `previewReveal(game, player, allHandCards) => deltas` sibling. Without one,
 * the card's text shows up in `pending`.
 */
function previewReveal(game, player) {
  const handZone = game.zones.byId(`${player.name}.hand`)
  const handCards = handZone ? handZone.cardlist() : []

  const totals = emptyTotals()
  const resolved = []
  const pending = []

  for (const card of handCards) {
    const def = defOf(card)
    const p = def.revealPersuasion || 0
    const s = def.revealSwords || 0
    if (p) {
      totals.persuasion += p
      resolved.push({ source: def.name, description: `+${p} Persuasion` })
    }
    if (s) {
      totals.swords += s
      resolved.push({ source: def.name, description: `+${s} Sword${s === 1 ? '' : 's'}` })
    }
  }

  for (const card of handCards) {
    const def = defOf(card)
    const text = def.revealAbility
    if (!text) {
      continue
    }

    if (typeof def.previewReveal === 'function') {
      const result = def.previewReveal(game, player, handCards) || {}
      const { pending: residual, ...deltas } = result
      mergeDeltas(totals, deltas, def.name, resolved)
      if (residual) {
        pending.push({ source: def.name, text: residual })
      }
      continue
    }

    if (typeof def.revealEffect === 'function') {
      pending.push({ source: def.name, text })
      continue
    }

    const effects = def.revealEffects
    if (!effects) {
      pending.push({ source: def.name, text })
      continue
    }

    evaluateEffects(game, player, handCards, card, effects, def.name, totals, resolved, pending)
  }

  if (player.hasHighCouncil) {
    totals.persuasion += 2
    resolved.push({ source: 'High Council', description: '+2 Persuasion' })
  }

  const baseDeployedTroops = game.state.conflict?.deployedTroops?.[player.name] || 0
  const baseDeployedSandworms = game.state.conflict?.deployedSandworms?.[player.name] || 0
  const totalDeployedTroops = baseDeployedTroops + (totals.deployFromSupply || 0)
  const totalDeployedSandworms = baseDeployedSandworms
  const hasUnits = (totalDeployedTroops + totalDeployedSandworms) > 0
  const strength = hasUnits
    ? totals.swords * constants.SWORD_STRENGTH
      + totalDeployedTroops * constants.TROOP_STRENGTH
      + totalDeployedSandworms * constants.SANDWORM_STRENGTH
    : 0

  // Leader-level extension: a leader whose onRevealTurn depends on the
  // final strength/hand state (e.g. Gurney Halleck's threshold check) can
  // opt in with a `previewOnRevealTurn(game, player, ctx) => deltas` sibling.
  // Without one, a leader with an onRevealTurn hook shows up in `pending`
  // since its effect can't be predicted here.
  const leaders = require('./leaders.js')
  const leaderDef = leaders.getLeader(game, player)
  if (leaderDef && typeof leaderDef.previewOnRevealTurn === 'function') {
    const result = leaderDef.previewOnRevealTurn(game, player, { strength, hasUnits, handCards }) || {}
    const { pending: residual, ...deltas } = result
    mergeDeltas(totals, deltas, leaderDef.name, resolved)
    if (residual) {
      pending.push({ source: leaderDef.name, text: residual })
    }
  }
  else if (leaderDef && typeof leaderDef.onRevealTurn === 'function') {
    pending.push({ source: leaderDef.name, text: leaderDef.leaderAbility })
  }

  return {
    totals,
    resolved,
    pending,
    strength,
    hasUnits,
    deployedTroops: totalDeployedTroops,
    deployedSandworms: totalDeployedSandworms,
    carriedPersuasion: player.getCounter('persuasion'),
  }
}

function emptyTotals() {
  return {
    persuasion: 0,
    swords: 0,
    spice: 0,
    solari: 0,
    water: 0,
    troops: 0,
    intrigue: 0,
    spy: 0,
    draw: 0,
    vp: 0,
    deployFromSupply: 0,
    influence: {},
  }
}

function defOf(card) {
  return card.definition || card.data || card
}

function evaluateEffects(game, player, handCards, sourceCard, effects, sourceName, totals, resolved, pending) {
  const list = Array.isArray(effects) ? effects : [effects]
  const ctx = { game, player, handCards, sourceCard }
  for (const effect of list) {
    if (!effect) {
      continue
    }
    if (Array.isArray(effect)) {
      evaluateEffects(game, player, handCards, sourceCard, effect, sourceName, totals, resolved, pending)
      continue
    }
    if (effect.type === 'conditional') {
      const verdict = checkCondition(game, player, handCards, sourceCard, effect.condition)
      if (verdict === true) {
        evaluateEffects(game, player, handCards, sourceCard, effect.effects, sourceName, totals, resolved, pending)
      }
      else if (verdict === false) {
        // not met — skip silently
      }
      else {
        pending.push({ source: sourceName, text: describeConditional(effect) })
      }
      continue
    }
    if (effect.type === 'choice') {
      pending.push({ source: sourceName, text: describeChoice(effect) })
      continue
    }
    const desc = applyEffect(effect, totals, ctx)
    if (desc) {
      resolved.push({ source: sourceName, description: desc })
    }
    else if (desc === '') {
      // recognized type but zero-contribution — skip silently
    }
    else {
      pending.push({ source: sourceName, text: describeEffect(effect) })
    }
  }
}

function applyEffect(effect, totals, ctx) {
  switch (effect.type) {
    case 'troop':
      totals.troops += effect.amount
      return `+${effect.amount} Troop${effect.amount === 1 ? '' : 's'}`
    case 'swords':
    case 'sword':
      totals.swords += effect.amount
      return `+${effect.amount} Sword${effect.amount === 1 ? '' : 's'}`
    case 'swords-per': {
      const n = countPerVariable(ctx.game, ctx.player, ctx.handCards, effect.per)
      const total = effect.amount * n
      if (total > 0) {
        totals.swords += total
        return `+${total} Sword${total === 1 ? '' : 's'} (${n}× ${effect.per})`
      }
      return ''
    }
    case 'persuasion-per': {
      const n = countPerVariable(ctx.game, ctx.player, ctx.handCards, effect.per)
      const total = effect.amount * n
      if (total > 0) {
        totals.persuasion += total
        return `+${total} Persuasion (${n}× ${effect.per})`
      }
      return ''
    }
    case 'spy':
      totals.spy += 1
      return '+1 Spy'
    case 'intrigue':
      totals.intrigue += effect.amount || 1
      return `+${effect.amount || 1} Intrigue`
    case 'draw':
      totals.draw += effect.amount || 1
      return `Draw ${effect.amount || 1}`
    case 'vp':
      totals.vp += effect.amount
      return `+${effect.amount} VP`
    case 'gain': {
      const res = effect.resource
      if (res === 'persuasion') {
        totals.persuasion += effect.amount
        return `+${effect.amount} Persuasion`
      }
      if (res === 'spice' || res === 'solari' || res === 'water') {
        totals[res] += effect.amount
        return `+${effect.amount} ${capitalize(res)}`
      }
      return null
    }
    case 'influence': {
      const fid = constants.normalizeFactionId(effect.faction)
      totals.influence[fid] = (totals.influence[fid] || 0) + effect.amount
      return `+${effect.amount} ${FACTION_LABELS[fid] || fid} Influence`
    }
    default:
      return null
  }
}

function mergeDeltas(totals, deltas, sourceName, resolved) {
  for (const key of Object.keys(deltas)) {
    const value = deltas[key]
    if (key === 'influence' && value && typeof value === 'object') {
      for (const f of Object.keys(value)) {
        const fid = constants.normalizeFactionId(f)
        totals.influence[fid] = (totals.influence[fid] || 0) + value[f]
        resolved.push({
          source: sourceName,
          description: `+${value[f]} ${FACTION_LABELS[fid] || fid} Influence`,
        })
      }
      continue
    }
    if (typeof value !== 'number' || value === 0) {
      continue
    }
    if (totals[key] === undefined) {
      continue
    }
    totals[key] += value
    resolved.push({
      source: sourceName,
      description: formatDelta(key, value),
    })
  }
}

function formatDelta(key, value) {
  const labelMap = {
    persuasion: 'Persuasion',
    swords: value === 1 ? 'Sword' : 'Swords',
    spice: 'Spice',
    solari: 'Solari',
    water: 'Water',
    troops: value === 1 ? 'Troop' : 'Troops',
    intrigue: 'Intrigue',
    spy: value === 1 ? 'Spy' : 'Spies',
    draw: 'Draw',
    vp: 'VP',
    deployFromSupply: value === 1 ? 'Troop deployed' : 'Troops deployed',
  }
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value} ${labelMap[key] || key}`
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * Evaluate a condition for preview semantics. Differs from runtime
 * `checkCondition` in one way: `faction-card-in-play` treats the player's
 * hand as "in play" too, since the preview pretends all of hand is about to
 * be revealed in a single batch.
 *
 * Returns true / false when the condition is decidable, or null when the
 * condition is genuinely unknowable until the actual turn (so the caller can
 * surface it as pending).
 */
function checkCondition(game, player, handCards, sourceCard, condition) {
  if (!condition) {
    return null
  }
  switch (condition.type) {
    case 'and': {
      let anyNull = false
      for (const c of condition.conditions) {
        const v = checkCondition(game, player, handCards, sourceCard, c)
        if (v === false) {
          return false
        }
        if (v === null) {
          anyNull = true
        }
      }
      return anyNull ? null : true
    }

    case 'influence':
      return player.getInfluence(condition.faction) >= condition.amount

    case 'faction-card-in-play': {
      const playedZone = game.zones.byId(`${player.name}.played`)
      const revealedZone = game.zones.byId(`${player.name}.revealed`)
      const target = constants.normalizeFactionId(condition.faction)
      const inPlay = [
        ...(playedZone ? playedZone.cardlist() : []),
        ...(revealedZone ? revealedZone.cardlist() : []),
        ...handCards,
      ]
      return inPlay.some(c =>
        c !== sourceCard && constants.getFactionAffiliations(c).includes(target)
      )
    }

    case 'sandworms-in-conflict':
      return (game.state.conflict?.deployedSandworms?.[player.name] || 0) >= condition.amount

    case 'units-in-conflict': {
      const troops = game.state.conflict?.deployedTroops?.[player.name] || 0
      const sandworms = game.state.conflict?.deployedSandworms?.[player.name] || 0
      return (troops + sandworms) >= condition.amount
    }

    case 'most-deployed-troops': {
      const myTroops = game.state.conflict?.deployedTroops?.[player.name] || 0
      return game.players.all().every(p =>
        p.name === player.name || (game.state.conflict?.deployedTroops?.[p.name] || 0) < myTroops
      )
    }

    case 'has-high-council':
      return !!player.hasHighCouncil

    case 'has-swordmaster':
      return player.getCounter('hasSwordmaster') > 0

    case 'has-alliance':
      return constants.FACTIONS.some(f => game.state.alliances?.[f] === player.name)

    case 'has-specific-alliance':
      return game.state.alliances?.[condition.faction] === player.name

    case 'has-resource':
      return player.getCounter(condition.resource) >= condition.amount

    case 'has-persuasion':
      return player.getCounter('persuasion') >= condition.amount

    case 'has-garrison':
      return player.troopsInGarrison >= condition.amount

    case 'has-spies-on-board': {
      let count = 0
      for (const occupants of Object.values(game.state.spyPosts || {})) {
        for (const name of (occupants || [])) {
          if (name === player.name) {
            count++
          }
        }
      }
      return count >= condition.amount
    }

    // "This turn" trackers reflect what happened earlier this round; safe to
    // read but only meaningful mid-turn. Treat the current value as truth.
    case 'recalled-spy':
      return !!(game.state.turnTracking && game.state.turnTracking.recalledSpy)

    case 'completed-contract-this-turn':
      return !!(game.state.turnTracking && game.state.turnTracking.completedContract)

    case 'gained-spice': {
      const gained = (game.state.turnTracking && game.state.turnTracking.spiceGained) || 0
      return gained >= condition.amount
    }

    case 'completed-contracts': {
      const choamCheck = require('./choam.js')
      return choamCheck.getCompletedContractCount(game, player) >= condition.amount
    }

    default:
      return null
  }
}

function countPerVariable(game, player, handCards, per) {
  if (/contract.*completed/i.test(per)) {
    const choamCount = require('./choam.js')
    return choamCount.getCompletedContractCount(game, player)
  }
  const factionRevealedMatch = per.match(/(emperor|fremen|bene[\s-]gesserit|spacing\s+guild|guild)\s+card you revealed/i)
  if (factionRevealedMatch) {
    const target = constants.normalizeFactionId(factionRevealedMatch[1])
    // Preview semantics: "revealed" = the cards about to be revealed (hand).
    return handCards.filter(c => constants.getFactionAffiliations(c).includes(target)).length
  }
  const factionInPlayMatch = per.match(/(emperor|fremen|bene[\s-]gesserit|spacing\s+guild|guild)\s+card in play/i)
  if (factionInPlayMatch) {
    const target = constants.normalizeFactionId(factionInPlayMatch[1])
    const played = game.zones.byId(`${player.name}.played`).cardlist()
    return played.filter(c => constants.getFactionAffiliations(c).includes(target)).length
  }
  if (/garrisoned troop/i.test(per)) {
    return player.troopsInGarrison
  }
  if (/deployed troop/i.test(per)) {
    return game.state.conflict?.deployedTroops?.[player.name] || 0
  }
  return 0
}

function describeConditional(effect) {
  const cond = describeCondition(effect.condition)
  const inner = (effect.effects || []).map(describeEffect).filter(Boolean).join(', ')
  return cond ? `If ${cond}: ${inner}` : inner
}

function describeChoice(effect) {
  return (effect.choices || []).map(c => c.label || '?').join(' OR ')
}

function describeEffect(effect) {
  if (!effect) {
    return ''
  }
  if (effect.type === 'conditional') {
    return describeConditional(effect)
  }
  if (effect.type === 'choice') {
    return describeChoice(effect)
  }
  if (effect.type === 'gain') {
    return `+${effect.amount} ${capitalize(effect.resource)}`
  }
  if (effect.type === 'influence') {
    const fid = constants.normalizeFactionId(effect.faction)
    return `+${effect.amount} ${FACTION_LABELS[fid] || fid} Influence`
  }
  if (effect.amount !== undefined) {
    return `+${effect.amount} ${effect.type}`
  }
  return effect.type
}

function describeCondition(condition) {
  if (!condition) {
    return ''
  }
  switch (condition.type) {
    case 'faction-card-in-play': {
      const fid = constants.normalizeFactionId(condition.faction)
      return `another ${FACTION_LABELS[fid] || fid} card in play`
    }
    case 'influence': {
      const fid = constants.normalizeFactionId(condition.faction)
      return `${condition.amount}+ ${FACTION_LABELS[fid] || fid} Influence`
    }
    case 'has-alliance':
      return 'you have an Alliance'
    case 'has-specific-alliance': {
      const fid = constants.normalizeFactionId(condition.faction)
      return `you have the ${FACTION_LABELS[fid] || fid} Alliance`
    }
    case 'has-high-council':
      return 'High Council seat'
    case 'has-swordmaster':
      return 'Swordmaster'
    case 'has-resource':
      return `${condition.amount}+ ${capitalize(condition.resource)}`
    case 'has-persuasion':
      return `${condition.amount}+ Persuasion`
    case 'units-in-conflict':
      return `${condition.amount}+ units in conflict`
    case 'sandworms-in-conflict':
      return `${condition.amount}+ sandworms in conflict`
    case 'most-deployed-troops':
      return 'most deployed troops'
    case 'has-garrison':
      return `${condition.amount}+ garrisoned troops`
    case 'and':
      return condition.conditions.map(describeCondition).join(' and ')
    default:
      return condition.type
  }
}

module.exports = { previewReveal }
