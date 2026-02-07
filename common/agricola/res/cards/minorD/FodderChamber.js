module.exports = {
  id: "fodder-chamber-d035",
  name: "Fodder Chamber",
  deck: "minorD",
  number: 35,
  type: "minor",
  cost: { stone: 3, grain: 3 },
  vps: 2,
  category: "Points Provider",
  text: "During scoring in a game with 1/2/3/4+ players, you get 1 bonus point for every 7th/5th/4th/3rd animal on your farm.",
  getEndGamePoints(player, game) {
    const playerCount = game.players.all().length
    const thresholds = { 1: 7, 2: 5, 3: 4 }
    const threshold = thresholds[playerCount] || 3
    const totalAnimals = player.getTotalAnimals('sheep') + player.getTotalAnimals('boar') + player.getTotalAnimals('cattle')
    return Math.floor(totalAnimals / threshold)
  },
}
