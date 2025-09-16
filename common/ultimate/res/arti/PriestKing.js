module.exports = {
  name: `Priest-King`,
  color: `green`,
  age: 1,
  expansion: `arti`,
  biscuits: `khkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `Score a card from your hand. If you have a top card matching its color, execute each of the top card's non-demand dogma effects. Do not share them.`,
    `Claim an achievement, if eligible.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.aChooseAndScore(player, game.getCardsByZone(player, 'hand'))
      if (cards && cards.length > 0) {
        const card = cards[0]
        const top = game.getTopCard(player, card.color)
        if (top) {
          game.aCardEffects(player, top, 'dogma')
        }
      }
    },

    (game, player) => {
      const choices = game.getEligibleAchievementsRaw(player)
      game.aChooseAndAchieve(player, choices)
    }
  ],
}
