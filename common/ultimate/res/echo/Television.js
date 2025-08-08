module.exports = {
  name: `Television`,
  color: `purple`,
  age: 8,
  expansion: `echo`,
  biscuits: `8hi&`,
  dogmaBiscuit: `i`,
  echo: [`Draw and meld an {8}.`],
  dogma: [
    `Choose a value and and opponent. Transfer a card of that value from their score pile to their board. If they have an achievement of the same value, achieve (if eligible) a card of that value from their score pile.`
  ],
  dogmaImpl: [
    (game, player) => {
      const opponent = game.aChoosePlayer(player, game.getPlayerOpponents(player))
      const age = game.aChooseAge(player)

      const choices = game
        .getCardsByZone(opponent, 'score')
        .filter(card => card.getAge() === age)
      const transferred = game.aChooseCard(player, choices)
      if (transferred) {
        game.aTransfer(player, transferred, game.getZoneByPlayer(opponent, transferred.color))

        const matchingAchievements = game
          .getCardsByZone(opponent, 'achievements')
          .filter(card => card.getAge() === transferred.getAge())

        if (matchingAchievements.length > 0) {
          const achieveChoices = game
            .getCardsByZone(opponent, 'score')
            .filter(card => card.getAge() === age)
            .filter(card => game.checkAchievementEligibility(player, card))
          game.aChooseAndAchieve(player, achieveChoices)
        }
      }
    }
  ],
  echoImpl: [
    (game, player) => {
      game.aDrawAndMeld(player, game.getEffectAge(this, 8))
    }
  ],
}
