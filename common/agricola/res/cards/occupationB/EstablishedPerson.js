const res = require('../../index.js')

module.exports = {
  id: "established-person-b088",
  name: "Established Person",
  deck: "occupationB",
  number: 88,
  type: "occupation",
  players: "1+",
  text: "If your house has exactly 2 rooms, immediately renovate it without paying any building resources. If you do, you can immediately afterward take a \"Build Fences\" action.",
  onPlay(game, player) {
    if (!player || player.getRoomCount() !== 2 || !player.canRenovate()) {
      return
    }
    const upgrades = res.houseMaterialUpgrades || { wood: 'clay', clay: 'stone', stone: null }
    const nextType = upgrades[player.roomType]
    if (!nextType) {
      return
    }
    player.roomType = nextType
    const rows = (res.constants && res.constants.farmyardRows) || 3
    const cols = (res.constants && res.constants.farmyardCols) || 5
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (player.farmyard.grid[row][col].type === 'room') {
          player.farmyard.grid[row][col].roomType = nextType
        }
      }
    }
    player.hasRenovated = true
    game.log.add({
      template: '{player} renovates for free ({card})',
      args: { player , card: this},
    })
    game.actions.buildFences(player)
  },
}
