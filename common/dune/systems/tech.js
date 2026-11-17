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

function tileDefId(tile) {
  return tile?.definition?.defId || tile?.definition?.id
}

function owns(game, player, defId) {
  return ownedTiles(game, player).some(tile => tileDefId(tile) === defId)
}

function findOwned(game, player, defId) {
  return ownedTiles(game, player).find(tile => tileDefId(tile) === defId) || null
}

function resetFlips(game) {
  game.state.flippedTech = {}
}

function isFlipped(game, tile) {
  return !!game.state.flippedTech?.[tile.id]
}

function markFlipped(game, tile) {
  if (!game.state.flippedTech) {
    game.state.flippedTech = {}
  }
  game.state.flippedTech[tile.id] = true
}

function removeOwned(game, player, tile) {
  const list = game.state.ownedTech?.[player.name]
  if (!list) {
    return
  }
  const index = list.indexOf(tile)
  if (index >= 0) {
    list.splice(index, 1)
  }
}

function countOwnedCopies(game, player, defId) {
  const zoneIds = ['deck', 'hand', 'discard', 'played', 'revealed']
  let count = 0
  for (const zoneId of zoneIds) {
    const zone = game.zones.byId(`${player.name}.${zoneId}`)
    if (!zone) {
      continue
    }
    count += zone.cardlist().filter(card => card.defId === defId).length
  }
  return count
}

/**
 * Persuasion and swords a tile adds on the reveal turn.
 * swordSources is the list already built from revealed cards.
 */
function revealAdjustments(game, player, swordSources) {
  const extras = { persuasion: 0, swords: [] }
  if (!game.settings?.useRiseOfIx) {
    return extras
  }

  if (owns(game, player, 'minimic-film')) {
    extras.persuasion += 1
    game.log.add({
      template: '{player}: +{amount} Persuasion (Minimic Film)',
      args: { player, amount: 1 },
    })
  }

  if (owns(game, player, 'artillery')) {
    const swordCards = swordSources.filter(source => source.swords > 0).length
    if (swordCards > 0) {
      extras.swords.push({ label: 'Artillery', swords: swordCards })
      game.log.add({
        template: '{player}: +{amount} Sword(s) (Artillery)',
        args: { player, amount: swordCards },
      })
    }
  }

  if (owns(game, player, 'restricted-ordinance') && player.getCounter('hasHighCouncil') > 0) {
    extras.swords.push({ label: 'Restricted Ordinance', swords: 4 })
    game.log.add({
      template: '{player}: +{amount} Sword(s) (Restricted Ordinance)',
      args: { player, amount: 4 },
    })
  }

  return extras
}

function offerDisposal(game, player, persuasion) {
  if (!game.settings?.useRiseOfIx || persuasion < 6 || !owns(game, player, 'disposal-facility')) {
    return
  }

  const cards = []
  for (const zoneName of ['played', 'revealed']) {
    const zone = game.zones.byId(`${player.name}.${zoneName}`)
    if (!zone) {
      continue
    }
    cards.push(...zone.cardlist())
  }
  if (cards.length === 0) {
    return
  }

  const [choice] = game.actions.choose(player, [
    game.actions.option({ id: 'pass', title: 'Pass' }),
    ...cards.map(card => ({
      title: `${card.name} (In Play)`,
      id: card.id,
      defId: card.defId,
      kind: 'imperium-card',
    })),
  ], { title: 'Disposal Facility: trash a card in play?' })

  const choiceId = typeof choice === 'object' ? choice.id : choice
  if (!choiceId || choiceId === 'pass' || choice === 'Pass') {
    return
  }
  const card = cards.find(entry => entry.id === choiceId) || cards.find(entry => entry.name === choice)
  if (card) {
    require('./deckEngine.js').trashCard(game, card, player)
  }
}

function discardOneFromHand(game, player, title) {
  const hand = game.zones.byId(`${player.name}.hand`).cardlist()
  if (hand.length === 0) {
    return null
  }
  const [choice] = game.actions.choose(player, hand.map(card => ({
    title: card.name,
    id: card.id,
    defId: card.defId,
    kind: 'imperium-card',
  })), { title })
  const choiceId = typeof choice === 'object' ? choice.id : choice
  const card = hand.find(entry => entry.id === choiceId) || hand.find(entry => entry.name === choice)
  if (!card) {
    return null
  }
  require('./deckEngine.js').discardCard(game, player, card)
  return card
}

function useSonicSnoopers(game, player, tile) {
  removeOwned(game, player, tile)
  game.log.add({
    template: '{player} trashes Sonic Snoopers',
    args: { player },
  })

  const intrigue = game.zones.byId(`${player.name}.intrigue`)
  const deck = game.zones.byId('common.intrigueDeck')
  let moved = 0
  while (intrigue.cardlist().length > 0) {
    const cards = intrigue.cardlist()
    const [choice] = game.actions.choose(player, [
      game.actions.option({ id: 'done', title: 'Done' }),
      ...cards.map(card => game.actions.cardOption(card, 'intrigue-card')),
    ], { title: 'Put an Intrigue card on the bottom of the deck?' })
    const choiceId = typeof choice === 'object' ? choice.id : choice
    if (!choiceId || choiceId === 'done' || choice === 'Done') {
      break
    }
    const card = cards.find(entry => entry.id === choiceId) || cards.find(entry => entry.name === choice)
    if (!card) {
      break
    }
    card.moveTo(deck)
    moved += 1
    game.log.addPrivate({
      viewer: player,
      template: '{player} puts {card} on the bottom of the Intrigue deck',
      redactedTemplate: '{player} puts an Intrigue card on the bottom of the deck',
      args: { player, card },
    })
  }

  if (moved > 0) {
    require('./deckEngine.js').drawIntrigueCard(game, player, moved)
  }
}

function turnAbilityOptions(game, player) {
  const options = []
  const hand = game.zones.byId(`${player.name}.hand`).cardlist()

  const drones = findOwned(game, player, 'training-drones')
  if (drones && !isFlipped(game, drones) && player.troopsInSupply > 0) {
    options.push({
      id: 'training-drones',
      title: 'Training Drones: +1 Troop',
      run() {
        markFlipped(game, drones)
        require('./deploy.js').recruitTroops(game, player, 1)
      },
    })
  }

  const holos = findOwned(game, player, 'holoprojectors')
  if (holos && !isFlipped(game, holos) && hand.length > 0) {
    options.push({
      id: 'holoprojectors',
      title: 'Holoprojectors: discard a card to draw a card',
      run() {
        const discarded = discardOneFromHand(game, player, 'Holoprojectors: discard a card')
        if (!discarded) {
          return
        }
        markFlipped(game, holos)
        require('./deckEngine.js').drawCards(game, player, 1)
      },
    })
  }

  const invasion = findOwned(game, player, 'invasion-ships')
  if (invasion && !isFlipped(game, invasion) && hand.length > 0) {
    options.push({
      id: 'invasion-ships',
      title: 'Invasion Ships: discard a card to ignore enemy Agents',
      run() {
        const discarded = discardOneFromHand(game, player, 'Invasion Ships: discard a card')
        if (!discarded) {
          return
        }
        markFlipped(game, invasion)
        game.state.turnTracking.ignoreOccupancy = true
        game.log.add({
          template: '{player}\'s Agents ignore enemy Agents this turn (Invasion Ships)',
          args: { player },
        })
      },
    })
  }

  const flagship = findOwned(game, player, 'flagship')
  if (flagship && !isFlipped(game, flagship) && player.solari >= 4 && player.troopsInSupply > 0) {
    options.push({
      id: 'flagship',
      title: 'Flagship: pay 4 Solari for 3 Troops',
      run() {
        markFlipped(game, flagship)
        player.decrementCounter('solari', 4, { silent: true })
        game.log.add({
          template: '{player} pays 4 Solari (Flagship)',
          args: { player },
        })
        require('./deploy.js').recruitTroops(game, player, 3)
      },
    })
  }

  const satellites = findOwned(game, player, 'spy-satellites')
  if (satellites && player.spice >= 3) {
    options.push({
      id: 'spy-satellites',
      title: 'Spy Satellites: pay 3 Spice for 1 Victory Point',
      run() {
        player.decrementCounter('spice', 3, { silent: true })
        removeOwned(game, player, satellites)
        player.incrementCounter('vp', 1, { silent: true })
        game.log.add({
          template: '{player} pays 3 Spice and trashes Spy Satellites for 1 Victory Point',
          args: { player },
        })
      },
    })
  }

  const snoopers = findOwned(game, player, 'sonic-snoopers')
  const intrigue = game.zones.byId(`${player.name}.intrigue`)
  if (snoopers && intrigue && intrigue.cardlist().length > 0) {
    options.push({
      id: 'sonic-snoopers',
      title: 'Sonic Snoopers: reorder Intrigue cards',
      run() {
        useSonicSnoopers(game, player, snoopers)
      },
    })
  }

  return options
}

/**
 * Flip tiles and untimed tiles, at the start of one of your turns.
 * Asking stops when the player passes or nothing is left to use.
 */
function offerTurnAbilities(game, player) {
  if (!game.settings?.useRiseOfIx) {
    return
  }
  while (true) {
    const options = turnAbilityOptions(game, player)
    if (options.length === 0) {
      return
    }
    const [choice] = game.actions.choose(player, [
      game.actions.option({ id: 'pass', title: 'Pass' }),
      ...options.map(option => game.actions.option({ id: option.id, title: option.title })),
    ], { title: 'Use a Tech tile?' })
    const choiceId = typeof choice === 'object' ? choice.id : choice
    if (!choiceId || choiceId === 'pass' || choice === 'Pass') {
      return
    }
    const option = options.find(entry => entry.id === choiceId)
    if (!option) {
      return
    }
    option.run()
  }
}

function applyRoundStart(game) {
  resetFlips(game)
  if (!game.settings?.useRiseOfIx) {
    return
  }
  const deckEngine = require('./deckEngine.js')
  for (const player of game.players.all()) {
    if (owns(game, player, 'shuttle-fleet')) {
      player.incrementCounter('solari', 2, { silent: true })
      game.log.add({
        template: '{player} gains 2 Solari (Shuttle Fleet)',
        args: { player },
      })
    }
    if (owns(game, player, 'holtsman-engine')) {
      deckEngine.drawCards(game, player, 1)
    }
  }
}

function applyEndgame(game) {
  if (!game.settings?.useRiseOfIx) {
    return
  }
  const factions = require('../res/constants.js').FACTIONS
  for (const player of game.players.all()) {
    if (owns(game, player, 'holtsman-engine') && countOwnedCopies(game, player, 'the-spice-must-flow') >= 2) {
      player.incrementCounter('vp', 1, { silent: true })
      game.log.add({
        template: '{player} gains 1 Victory Point (Holtzman Engine)',
        args: { player },
      })
    }
    if (owns(game, player, 'memocorders') && factions.every(faction => player.getInfluence(faction) >= 3)) {
      player.incrementCounter('vp', 1, { silent: true })
      game.log.add({
        template: '{player} gains 1 Victory Point (Memocorders)',
        args: { player },
      })
    }
    if (owns(game, player, 'spy-satellites')) {
      const low = factions.filter(faction => player.getInfluence(faction) <= 1).length
      if (low > 0) {
        player.incrementCounter('vp', low, { silent: true })
        game.log.add({
          template: '{player} gains {amount} Victory Point(s) (Spy Satellites)',
          args: { player, amount: low },
        })
      }
    }
  }
}

/**
 * Spaceport lets the player put an acquired card on top of the deck
 * when no other effect already chose a destination.
 */
function applyWinConflict(game, player) {
  if (!game.settings?.useRiseOfIx || !owns(game, player, 'windtraps')) {
    return
  }
  player.incrementCounter('water', 1, { silent: true })
  game.log.add({
    template: '{player}: +{amount} Water (Windtraps)',
    args: { player, amount: 1 },
  })
}

function chooseAcquireDestination(game, player, toTopOfDeck, toHand) {
  if (toTopOfDeck || toHand || !game.settings?.useRiseOfIx || !owns(game, player, 'spaceport')) {
    return { toTopOfDeck, toHand }
  }
  const [choice] = game.actions.choose(player, [
    game.actions.option({ id: 'top', title: 'Top of deck' }),
    game.actions.option({ id: 'discard', title: 'Discard pile' }),
  ], { title: 'Spaceport: where does this card go?' })
  const choiceId = typeof choice === 'object' ? choice.id : choice
  return {
    toTopOfDeck: choiceId === 'top' || choice === 'Top of deck',
    toHand: false,
  }
}

module.exports = {
  acquireTech,
  ownedTiles,
  owns,
  revealAdjustments,
  offerDisposal,
  offerTurnAbilities,
  applyRoundStart,
  applyEndgame,
  applyWinConflict,
  chooseAcquireDestination,
}
