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

  agentEffect(game, player) {
    // The normal agentTurn flow already placed the agent at the destination and
    // incremented agentsPlaced. KH moves an existing agent instead of adding one,
    // so we pick a source, remove it, and decrement agentsPlaced back (net: no change).
    const destSpaceId = game.state.turnTracking?.agentSpaceId
    const occupiedSpaces = Object.entries(game.state.boardSpaces)
      .filter(([id, occupants]) => (occupants || []).includes(player.name) && id !== destSpaceId)

    if (occupiedSpaces.length === 0) {
      game.log.add({ template: '{player}: Kwisatz Haderach — no other Agents to move', args: { player }, event: 'memo' })
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
      const destSpace = boardSpaces.find(s => s.id === destSpaceId)
      game.log.add({
        template: '{player}: Kwisatz Haderach — moves Agent from {source} to {dest}',
        args: {
          player,
          source: sourceSpace ? sourceSpace.name : spaceId,
          dest: destSpace ? destSpace.name : destSpaceId,
        },
      })
    }
  },

}
