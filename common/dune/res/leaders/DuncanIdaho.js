'use strict'

module.exports = {
  name: 'Duncan Idaho',
  source: 'Bloodlines',
  compatibility: 'All',
  house: 'Atreides',
  startingEffect: null,
  leaderAbility: 'Ginaz Swordmaster\nThe Swordmaster board space costs you 2 Solari less.',
  signetRingAbility: 'Into the Fray\nYou may take an Agent you sent this turn and deploy it to the Conflict as a 2 strength unit that can\'t be retreated.\nIf you have your Swordmaster: 3 strength instead.',
  complexity: 1,

  modifySpaceCost(_game, _player, space, baseCost) {
    if (space.id === 'sword-master' && baseCost.solari) {
      return { ...baseCost, solari: Math.max(0, baseCost.solari - 2) }
    }
    return baseCost
  },
}
