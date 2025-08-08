module.exports = {
  name: `Toilet`,
  color: `purple`,
  age: 4,
  expansion: `echo`,
  biscuits: `&lhl`,
  dogmaBiscuit: `l`,
  echo: `Draw and tuck a {4}.`,
  dogma: [
    `I demand you return all cards from your score pile of value matching the highest bonus on my board!`,
    `You may return a card in your hand and draw a card of the same value.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const age = game
        .getBonuses(leader)
        .sort((l, r) => r - l)[0]
      const toReturn = game
        .getCardsByZone(player, 'score')
        .filter(card => card.age === age)

      game.aReturnMany(player, toReturn)
    },

    (game, player) => {
      const returned = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'), {
        title: 'Choose a card to cycle',
        min: 0,
        max: 1
      })
      if (returned.length > 0) {
        game.aDraw(player, { age: returned[0].getAge() })
      }
    }
  ],
  echoImpl: (game, player) => {
    game.aDrawAndTuck(player, game.getEffectAge(this, 4))
  },
}
