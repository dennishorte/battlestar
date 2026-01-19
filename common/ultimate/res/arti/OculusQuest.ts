export default {
  name: `Oculus Quest`,
  color: `purple`,
  age: 11,
  expansion: `arti`,
  biscuits: `siih`,
  dogmaBiscuit: `i`,
  dogma: [
    `I compel you to transfer all cards on your board to your hand.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const toTransfer = game.zones.colorStacks(player).flatMap(zone => zone.cardlist())
      game.actions.transferMany(player, toTransfer, game.zones.byPlayer(player, 'hand'))
    },
  ],
}
