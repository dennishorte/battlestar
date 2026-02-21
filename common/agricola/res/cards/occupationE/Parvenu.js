module.exports = {
  id: "parvenu-e145",
  name: "Parvenu",
  deck: "occupationE",
  number: 145,
  type: "occupation",
  players: "1+",
  text: "If you play this card in round 7 or before, choose clay or reed: you immediately get a number of that building resource equal to the number you already have in your supply.",
  onPlay(game, player) {
    if (game.state.round <= 7) {
      const selection = game.actions.choose(player, ['Clay', 'Reed'], {
        title: 'Parvenu: Choose clay or reed to double',
        min: 1,
        max: 1,
      })
      const resource = selection[0].toLowerCase()
      const amount = player[resource] || 0
      if (amount > 0) {
        player.addResource(resource, amount)
        game.log.add({
          template: '{player} gets {amount} {resource} from {card}',
          args: { player, amount, resource , card: this},
        })
      }
    }
  },
}
