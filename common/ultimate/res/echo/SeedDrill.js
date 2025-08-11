module.exports = {
  name: `Seed Drill`,
  color: `green`,
  age: 5,
  expansion: `echo`,
  biscuits: `sllh`,
  dogmaBiscuit: `l`,
  echo: [],
  dogma: [
    `I demand you return a top card from your board of value less than {3}!`,
    `Choose the {3}, {4}, or {5} deck. If there is at least one card in that deck, you may transfer its bottom card to the available achievements.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .cards.tops(player)
        .filter(card => card.getAge() < 3)
      game.actions.chooseAndReturn(player, choices)
    },

    (game, player) => {
      const age = game.actions.chooseAge(player, [3, 4, 5])
      const cards = game.zones.byDeck('base', age).cardlist()
      if (cards.length > 0) {
        const transfer = game.aYesNo(player, `Transfer a {${age}} to the achievements?`)
        if (transfer) {
          game.actions.transfer(player, cards[cards.length - 1], game.zones.byId('achievements'))
        }
      }
    },
  ],
  echoImpl: [],
}
