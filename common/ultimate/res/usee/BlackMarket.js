module.exports = {
  name: `Black Market`,
  color: `green`,
  age: 7,
  expansion: `usee`,
  biscuits: `hcfc`,
  dogmaBiscuit: `c`,
  dogma: [
    `You may safeguard a card from your hand. If you do, reveal two available standard achievements. You may meld a revealed card with no {i} or {p}. Return each revealed card you do not meld.`
  ],
  dogmaImpl: [
    (game, player) => {
      const safeguarded = game.aChooseAndSafeguard(player, game.cards.byPlayer(player, 'hand'), { min: 0, max: 1 })

      if (safeguarded && safeguarded.length > 0) {
        const availableAchievements = game.getAvailableStandardAchievements(player)
        const achievements = game.actions.chooseCards(player, availableAchievements, {
          title: 'Choose two available achievements to reveal',
          hidden: true,
          count: 2,
        })

        const revealed = game.aRevealMany(player, achievements, { ordered: true })

        const meldableAchievements = achievements.filter(card => !card.checkHasBiscuit('i') && !card.checkHasBiscuit('p'))

        const toMeld = game.actions.chooseCard(player, meldableAchievements, { min: 0, max: 1 })

        if (toMeld) {
          game.aMeld(player, toMeld)
        }

        const toReturn = revealed.filter(card => !toMeld || card.id !== toMeld.id)
        game.aReturnMany(player, toReturn)
      }
    },
  ],
}
