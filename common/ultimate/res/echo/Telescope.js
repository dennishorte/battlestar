module.exports = {
  name: `Telescope`,
  color: `blue`,
  age: 4,
  expansion: `echo`,
  biscuits: `h4s&`,
  dogmaBiscuit: `s`,
  echo: `Draw and foreshadow an Echoes {5}.`,
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
        game.log.add({
          template: '{player} returns {card} to the top of its deck',
          args: { player, card: toPlace }
        })
        toPlace.moveToTop(toPlace.home)
        game.actions.acted(player)


        const canAchieve = game
          .cards.byPlayer(player, 'forecast')
          .filter(card => player.isEligibleForAchievement(card))
        game.actions.chooseAndAchieve(player, canAchieve)
      }
    }
  ],
  echoImpl: (game, player, { self }) => {
    const card = game.actions.draw(player, { exp: 'echo', age: game.getEffectAge(self, 5) })
    if (card) {
      game.actions.foreshadow(player, card)
    }
  },
}
