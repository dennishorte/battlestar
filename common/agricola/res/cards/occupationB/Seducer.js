module.exports = {
  id: "seducer-b127",
  name: "Seducer",
  deck: "occupationB",
  number: 127,
  type: "occupation",
  players: "1+",
  text: "When you play this card in Round 5 or later, you can immediately pay 1 stone, 1 grain, 1 vegetable, and 1 sheep to take a \"Family Growth Even without Room\" action.",
  onPlay(game, player) {
    if (game.state.round < 5) {
      return
    }
    const canAfford = player.stone >= 1 && player.grain >= 1 && player.vegetables >= 1 &&
      player.getTotalAnimals('sheep') >= 1
    if (!canAfford || !player.canGrowFamily(false)) {
      return
    }
    const selection = game.actions.choose(player, [
      'Pay 1 stone, 1 grain, 1 vegetable, 1 sheep for Family Growth without Room',
      'Skip',
    ], {
      title: 'Seducer: Pay for Family Growth without Room?',
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Skip') {
      return
    }
    player.payCost({ stone: 1, grain: 1, vegetables: 1 })
    player.removeAnimals('sheep', 1)
    game.actions.familyGrowthWithoutRoom(player)
    game.log.add({
      template: '{player} pays 1 stone, 1 grain, 1 vegetable, 1 sheep for Family Growth ({card})',
      args: { player , card: this},
    })
  },
}
