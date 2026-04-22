'use strict'

// Feyd-Rautha Training Track: branching acyclic graph
// Start→A|B, A→C, B→C, C→D|E, D→Finish, E→F, F→Finish
const FEYD_TRACK = {
  start: { next: ['A', 'B'] },
  A: { next: ['C'], label: 'Pay 1 Solari to trash a card', reward: 'pay-solari-trash' },
  B: { next: ['C'], label: 'Place a Spy', reward: 'spy' },
  C: { next: ['D', 'E'], label: 'Trash a card', reward: 'trash' },
  D: { next: ['finish'], label: 'Trash a card', reward: 'trash' },
  E: { next: ['F'], label: 'Place a Spy', reward: 'spy' },
  F: { next: ['finish'], label: 'Gain 2 Spice', reward: 'spice' },
  finish: { next: [], label: 'Gain 1 Troop and place a Spy', reward: 'troop-spy' },
}

module.exports = {
  name: 'Feyd-Rautha Harkonnen',
  source: 'Uprising',
  compatibility: 'Uprising',
  house: 'Harkonnen',
  startingEffect: null,
  leaderAbility: 'Devious Strength\nReveal Turn:\n· Recall a Spy for 2 Strength',
  signetRingAbility: 'Personal Training\nMove your Feyd token one space to the right on your Training track, earning the reward on the new space.',
  complexity: 1,
  FEYD_TRACK,

  onAssign(game, player) {
    if (!game.state.feydTrack) {
      game.state.feydTrack = {}
    }
    game.state.feydTrack[player.name] = 'start'
  },

  onRevealTurn(game, player) {
    const spies = require('../../systems/spies.js')
    const constants = require('../constants.js')
    const observationPosts = require('../observationPosts.js')
    const playerPosts = observationPosts.filter(post => {
      const occupants = game.state.spyPosts[post.id] || []
      return occupants.includes(player.name)
    })
    if (playerPosts.length === 0) {
      return
    }
    const choices = ['Pass', ...playerPosts.map(p => `Post ${p.id}`)]
    const [choice] = game.actions.choose(player, choices, {
      title: 'Devious Strength: Recall a Spy for +2 Strength?',
    })
    if (choice === 'Pass') {
      return
    }
    spies.recallSpy(game, player)
    const { addStrength } = require('../../systems/strengthBreakdown.js')
    addStrength(game, player, 'leader', 'Devious Strength', 2 * constants.SWORD_STRENGTH)
    game.log.add({
      template: '{player}: Devious Strength — recalls Spy for +2 Strength',
      args: { player },
    })
  },

  resolveSignetRing(game, player, resolveEffectFn) {
    if (!game.state.feydTrack) {
      return
    }
    const current = game.state.feydTrack[player.name]
    if (!current || current === 'finish') {
      return
    }
    const node = FEYD_TRACK[current]
    if (!node || node.next.length === 0) {
      return
    }

    let nextNode
    if (node.next.length === 1) {
      nextNode = node.next[0]
    }
    else {
      const labels = node.next.map(n => `${n}: ${FEYD_TRACK[n].label}`)
      const [choice] = game.actions.choose(player, labels, {
        title: 'Feyd Training: Choose your path',
      })
      nextNode = node.next[labels.indexOf(choice)]
    }

    game.state.feydTrack[player.name] = nextNode
    const reward = FEYD_TRACK[nextNode]

    game.log.add({
      template: '{player}: Training Track → {node} ({label})',
      args: { player, node: nextNode, label: reward.label },
    })
    game.log.indent()
    switch (reward.reward) {
      case 'pay-solari-trash':
        if (player.solari >= 1) {
          player.decrementCounter('solari', 1, { silent: true })
          game.log.add({ template: '{player} pays 1 Solari', args: { player } })
          resolveEffectFn(game, player, { type: 'trash-card' }, null)
        }
        break
      case 'spy': {
        const spies = require('../../systems/spies.js')
        spies.placeSpy(game, player)
        break
      }
      case 'trash':
        resolveEffectFn(game, player, { type: 'trash-card' }, null)
        break
      case 'spice':
        player.incrementCounter('spice', 2, { silent: true })
        game.log.add({ template: '{player} gains 2 Spice', args: { player } })
        break
      case 'troop-spy': {
        resolveEffectFn(game, player, { type: 'troop', amount: 1 }, null)
        const spiesMod = require('../../systems/spies.js')
        spiesMod.placeSpy(game, player)
        break
      }
    }
    game.log.outdent()
  },
}
