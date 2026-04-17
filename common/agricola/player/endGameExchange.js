const { AgricolaPlayer } = require('../AgricolaPlayer.js')


function collectExchangeCards(player) {
  const cards = []
  for (const id of player.majorImprovements) {
    const card = player.cards.byId(id)
    if (card && card.definition.endGameExchange) {
      cards.push(card)
    }
  }
  for (const id of player.playedMinorImprovements) {
    const card = player.cards.byId(id)
    if (card && card.definition.endGameExchange) {
      cards.push(card)
    }
  }
  return cards
}

function groupByResource(cards) {
  const byResource = {}
  for (const card of cards) {
    const { resource } = card.definition.endGameExchange
    if (!byResource[resource]) {
      byResource[resource] = []
    }
    byResource[resource].push(card)
  }
  return byResource
}

function optimizeResource(available, cards) {
  // Each card allocates 0 or one of its tier costs. Enumerate the cartesian
  // product and pick the highest-VP assignment that fits in `available`.
  // Ties broken by lower total cost (spend less).
  const perCardOptions = cards.map(card => {
    const opts = [{ cardId: card.id, cost: 0, vp: 0 }]
    for (const tier of card.definition.endGameExchange.tiers) {
      opts.push({ cardId: card.id, cost: tier.cost, vp: tier.vp })
    }
    return opts
  })

  let best = { bonus: 0, spent: 0, assignments: cards.map(c => ({ cardId: c.id, cost: 0, vp: 0 })) }

  const current = new Array(cards.length)
  function recurse(idx, totalCost, totalVp) {
    if (totalCost > available) {
      return
    }
    if (idx === cards.length) {
      if (totalVp > best.bonus || (totalVp === best.bonus && totalCost < best.spent)) {
        best = { bonus: totalVp, spent: totalCost, assignments: current.slice() }
      }
      return
    }
    for (const opt of perCardOptions[idx]) {
      current[idx] = opt
      recurse(idx + 1, totalCost + opt.cost, totalVp + opt.vp)
    }
  }
  recurse(0, 0, 0)

  return best
}

AgricolaPlayer.prototype.computeEndGameExchanges = function() {
  const cards = collectExchangeCards(this)
  if (cards.length === 0) {
    return { bonus: 0, spent: {}, perCard: [] }
  }

  const byResource = groupByResource(cards)
  let totalBonus = 0
  const spent = {}
  const perCard = []

  for (const [resource, resourceCards] of Object.entries(byResource)) {
    const available = this[resource] || 0
    const result = optimizeResource(available, resourceCards)
    totalBonus += result.bonus
    if (result.spent > 0) {
      spent[resource] = result.spent
    }
    for (const assignment of result.assignments) {
      if (assignment.vp > 0) {
        const card = resourceCards.find(c => c.id === assignment.cardId)
        perCard.push({
          cardId: assignment.cardId,
          cardName: card.name,
          resource,
          cost: assignment.cost,
          vp: assignment.vp,
        })
      }
    }
  }

  return { bonus: totalBonus, spent, perCard }
}

module.exports = { collectExchangeCards, optimizeResource }
