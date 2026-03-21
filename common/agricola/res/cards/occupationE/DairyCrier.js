module.exports = {
  id: "dairy-crier-e167",
  name: "Dairy Crier",
  deck: "occupationE",
  number: 167,
  type: "occupation",
  players: "1+",
  text: "When you play this card, each player (including you) can choose to get 2 sheep or 2 food; you also get 1 cattle.",
  onPlay(game, player) {
    // Each player (including the card owner) chooses 2 sheep or 2 food
    for (const p of game.players.all()) {
      const selection = game.actions.choose(p, ['2 sheep', '2 food'], {
        title: 'Dairy Crier: Choose 2 sheep or 2 food',
        min: 1,
        max: 1,
      })
      if (selection[0] === '2 sheep') {
        game.actions.handleAnimalPlacement(p, { sheep: 2 })
        game.log.add({
          template: '{player} gets 2 sheep from {card}',
          args: { player: p, card: this },
        })
      }
      else {
        p.addResource('food', 2)
        game.log.add({
          template: '{player} gets 2 food from {card}',
          args: { player: p, card: this },
        })
      }
    }

    // Card owner also gets 1 cattle
    game.actions.handleAnimalPlacement(player, { cattle: 1 })
    game.log.add({
      template: '{player} gets 1 cattle from {card}',
      args: { player, card: this },
    })
  },
}
