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

  // Per rules.txt: "reach 2" is the upward crossing of the threshold. Fires every
  // time the player crosses from below 2 to >=2, including after losing and
  // regaining influence.
  onGainInfluence(game, player, faction, newLevel, prev) {
    if (faction !== 'bene-gesserit') {
      return
    }
    if (prev >= 2 || newLevel < 2) {
      return
    }
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

    const purpleSpaceIds = new Set(
      boardSpaces.filter(s => s.icon === 'purple').map(s => s.id)
    )
    const purplePosts = observationPosts.filter(post =>
      post.spaces.some(id => purpleSpaceIds.has(id))
      && !(game.state.spyPosts[post.id] || []).includes(player.name)
    )

    if (purplePosts.length === 0 || player.spiesInSupply <= 0) {
      return
    }

    const labels = purplePosts.map(post => {
      const spaceNames = post.spaces.map(id => {
        const space = boardSpaces.find(s => s.id === id)
        return space ? space.name : id
      })
      return `Post ${post.id} (${spaceNames.join(', ')})`
    })
    const [pick] = game.actions.choose(player, labels, {
      title: 'Arrakis Informant: Place Spy on which purple post?',
    })
    const post = purplePosts[labels.indexOf(pick)]
    spies.placeSpyAt(game, player, post.id)
  },
}
