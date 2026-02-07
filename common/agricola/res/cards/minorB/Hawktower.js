module.exports = {
  id: "hawktower-b014",
  name: "Hawktower",
  deck: "minorB",
  number: 14,
  type: "minor",
  cost: { clay: 2 },
  prereqs: { maxRound: 7 },
  category: "Farm Planner",
  text: "Place a stone room on round space 12. If you live in a stone house at the start of that round, you can build the stone room at no cost. Otherwise, discard the stone room.",
  onPlay(game, player) {
    if (!game.state.hawktowerRooms) {
      game.state.hawktowerRooms = {}
    }
    game.state.hawktowerRooms[player.name] = 12
    game.log.add({
      template: '{player} schedules a free stone room for round 12 via Hawktower',
      args: { player },
    })
  },
  onRoundStart(game, player, round) {
    if (round === 12 && game.state.hawktowerRooms && game.state.hawktowerRooms[player.name]) {
      delete game.state.hawktowerRooms[player.name]
      if (player.roomType === 'stone') {
        game.actions.buildFreeRoom(player, this, 'stone')
      }
      else {
        game.log.add({
          template: '{player} discards the Hawktower room (not in stone house)',
          args: { player },
        })
      }
    }
  },
}
