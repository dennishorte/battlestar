module.exports = {
  id: "field-caretaker-b141",
  name: "Field Caretaker",
  deck: "occupationB",
  number: 141,
  type: "occupation",
  players: "3+",
  text: "When you play this card, you can immediately exchange 0/1/3 clay for 1/2/3 grain. This card is a field.",
  isField: true,
  onPlay(game, player) {
    player.addVirtualField({
      cardId: 'field-caretaker-b141',
      label: 'Field Caretaker',
      cropRestriction: null,
    })
    game.log.add({
      template: '{player} plays {card}, gaining a field',
      args: { player , card: this},
    })
    // Exchange 0/1/3 clay for 1/2/3 grain
    const choices = [game.actions.option({ id: 'free', title: 'Take 1 grain (free)' })]
    if (player.clay >= 1) {
      choices.push(game.actions.option({ id: 'pay-1', title: 'Pay 1 clay for 2 grain' }))
    }
    if (player.clay >= 3) {
      choices.push(game.actions.option({ id: 'pay-3', title: 'Pay 3 clay for 3 grain' }))
    }

    const selection = game.actions.choose(player, choices, {
      title: 'Field Caretaker: Exchange clay for grain?',
      min: 1,
      max: 1,
    })

    if (selection[0].id === 'free') {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} takes 1 grain from {card}',
        args: { player , card: this},
      })
    }
    else if (selection[0].id === 'pay-1') {
      player.payCost({ clay: 1 })
      player.addResource('grain', 2)
      game.log.add({
        template: '{player} pays 1 clay for 2 grain from {card}',
        args: { player , card: this},
      })
    }
    else if (selection[0].id === 'pay-3') {
      player.payCost({ clay: 3 })
      player.addResource('grain', 3)
      game.log.add({
        template: '{player} pays 3 clay for 3 grain from {card}',
        args: { player , card: this},
      })
    }
  },
}
