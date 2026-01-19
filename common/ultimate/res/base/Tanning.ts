export default {
  name: `Tanning`,
  color: `purple`,
  age: 0,
  expansion: `base`,
  biscuits: `cchk`,
  dogmaBiscuit: `c`,
  dogma: [
    `Score two cards from your hand.`,
    `Transfer a card from your score pile to another player's board. If you do, meld that player's bottom card of the transferred card's color.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.chooseAndScore(player, game.cards.byPlayer(player, 'hand'), { count: 2 })
    },
    (game, player) => {
      const target = game.actions.choosePlayer(player, game.players.other(player))
      const transferred = game.actions.chooseAndTransfer(player, game.cards.byPlayer(player, 'score'), {
        toBoard: true,
        player: target
      })[0]

      if (transferred) {
        game.actions.meld(player, game.cards.bottom(target, transferred.color))
      }
    },
  ],
}
