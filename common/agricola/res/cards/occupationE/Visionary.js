module.exports = {
  id: "visionary-e155",
  name: "Visionary",
  deck: "occupationE",
  number: 155,
  type: "occupation",
  players: "1+",
  text: "If you play this card in round 4 or before, you get 1 stone, 1 vegetable, and 2 wild boar. You cannot grow your family until round 11, unless all other players already have.",
  onPlay(game, player) {
    if (game.state.round <= 4) {
      player.addResource('stone', 1)
      player.addResource('vegetables', 1)
      if (player.canPlaceAnimals('boar', 2)) {
        player.addAnimals('boar', 2)
      }
      player.cannotGrowFamilyUntilRound11 = true
      game.log.add({
        template: '{player} gets 1 stone, 1 vegetable, and 2 wild boar from {card}',
        args: { player , card: this},
      })
    }
  },
  canGrowFamily(player, game) {
    if (player.cannotGrowFamilyUntilRound11) {
      if (game.state.round >= 11) {
        return true
      }
      return game.players.all().filter(p => p.name !== player.name).every(p => p.getFamilySize() > 2)
    }
    return true
  },
}
