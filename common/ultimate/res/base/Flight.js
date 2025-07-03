module.exports = {
  name: `Flight`,
  color: `red`,
  age: 8,
  expansion: `base`,
  biscuits: `chic`,
  dogmaBiscuit: `c`,
  dogma: [
    `If your red cards are splayed up, you may splay any one color of your cards up.`,
    `You may splay your red cards up.`
  ],
  dogmaImpl: [
    (game, player) => {
      const redSplay = game.getZoneByPlayer(player, 'red').splay
      if (redSplay === 'up') {
        game.aChooseAndSplay(player, null, 'up')
      }
      else {
        game.log.add({ template: 'no effect' })
      }
    },
    (game, player) => {
      const redSplay = game.getZoneByPlayer(player, 'red').splay
      if (redSplay === 'up') {
        game.log.add({ template: 'no effect' })
      }
      else {
        game.aChooseAndSplay(player, ['red'], 'up')
      }
    }
  ],
}
