'use strict'

module.exports = {
  name: 'Lady Margot Fenring',
  source: 'Uprising',
  compatibility: 'Uprising',
  house: 'Fenring',
  startingEffect: null,
  leaderAbility: 'Loyalty\nWhen you reach 2 Influence with the Bene Gesserit:\n· +2 Spice',
  signetRingAbility: 'Arrakis Informant\n· +1 Spy on any purple space',
  complexity: 1,

  onGainInfluence(game, player, faction, newLevel) {
    if (faction !== 'bene-gesserit' || newLevel < 2) {
      return
    }
    if (!game.state.leaderBonusTriggered) {
      game.state.leaderBonusTriggered = {}
    }
    const key = `${player.name}-Lady Margot Fenring-bene-gesserit`
    if (game.state.leaderBonusTriggered[key]) {
      return
    }
    game.state.leaderBonusTriggered[key] = true
    player.incrementCounter('spice', 2, { silent: true })
    game.log.add({
      template: '{player}: Loyalty — +2 Spice',
      args: { player },
    })
  },

  resolveSignetRing(game, player, _resolveEffectFn) {
    const spies = require('../../systems/spies.js')
    const observationPosts = require('../observationPosts.js')
    const boardSpaces = require('../boardSpaces.js')

    const purpleSpaces = boardSpaces.filter(s => s.icon === 'purple')
    const purpleSpaceIds = new Set(purpleSpaces.map(s => s.id))
    const purplePosts = observationPosts.filter(p => purpleSpaceIds.has(p.spaceId))

    if (purplePosts.length === 0) {
      return
    }

    const choices = purplePosts.map(p => {
      const space = boardSpaces.find(s => s.id === p.spaceId)
      return space?.name || p.id
    })
    const [spaceName] = game.actions.choose(player, choices, {
      title: 'Arrakis Informant: Place Spy on which purple space?',
    })
    const post = purplePosts[choices.indexOf(spaceName)]
    spies.placeSpyAt(game, player, post.id)
    game.log.add({
      template: '{player}: Arrakis Informant — places Spy on {space}',
      args: { player, space: spaceName },
    })
  },
}
