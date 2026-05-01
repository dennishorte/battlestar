const constants = require('../res/constants.js')
const { GameOverEvent } = require('../../lib/game.js')
const { parseAgentAbility } = require('../systems/cardEffects.js')
const { resolveEffect } = require('./playerTurns.js')

/**
 * Phase 5: Recall
 * - Check endgame conditions (10+ VP or empty conflict deck)
 * - Recall all agents
 * - Clear board space occupation
 * - Pass first player clockwise
 */
function recallPhase(game) {
  game.state.phase = 'recall'
  game.log.add({ template: 'Recall', event: 'phase-start' })

  // Check endgame conditions
  const anyPlayerAt10VP = game.players.all().some(p => p.vp >= constants.VP_TO_WIN)
  const conflictDeck = game.zones.byId('common.conflictDeck')
  const conflictDeckEmpty = conflictDeck.cardlist().length === 0

  if (anyPlayerAt10VP || conflictDeckEmpty) {
    endGame(game)
  }

  // Recall agents
  for (const player of game.players.all()) {
    player.setCounter('agentsPlaced', 0, { silent: true })
  }

  // Clear board space occupation
  for (const spaceId of Object.keys(game.state.boardSpaces)) {
    game.state.boardSpaces[spaceId] = []
  }

  // Clear round-scoped state
  game.state.blockedSpaces = []
  game.state.tsmfDiscount = 0

  // Expire all reservations (Helena signet, Manipulate plot) — trash any
  // unclaimed reserved cards.
  if (game.state.reservedCards.length > 0) {
    const reservedZone = game.zones.byId('common.reservedCards')
    const trash = game.zones.byId('common.trash')
    for (const card of [...reservedZone.cardlist()]) {
      card.moveTo(trash)
      game.log.add({
        template: 'Reserved {card} was not acquired — trashed',
        args: { card },
      })
    }
    game.state.reservedCards = []
  }

  // Pass first player clockwise
  const allPlayers = game.players.all()
  game.state.firstPlayerIndex = (game.state.firstPlayerIndex + 1) % allPlayers.length

  game.log.add({
    template: '{player} is now the First Player',
    args: { player: allPlayers[game.state.firstPlayerIndex] },
  })
}

/**
 * End game: resolve endgame intrigue cards, determine winner.
 * Tiebreakers: spice > solari > water > garrisoned troops.
 */
function endGame(game) {
  game.log.add({ template: 'Game Over', event: 'phase-start' })

  // Allow each player to play Endgame Intrigue cards
  for (const player of game.players.all()) {
    offerEndgameIntrigue(game, player)
  }

  // Wild battle icons defer their pairing to endgame (Bloodlines rule). After
  // endgame intrigue cards have had a chance to consume any face-up wilds,
  // each remaining face-up wild conflict card pairs with another face-up
  // battle icon card (conflict or objective) for +1 VP per pair.
  for (const player of game.players.all()) {
    pairEndgameWildIcons(game, player)
  }

  // Determine winner
  const players = game.players.all()
    .map(p => ({
      player: p,
      vp: p.vp,
      spice: p.spice,
      solari: p.solari,
      water: p.water,
      garrison: p.troopsInGarrison,
    }))
    .sort((a, b) => {
      if (a.vp !== b.vp) {
        return b.vp - a.vp
      }
      if (a.spice !== b.spice) {
        return b.spice - a.spice
      }
      if (a.solari !== b.solari) {
        return b.solari - a.solari
      }
      if (a.water !== b.water) {
        return b.water - a.water
      }
      return b.garrison - a.garrison
    })

  const winner = players[0].player

  game.log.add({
    template: '{player} wins with {vp} Victory Points!',
    args: { player: winner, vp: winner.vp },
  })

  throw new GameOverEvent({
    player: winner,
    reason: `${winner.vp} Victory Points`,
  })
}

/**
 * Offer a player the chance to play Endgame Intrigue cards.
 */
function offerEndgameIntrigue(game, player) {
  while (true) {
    const intrigueZone = game.zones.byId(`${player.name}.intrigue`)
    const endgameCards = intrigueZone.cardlist().filter(c =>
      c.definition && c.definition.endgameEffect
    )

    if (endgameCards.length === 0) {
      return
    }

    const choices = ['Pass', ...endgameCards.map(c => c.name)]
    const [choice] = game.actions.choose(player, choices, {
      title: 'Play an Endgame Intrigue card?',
    })

    if (choice === 'Pass') {
      return
    }

    const card = endgameCards.find(c => c.name === choice)
    if (!card) {
      return
    }

    const discardZone = game.zones.byId('common.intrigueDiscard')
    card.moveTo(discardZone)
    game.log.add({
      template: '{player} plays {card} (Endgame)',
      args: { player, card },
    })

    const endgameEffect = card.definition.endgameEffect
    if (typeof endgameEffect === 'function') {
      game.log.indent()
      endgameEffect(game, player, card)
      game.log.outdent()
      continue
    }

    const effectText = endgameEffect
    const effects = parseAgentAbility(effectText)
    if (effects) {
      game.log.indent()
      for (const effect of effects) {
        resolveEffect(game, player, effect, null)
      }
      game.log.outdent()
    }
    else {
      game.log.indent()
      game.log.add({
        template: '{effect}',
        args: { effect: effectText },
        event: 'memo',
      })
      game.log.outdent()
    }
  }
}

/**
 * Pair face-up wild battle icons with face-up cards bearing one of the three
 * real battle icons (Crysknife, Desert Mouse, Ornithopter) — conflict or
 * objective. Each pair flips both cards face-down and grants +1 VP. Wild
 * does not match during combat — its pairing is deferred to here. Two wilds
 * cannot pair with each other (the rule says "any other battle icon").
 */
function pairEndgameWildIcons(game, player) {
  const wonCards = game.state.conflict.wonCards?.[player.name] || []
  if (!game.state.conflict.flippedCardIds) {
    game.state.conflict.flippedCardIds = {}
  }
  if (!game.state.conflict.flippedCardIds[player.name]) {
    game.state.conflict.flippedCardIds[player.name] = []
  }
  const flipped = new Set(game.state.conflict.flippedCardIds[player.name])
  const objective = game.state.objectives?.[player.name]

  const faceUpBattleIcons = () => {
    const list = []
    for (const c of wonCards) {
      if (c.battleIcon && !flipped.has(c.id)) {
        list.push(c)
      }
    }
    if (objective && objective.battleIcon && !flipped.has(objective.id)) {
      list.push(objective)
    }
    return list
  }

  while (true) {
    const faceUp = faceUpBattleIcons()
    const wild = faceUp.find(c => c.battleIcon === 'wild')
    if (!wild) {
      break
    }
    const partner = faceUp.find(c => c.battleIcon !== 'wild')
    if (!partner) {
      break
    }
    flipped.add(wild.id)
    flipped.add(partner.id)
    player.incrementCounter('vp', 1, { silent: true })
    game.log.add({
      template: '{player} pairs Wild battle icon ({wild}) with {partner}: +1 Victory Point',
      args: { player, wild, partner },
    })
  }

  game.state.conflict.flippedCardIds[player.name] = [...flipped]
}

module.exports = { recallPhase }
