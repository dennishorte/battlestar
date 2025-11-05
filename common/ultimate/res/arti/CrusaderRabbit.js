module.exports = {
  name: `Crusader Rabbit`,
  color: `red`,
  age: 9,
  expansion: `arti`,
  biscuits: `hlil`,
  dogmaBiscuit: `l`,
  dogma: [
    `I compel you to transfer the two bottom cards of each color which has a top card with a demand effect to my score pile.`,
    `If you have a top card on your board with a demand effect, score it, and draw a {0}.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const demandColors = game
        .cards
        .tops(player)
        .filter(card => card.checkHasDemand())
        .map(card => card.color)
      const toTransfer = demandColors.flatMap(color => game.cards.byPlayer(player, color).slice(-2))
      game.actions.transferMany(player, toTransfer, game.zones.byPlayer(leader, 'score'))
    },

    (game, player, { self }) => {
      const matches = game
        .cards
        .tops(player)
        .filter(card => card.checkHasDemand())

      if (matches.length > 0) {
        game.actions.chooseAndScore(player, matches)
        game.actions.draw(player, { age: game.getEffectAge(self, 10) })
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
}
