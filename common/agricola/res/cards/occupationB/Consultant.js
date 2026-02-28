module.exports = {
  id: "consultant-b102",
  name: "Consultant",
  deck: "occupationB",
  number: 102,
  type: "occupation",
  players: "1+",
  text: "When you play this card in a 1-/2-/3-/4- player game, you immediately get 2 grain/3 clay/2 reed/2 sheep.",
  onPlay(game, player) {
    const playerCount = game.players.all().length
    if (playerCount === 1) {
      player.addResource('grain', 2)
      game.log.add({
        template: '{player} gets 2 grain from {card}',
        args: { player , card: this},
      })
    }
    else if (playerCount === 2) {
      player.addResource('clay', 3)
      game.log.add({
        template: '{player} gets 3 clay from {card}',
        args: { player , card: this},
      })
    }
    else if (playerCount === 3) {
      player.addResource('reed', 2)
      game.log.add({
        template: '{player} gets 2 reed from {card}',
        args: { player , card: this},
      })
    }
    else {
      if (player.canPlaceAnimals('sheep', 2)) {
        game.actions.handleAnimalPlacement(player, { sheep: 2 })
        game.log.add({
          template: '{player} gets 2 sheep from {card}',
          args: { player , card: this},
        })
      }
    }
  },
}
