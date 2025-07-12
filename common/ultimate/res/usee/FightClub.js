module.exports = {
  name: `Fight Club`,
  color: `red`,
  age: 10,
  expansion: `usee`,
  biscuits: `hppl`,
  dogmaBiscuit: `p`,
  dogma: [
    `I demand you transfer one of your secrets to my achievements!`,
    `You may splay your yellow cards up.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const choices = game.getCardsByZone(player, 'safe')
      const secret = game.actions.chooseCard(player, choices)

      if (secret) {
        game.aTransfer(player, secret, game.zones.byPlayer(leader, 'achievements'))
      }
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['yellow'], 'up')
    }
  ],
}
