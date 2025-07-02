module.exports = {
  name: `Secret History`,
  color: `green`,
  age: 5,
  expansion: `usee`,
  biscuits: `fcfh`,
  dogmaBiscuit: `f`,
  dogma: [
    `I demand you transfer one of your secrets to my safe!`,
    `If your red and purple cards are splayed right, claim the Mystery achievement. Otherwise, splay your red or purple cards right.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const choices = game.getCardsByZone(player, 'safe')
      game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(leader, 'safe'), {
        title: 'Transfer a secret',
      })
    },

    (game, player) => {
      const redSplay = game.getZoneByPlayer(player, 'red').splay
      const purpleSplay = game.getZoneByPlayer(player, 'purple').splay

      if (redSplay === 'right' && purpleSplay === 'right') {
        game.aClaimAchievement(player, { name: 'Mystery' })
      }
      else {
        game.aChooseAndSplay(player, ['red', 'purple'], 'right', { count: 1 })
      }
    }
  ],
}
