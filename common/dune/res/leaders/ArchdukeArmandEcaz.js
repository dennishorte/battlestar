'use strict'

const deckEngine = require('../../systems/deckEngine.js')

module.exports = {
  name: 'Archduke Armand Ecaz',
  source: 'Rise of Ix',
  compatibility: 'All',
  house: 'Ecaz',
  startingEffect: null,
  leaderAbility: 'Coordination\nReveal Turn:\n· If you have at least two Agents on green, purple, or yellow board spaces, you may trash one of your cards in play',
  signetRingAbility: 'Conscript\n· Acquire a card that costs 3 Persuasion or less',
  complexity: 2,

  onRevealTurn(game, player) {
    const spaces = require('../boardSpaces.js').getBoardSpaces(game.settings)
    const byId = Object.fromEntries(spaces.map(space => [space.id, space]))
    let coloredAgents = 0
    for (const [spaceId, names] of Object.entries(game.state.boardSpaces || {})) {
      const space = byId[spaceId]
      if (!space || !['green', 'purple', 'yellow'].includes(space.icon)) {
        continue
      }
      coloredAgents += (names || []).filter(name => name === player.name).length
    }
    if (coloredAgents < 2) {
      return
    }

    const playedZone = game.zones.byId(`${player.name}.played`)
    const playedCards = playedZone.cardlist()
    if (playedCards.length === 0) {
      return
    }
    const choices = [
      game.actions.option({ id: 'pass', title: 'Pass' }),
      ...playedCards.map(c => game.actions.cardOption(c, 'imperium-card')),
    ]
    const [choice] = game.actions.choose(player, choices, {
      title: 'Coordination: Trash a card in play?',
    })
    const choiceId = typeof choice === 'object' ? choice.id : choice
    if (choiceId !== 'pass' && choice !== 'Pass') {
      const card = typeof choice === 'object'
        ? playedCards.find(c => c.id === choice.id)
        : playedCards.find(c => c.name === choice)
      if (card) {
        deckEngine.trashCard(game, card, player)
        game.log.add({
          template: '{player}: Coordination — trashes {card}',
          args: { player, card },
        })
      }
    }
  },

  resolveSignetRing(game, player) {
    const row = game.zones.byId('common.imperiumRow').cardlist()
      .filter(card => (card.persuasionCost || 0) <= 3)
    const prepare = game.zones.byId('common.reserve.prepareTheWay').cardlist()[0]
    const cards = [...row]
    if (prepare && (prepare.persuasionCost || 0) <= 3) {
      cards.push(prepare)
    }
    if (cards.length === 0) {
      return
    }

    const [choice] = game.actions.choose(player, [
      game.actions.option({ id: 'pass', title: 'Pass' }),
      ...cards.map(card => game.actions.cardOption(card, 'imperium-card')),
    ], { title: 'Conscript: acquire a card costing 3 or less' })
    const choiceId = typeof choice === 'object' ? choice.id : choice
    if (!choiceId || choiceId === 'pass' || choice === 'Pass') {
      return
    }
    const card = cards.find(candidate => candidate.id === choiceId)
      || cards.find(candidate => candidate.name === choice)
    if (!card) {
      return
    }

    deckEngine.acquireCard(game, player, card)
    deckEngine.applyAcquireTroopBonus(game, player)
    if (typeof card.definition?.onAcquire === 'function') {
      card.definition.onAcquire(game, player, card, {})
    }
    game.log.add({
      template: '{player}: Conscript — acquires {card}',
      args: { player, card },
    })
  },
}
