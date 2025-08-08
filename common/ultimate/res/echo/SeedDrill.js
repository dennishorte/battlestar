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
        .getTopCards(player)
        .filter(card => card.getAge() < 3)
      game.aChooseAndReturn(player, choices)
    },

    (game, player) => {
      const age = game.aChooseAge(player, [3, 4, 5])
      const cards = game.getZoneByDeck('base', age).cards()
      if (cards.length > 0) {
        const transfer = game.aYesNo(player, `Transfer a {${age}} to the achievements?`)
        if (transfer) {
          game.aTransfer(player, cards[cards.length - 1], game.getZoneById('achievements'))
        }
      }
    },
  ],
  echoImpl: [],
}
