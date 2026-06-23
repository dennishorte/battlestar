'use strict'

module.exports = {
  id: "kwisatz-haderach",
  name: "Kwisatz Haderach",
  source: "Base",
  compatibility: "All",
  count: 1,
  persuasionCost: 8,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green",
    "purple",
    "yellow"
  ],
  factionAccess: [
    "emperor",
    "guild",
    "bene-gesserit",
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "· Move one of your Agents from a board space to any other board space\n· Perform that space's action as if you had just placed an Agent there",
  revealPersuasion: 0,
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
  movesExistingAgent: true,

  prePlacementEffect(game, player) {
    // Choose which existing agent to recall before the destination is selected.
    // Removing it first means the vacated space is available as a destination
    // (e.g. the player can send the agent back to the same space it just left).
    const occupiedSpaces = Object.entries(game.state.boardSpaces)
      .filter(([, occupants]) => (occupants || []).includes(player.name))

    if (occupiedSpaces.length === 0) {
      return
    }

    const boardSpaces = require('../../../boardSpaces.js')
    const sourceChoices = occupiedSpaces.map(([id]) => {
      const space = boardSpaces.find(s => s.id === id)
      return game.actions.option({ id, title: space ? space.name : id, kind: 'board-space' })
    })

    const [sourceChoice] = game.actions.choose(player, sourceChoices, {
      title: 'Choose an Agent to move (Kwisatz Haderach)',
    })

    const sourceId = typeof sourceChoice === 'object' ? sourceChoice.id : null
    const sourceTitle = typeof sourceChoice === 'object' ? sourceChoice.title : sourceChoice
    const sourceEntry = sourceId
      ? occupiedSpaces.find(([id]) => id === sourceId)
      : occupiedSpaces.find(([id]) => {
        const s = boardSpaces.find(sp => sp.id === id)
        return (s ? s.name : id) === sourceTitle
      })

    if (sourceEntry) {
      const [spaceId, occupants] = sourceEntry
      const idx = occupants.indexOf(player.name)
      if (idx !== -1) {
        occupants.splice(idx, 1)
      }
      player.decrementCounter('agentsPlaced', 1, { silent: true })
      const sourceSpace = boardSpaces.find(s => s.id === spaceId)
      game.state.turnTracking.khSourceSpace = sourceSpace ? sourceSpace.name : spaceId
    }
  },

  agentEffect(game, player) {
    const sourceSpaceName = game.state.turnTracking?.khSourceSpace
    if (!sourceSpaceName) {
      game.log.add({ template: '{player}: Kwisatz Haderach — no Agents to move', args: { player }, event: 'memo' })
      return
    }
    const boardSpaces = require('../../../boardSpaces.js')
    const destSpaceId = game.state.turnTracking?.agentSpaceId
    const destSpace = boardSpaces.find(s => s.id === destSpaceId)
    game.log.add({
      template: '{player}: Kwisatz Haderach — moves Agent from {source} to {dest}',
      args: {
        player,
        source: sourceSpaceName,
        dest: destSpace ? destSpace.name : destSpaceId,
      },
    })
  },

}
