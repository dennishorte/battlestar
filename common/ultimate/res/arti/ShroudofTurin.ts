export default {
  name: `Shroud of Turin`,
  color: `purple`,
  age: 3,
  expansion: `arti`,
  biscuits: `lhll`,
  dogmaBiscuit: `l`,
  dogma: [
    `Return a card from your hand. If you do, return a top card of the same color from your board and a card of the same color from your score pile. If you do all three, claim an available achievement ignoring eligibility.`
  ],
  dogmaImpl: [
    (game, player) => {
      const returned = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'))
      if (returned && returned.length > 0) {
        let totalReturned = 1

        const card = returned[0]
        const top = game.cards.top(player, card.color)
        if (top && game.actions.return(player, top)) {
          totalReturned += 1
        }

        const fromScore = game
          .cards.byPlayer(player, 'score')
          .filter(c => c.color === card.color)
        const score = game.actions.chooseAndReturn(player, fromScore)
        if (score && score.length > 0) {
          totalReturned += 1
        }

        if (totalReturned === 3) {
          game.actions.chooseAndAchieve(player, game.getAvailableStandardAchievements(player))
        }
      }
    }
  ],
}
