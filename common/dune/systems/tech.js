// Buying a Rise of Ix tech tile. The three stacks live on game.state.techStacks.
// Index 0 of each stack is the face-up tile.

function topOffers(game, player, discount, payWith) {
  const negotiators = player.negotiators
  const offers = []
  game.state.techStacks.forEach((stack, stackIndex) => {
    const tile = stack[0]
    if (!tile) {
      return
    }
    const afterIcon = Math.max(0, (tile.definition.spiceCost || 0) - discount)
    const maxUsed = Math.min(negotiators, afterIcon)
    for (let used = 0; used <= maxUsed; used++) {
      const cost = afterIcon - used
      if (player.getCounter(payWith) < cost) {
        continue
      }
      offers.push({ tile, stackIndex, used, cost })
    }
  })
  return offers
}

function offerTitle(offer, payWith) {
  const name = offer.tile.name
  const currency = payWith === 'solari' ? 'Solari' : 'Spice'
  if (offer.used > 0) {
    return `${name} for ${offer.cost} ${currency}, return ${offer.used} Negotiator${offer.used === 1 ? '' : 's'}`
  }
  return `${name} for ${offer.cost} ${currency}`
}

/**
 * Acquire Tech. discount is the single icon discount (0, 1, or 2).
 * payWith is 'spice' or 'solari'. Negotiators stack with that one discount.
 * Returns the tile bought, or null.
 */
function acquireTech(game, player, opts = {}) {
  const discount = Math.max(0, opts.discount || 0)
  const payWith = opts.payWith === 'solari' ? 'solari' : 'spice'
  const offers = topOffers(game, player, discount, payWith)
  if (offers.length === 0) {
    return null
  }

  const choices = [
    game.actions.option({ id: 'pass', title: 'Pass' }),
    ...offers.map((offer, index) => game.actions.option({
      id: `tech-${index}`,
      title: offerTitle(offer, payWith),
    })),
  ]
  const [choice] = game.actions.choose(player, choices, { title: 'Acquire Tech' })
  const choiceId = typeof choice === 'object' ? choice.id : choice
  if (choiceId === 'pass' || choice === 'Pass') {
    return null
  }
  const index = Number(String(choiceId).replace('tech-', ''))
  const offer = offers[index]
  if (!offer) {
    return null
  }

  if (offer.cost > 0) {
    player.decrementCounter(payWith, offer.cost, { silent: true })
  }
  if (offer.used > 0) {
    player.decrementCounter('negotiators', offer.used, { silent: true })
    player.incrementCounter('troopsInSupply', offer.used, { silent: true })
  }

  const stack = game.state.techStacks[offer.stackIndex]
  stack.shift()
  if (!game.state.ownedTech[player.name]) {
    game.state.ownedTech[player.name] = []
  }
  game.state.ownedTech[player.name].push(offer.tile)

  game.log.add({
    template: '{player} acquires {card}',
    args: { player, card: offer.tile },
  })

  if (typeof offer.tile.definition.onAcquire === 'function') {
    const { resolveEffect } = require('../phases/playerTurns.js')
    offer.tile.definition.onAcquire(game, player, offer.tile, { resolveEffect })
  }

  return offer.tile
}

function ownedTiles(game, player) {
  return game.state.ownedTech?.[player.name] || []
}

module.exports = {
  acquireTech,
  ownedTiles,
}
