module.exports = {
  id: "hook-knife-b035",
  name: "Hook Knife",
  deck: "minorB",
  number: 35,
  type: "minor",
  cost: { wood: 1 },
  category: "Points Provider",
  text: "Once this game, when you have 9/8/7/6/5/5 sheep on your farm in a 1-/2-/3-/4-/5-/6-player game, you immediately get 2 bonus points.",
  onPlay(game, player) {
    player.hookKnifeActive = true
  },
  checkTrigger(game, player) {
    if (!player.hookKnifeActive) {
      return
    }
    const playerCount = game.players.all().length
    const thresholds = { 1: 9, 2: 8, 3: 7, 4: 6, 5: 5, 6: 5 }
    const threshold = thresholds[playerCount] || 5
    const sheep = player.getTotalAnimals('sheep')
    if (sheep >= threshold) {
      player.hookKnifeActive = false
      player.bonusPoints = (player.bonusPoints || 0) + 2
      game.log.add({
        template: '{player} gets 2 bonus points from Hook Knife',
        args: { player },
      })
    }
  },
}
