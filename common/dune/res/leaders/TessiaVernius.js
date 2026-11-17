'use strict'

const deckEngine = require('../../systems/deckEngine.js')
const factions = require('../../systems/factions.js')
const constants = require('../constants.js')

const SNOOPERS = {
  J: 'emperor',
  K: 'guild',
  L: 'bene-gesserit',
  M: 'fremen',
}

function rewardIndex(game, player) {
  if (!game.state.tessiaRewards) {
    game.state.tessiaRewards = {}
  }
  return game.state.tessiaRewards[player.name] || 0
}

function snooperFactions(game, player) {
  const found = new Set()
  for (const [postId, occupants] of Object.entries(game.state.spyPosts || {})) {
    const names = Array.isArray(occupants) ? occupants : (occupants ? [occupants] : [])
    if (names.includes(player.name) && SNOOPERS[postId]) {
      found.add(SNOOPERS[postId])
    }
  }
  return [...found]
}

module.exports = {
  name: 'Tessia Vernius',
  source: 'Rise of Ix',
  compatibility: 'All',
  house: 'Vernius',
  startingEffect: null,
  leaderAbility: 'Careful Observation\nThe four rewards are one track, taken from top to bottom, one at a time. They are not tied to an influence number or a faction.\nWhenever you reach 2 Influence on a faction track, take the next reward:\n· Discard a card → +1 Spice\n· Gain the bonus from this token\'s Influence track\n· +1 Influence on this token\'s Influence track\n· Gain the bonus from this token\'s Influence track and +1 Influence on that track',
  signetRingAbility: 'Duplicity\nLose 1 Influence:\n· +1 Influence with a Faction where you have a Snooper token',
  complexity: 4,

  onGainInfluence(game, player, faction, next, prev) {
    if (!(prev < 2 && next >= 2)) {
      return
    }
    const index = rewardIndex(game, player)
    if (index >= 4) {
      return
    }
    game.state.tessiaRewards[player.name] = index + 1

    if (index === 0) {
      const hand = game.zones.byId(`${player.name}.hand`).cardlist()
      if (hand.length === 0) {
        return
      }
      const [choice] = game.actions.choose(player, [
        game.actions.option({ id: 'pass', title: 'Do not discard' }),
        ...hand.map(card => game.actions.cardOption(card, 'imperium-card')),
      ], { title: 'Careful Observation: discard a card for 1 Spice' })
      const choiceId = typeof choice === 'object' ? choice.id : choice
      if (!choiceId || choiceId === 'pass' || choice === 'Do not discard') {
        return
      }
      const card = hand.find(candidate => candidate.id === choiceId)
        || hand.find(candidate => candidate.name === choice)
      if (!card) {
        return
      }
      deckEngine.discardCard(game, player, card)
      player.incrementCounter('spice', 1, { silent: true })
      game.log.add({
        template: '{player}: Careful Observation — +1 Spice',
        args: { player },
      })
      return
    }

    if (index === 1) {
      factions.payFactionBonus(game, player, faction)
    }
    if (index === 2) {
      factions.gainInfluence(game, player, faction, 1)
    }
    if (index === 3) {
      // The payout is the reward. The extra influence is real, so a later
      // step to 4 still pays the normal bonus and the alliance once.
      if (player.getInfluence(faction) + 1 < 4) {
        factions.payFactionBonus(game, player, faction)
      }
      factions.gainInfluence(game, player, faction, 1)
    }
  },

  resolveSignetRing(game, player) {
    const canLose = constants.FACTIONS.filter(faction => player.getInfluence(faction) > 0)
    const canGain = snooperFactions(game, player)
    if (canLose.length === 0 || canGain.length === 0) {
      return
    }

    const [loseChoice] = game.actions.choose(player, canLose.map(faction => (
      game.actions.option({ id: faction, title: faction, kind: 'faction' })
    )), { title: 'Duplicity: lose 1 Influence' })
    const loseFaction = typeof loseChoice === 'object' ? loseChoice.id : loseChoice
    if (!canLose.includes(loseFaction)) {
      return
    }
    factions.loseInfluence(game, player, loseFaction, 1)

    const [gainChoice] = game.actions.choose(player, canGain.map(faction => (
      game.actions.option({ id: faction, title: faction, kind: 'faction' })
    )), { title: 'Duplicity: gain 1 Influence' })
    const gainFaction = typeof gainChoice === 'object' ? gainChoice.id : gainChoice
    if (!canGain.includes(gainFaction)) {
      return
    }
    factions.gainInfluence(game, player, gainFaction, 1)
  },
}
