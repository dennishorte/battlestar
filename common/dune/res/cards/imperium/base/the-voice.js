'use strict'

module.exports = {
  id: "the-voice",
  name: "The Voice",
  source: "Base",
  compatibility: "All",
  count: 2,
  persuasionCost: 2,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "Block 1 board space for Opponents this round",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: null,
  factionAffiliation: "bene-gesserit",
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  agentEffect(game, player) {
    // Block 1 board space for Opponents this round
    const boardSpacesData = require('../../../boardSpaces.js')
    const spaceChoices = boardSpacesData.map(s => game.actions.option({
      id: s.id,
      title: s.name,
      kind: 'board-space',
    }))
    const [choice] = game.actions.choose(player, spaceChoices, { title: 'Block a board space' })
    const chId = typeof choice === 'object' ? choice.id : null
    const chTitle = typeof choice === 'object' ? choice.title : choice
    const space = chId
      ? boardSpacesData.find(s => s.id === chId)
      : boardSpacesData.find(s => s.name === chTitle)
    if (space) {
      if (!game.state.blockedSpaces) {
        game.state.blockedSpaces = []
      }
      game.state.blockedSpaces.push(space.id)
      game.log.add({ template: '{player} blocks {space} for this round', args: { player, space: space.name } })
    }
  },

}
