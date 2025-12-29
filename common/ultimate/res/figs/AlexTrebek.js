module.exports = {
  id: `Alex Trebek`,  // Card names are unique in Innovation
  name: `Alex Trebek`,
  color: `yellow`,
  age: 10,
  expansion: `figs`,
  biscuits: `shps`,
  dogmaBiscuit: `s`,
  karma: [
    `If you would draw a card and have no figures in hand, first say "Who is" and name a figure. Search the figures deck of any age for the named figure and take it into hand if present. Then shuffle that deck.`
  ],
  karmaImpl: [
    {
      trigger: 'draw',
      matches: (game, player) => game.cards.byPlayer(player, 'hand').every(card => !card.checkIsFigure()),
      func: (game, player) => {
        const age = game.actions.chooseAge(player, game.getAges())

        const choices = game.zones.byDeck('figs', age).cardlist()
          .filter(card => card.checkIsFigure())
          .sort((l, r) => l.name.localeCompare(r.name))
        const card = game.actions.chooseCard(player, choices, {
          title: 'Who is...?',
          visible: true,
        })

        game.log.add({
          template: '{player} says "Who is {name}?"',
          args: { player, name: card.name }
        })

        if (card.zone === card.home) {
          card.moveTo(game.zones.byPlayer(player, 'hand'))
          game.actions.reveal(player, card)
          game.log.add({
            template: '{player} takes {card} into hand',
            args: { player, card }
          })
        }
        else {
          game.log.add({
            template: '{player} does not find {card} in the deck',
            args: { player, card }
          })
        }
      }
    }
  ]
}
