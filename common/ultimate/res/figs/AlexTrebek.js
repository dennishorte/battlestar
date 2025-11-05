module.exports = {
  id: `Alex Trebek`,  // Card names are unique in Innovation
  name: `Alex Trebek`,
  color: `yellow`,
  age: 10,
  expansion: `figs`,
  biscuits: `sh*s`,
  dogmaBiscuit: `s`,
  echo: ``,
  karma: [
    `If you would draw a card and have no figures of that value in hand, first say "Who is" and name a figure. Search the figures deck of that age for the named figure and take it into hand if present. Then shuffle that deck.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'draw',
      matches(game, player, { age }) {
        const cardsOfSameAge = game
          .zones.byPlayer(player, 'hand')
          .cards()
          .filter(card => card.getAge() === age)
          .filter(card => card.checkIsFigure())

        return cardsOfSameAge.length === 0
      },
      func(game, player, { age }) {
        const choices = game
          .getResources()
          .figs
          .byAge[age]
          .sort((l, r) => l.name.localeCompare(r.name))
        const card = game.actions.chooseCard(player, choices)

        game.log.add({
          template: '{player} says "Who is {name}?"',
          args: { player, name: card.name }
        })

        if (card.zone === card.home) {
          game.mMoveCardTo(card, game.zones.byPlayer(player, 'hand'))
          game.log.add({
            template: '{player} takes {card} into hand',
            args: { player, card }
          })
          game.mReveal(player, card)
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
