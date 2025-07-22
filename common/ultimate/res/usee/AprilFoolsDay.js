module.exports = {
  name: `April Fool's Day`,
  color: `yellow`,
  age: 4,
  expansion: `usee`,
  biscuits: `hsll`,
  dogmaBiscuit: `l`,
  dogma: [
    `Transfer a card from your hand or score pile to the board of the player on your right. If you don't, claim the Folklore achievement.`,
    `Splay your yellow cards right, and unsplay your purple cards, or vice versa.`
  ],
  dogmaImpl: [
    (game, player) => {
      const handCards = game.zones.byPlayer(player, 'hand').cards()
      const scoreCards = game.zones.byPlayer(player, 'score').cards()
      const rightPlayer = game.players.rightOf(player)

      const choices = [...handCards, ...scoreCards]
      const selectedCard = game.actions.chooseCard(player, choices)

      if (selectedCard) {
        game.aTransfer(player, selectedCard, game.zones.byPlayer(rightPlayer, selectedCard.color))
      }
      else {
        game.actions.claimAchievement(player, { name: 'Folklore' })
      }
    },
    (game, player) => {
      const selected = game.actions.choose(player, ['yellow', 'purple'], {
        title: 'Choose a color to splay right',
      })[0]

      if (selected === 'yellow') {
        game.aSplay(player, 'yellow', 'right')
        game.aUnsplay(player, 'purple')
      }
      else {
        game.aSplay(player, 'purple', 'right')
        game.aUnsplay(player, 'yellow')
      }
    }
  ],
}
