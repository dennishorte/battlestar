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
      const handCards = game.zones.byPlayer(player, 'hand').cardlist()
      const scoreCards = game.zones.byPlayer(player, 'score').cardlist()
      const rightPlayer = game.players.rightOf(player)

      const choices = [...handCards, ...scoreCards]
      const selectedCard = game.actions.chooseCard(player, choices)

      if (selectedCard) {
        game.actions.transfer(player, selectedCard, game.zones.byPlayer(rightPlayer, selectedCard.color))
      }
      else {
        game.actions.claimAchievement(player, { name: 'Folklore' })
      }
    },
    (game, player) => {
      const pick = game.actions.choose(player, [
        game.actions.option({ id: 'yellow', title: 'yellow', kind: 'color' }),
        game.actions.option({ id: 'purple', title: 'purple', kind: 'color' }),
      ], {
        title: 'Choose a color to splay right',
      })[0]
      const selected = (pick && typeof pick === 'object') ? pick.id : pick

      if (selected === 'yellow') {
        game.actions.splay(player, 'yellow', 'right')
        game.actions.unsplay(player, 'purple')
      }
      else {
        game.actions.splay(player, 'purple', 'right')
        game.actions.unsplay(player, 'yellow')
      }
    }
  ],
}
