module.exports = {
  name: `Shroud of Turin`,
  color: `purple`,
  age: 3,
  expansion: `arti`,
  biscuits: `lhll`,
  dogmaBiscuit: `l`,
  dogma: [
    `Return a card from your hand. If you do, return a top card from your board and a card from your score pile of the returned card's color. If you did all three, claim an achievement ignoring eligibility.`
  ],
  dogmaImpl: [
    (game, player) => {
      const returned = game.actions.chooseAndReturn(player, game.getCardsByZone(player, 'hand'))
      if (returned && returned.length > 0) {
        let totalReturned = 1

        const card = returned[0]
        const top = game.getTopCard(player, card.color)
        if (top && game.aReturn(player, top)) {
          totalReturned += 1
        }

        const fromScore = game
          .getCardsByZone(player, 'score')
          .filter(c => c.color === card.color)
        const score = game.actions.chooseAndReturn(player, fromScore)
        if (score && score.length > 0) {
          totalReturned += 1
        }

        if (totalReturned === 3) {
          game.actions.chooseAndAchieve(player, game.getAvailableAchievementsRaw(player))
        }
      }
    }
  ],
}
