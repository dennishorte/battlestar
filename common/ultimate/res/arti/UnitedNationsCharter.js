module.exports = {
  name: `United Nations Charter`,
  color: `red`,
  age: 9,
  expansion: `arti`,
  biscuits: `hlil`,
  dogmaBiscuit: `l`,
  dogma: [
    `I compel you to transfer all top cards on your board with a demand effect to my score pile!`,
    `If you have a top card on your board with a demand effect, draw a {0}.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const toTransfer = game
        .getTopCards(player)
        .filter(card => card.checkHasDemand())
      game.actions.transferMany(player, toTransfer, game.zones.byPlayer(leader, 'score'))
    },

    (game, player, { self }) => {
      const matches = game
        .getTopCards(player)
        .filter(card => card.checkHasDemand())
        .length > 0

      if (matches) {
        game.actions.draw(player, { age: game.getEffectAge(self, 10) })
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
}
