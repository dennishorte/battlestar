module.exports = {
  name: `Telescope`,
  color: `blue`,
  age: 4,
  expansion: `echo`,
  biscuits: `h4s&`,
  dogmaBiscuit: `s`,
  echo: `Draw and foreshadow a {5}.`,
  dogma: [
    `You may place a card from your forecast on top of its deck. If you do, achieve a card from your forecast if you meet the requirements to do so.`
  ],
  dogmaImpl: [
    (game, player) => {
      const toPlace = game.actions.chooseCard(player, game.cards.byPlayer(player, 'forecast'), {
        title: 'Place a card from your forecast on top of its deck?',
        min: 0,
        max: 1
      })
      if (toPlace) {
        game.mMoveCardToTop(toPlace, game.zones.byId(toPlace.home), { player })

        const canAchieve = game
          .cards.byPlayer(player, 'forecast')
          .filter(card => game.checkAchievementEligibility(player, card))
        game.actions.chooseAndAchieve(player, canAchieve)
      }
    }
  ],
  echoImpl: (game, player) => {
    game.actions.drawAndForeshadow(player, game.getEffectAge(this, 5))
  },
}
