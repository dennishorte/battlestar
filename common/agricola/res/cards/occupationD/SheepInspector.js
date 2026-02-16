module.exports = {
  id: "sheep-inspector-d093",
  name: "Sheep Inspector",
  deck: "occupationD",
  number: 93,
  type: "occupation",
  players: "1+",
  text: "Once per work phase, after you complete a person action, you can pay 1 sheep and 2 food to return another person you placed home.",
  onPersonActionEnd(game, player) {
    const s = game.cardState(this.id)
    if (s.usedThisWorkPhase) {
      return
    }
    if (player.getTotalAnimals('sheep') < 1 || player.food < 2) {
      return
    }
    if (player.getPersonPlacedThisRound() < 2) {
      return
    }
    const choices = ['Pay 1 sheep + 2 food to free a worker', 'Skip']
    const selection = game.actions.choose(player, choices, {
      title: 'Sheep Inspector',
      min: 1,
      max: 1,
    })
    if (selection[0] !== 'Skip') {
      s.usedThisWorkPhase = true
      player.food -= 2
      player.removeAnimals('sheep', 1)
      // Grant an extra worker placement
      player.availableWorkers += 1
      game.log.add({
        template: '{player} pays 1 sheep + 2 food to return a worker home (Sheep Inspector)',
        args: { player },
      })
    }
  },
  onWorkPhaseStart(game, _player) {
    game.cardState(this.id).usedThisWorkPhase = false
  },
}
