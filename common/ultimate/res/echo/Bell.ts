export default {
  name: `Bell`,
  color: `purple`,
  age: 1,
  expansion: `echo`,
  biscuits: `kmk&`,
  dogmaBiscuit: `k`,
  echo: `You may score a card from your hand.`,
  dogma: [
    `Draw and foreshadow a {1} and a {2}.`,
    `If Bell was foreseen, return all cards from all hands.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.actions.drawAndForeshadow(player, game.getEffectAge(self, 1))
      game.actions.drawAndForeshadow(player, game.getEffectAge(self, 2))
    },

    (game, player, { foreseen, self }) => {
      game.log.addForeseen(foreseen, self)

      if (foreseen) {
        const cards = game.players.all().flatMap(p => game.cards.byPlayer(p, 'hand'))

        game.log.add({ template: 'I do not have a good way to hide only the cards in other player hands, so the game just automatically returns them all.' })
        game.actions.returnMany(player, cards, { ordered: true })
      }
    },
  ],
  echoImpl: (game, player) => {
    game.actions.chooseAndScore(player, game.cards.byPlayer(player, 'hand'), { min: 0, max: 1 })
  },
}
