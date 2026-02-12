module.exports = {
  id: "renovation-materials-e002",
  name: "Renovation Materials",
  deck: "minorE",
  number: 2,
  type: "minor",
  cost: { clay: 3, reed: 1 },
  prereqs: { houseType: "wood" },
  text: "Immediately renovate to clay at no cost.",
  onPlay(game, player) {
    player.roomType = 'clay'
    const grid = player.farmyard.grid
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col].type === 'room') {
          grid[row][col].roomType = 'clay'
        }
      }
    }
    game.log.add({
      template: '{player} renovates to clay for free using {card}',
      args: { player, card: this },
    })
  },
}
