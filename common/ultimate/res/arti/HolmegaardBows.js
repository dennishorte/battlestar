module.exports = {
  name: `Holmegaard Bows`,
  color: `red`,
  age: 1,
  expansion: `arti`,
  biscuits: `klhl`,
  dogmaBiscuit: `l`,
  dogma: [
    `I compel you to transfer the highest top card with a {k} to my hand! If you don't, junk all cards in the deck of value equal to the value of your lowest top card!`,
    `Draw a {2}`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const topCastles = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('k'))
      const highest = game.utilHighestCards(topCastles)
      game.actions.chooseAndTransfer(player, highest, game.getZoneByPlayer(leader, 'hand'))
    },

    (game, player, { self }) => {
      game.aDraw(player, { age: game.getEffectAge(self, 2) })
    }
  ],
}
