module.exports = {
  name: `Exoskeleton`,
  color: `red`,
  age: 11,
  expansion: `echo`,
  biscuits: `fhif`,
  dogmaBiscuit: `f`,
  dogma: [
    `I demand you transfer all but the lowest cards in your hand to my score pile.`,
    `You may achieve a card from any player's hand, if eligible. If you do, and Exoskeleton was foreseen, repeat this effect.`,
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const cardsInHand = game.cards.byPlayer(player, 'hand')
      const lowestCards = game.util.lowestCards(cardsInHand)

      game.actions.transferMany(player, cardsInHand, game.zones.byPlayer(leader, 'score'), {
        filter: card => !lowestCards.includes(card),
      })
    },

    (game, player, { foreseen, self }) => {
      game.log.addForeseen(foreseen, self)
      while (true) {
        const mayAchieve = game
          .players
          .all()
          .flatMap(p => game.cards.byPlayer(p, 'hand'))

        const achieved = game.actions.chooseAndAchieve(player, mayAchieve, {
          min: 0,
          max: 1,
          filter: card => player.canClaimAchievement(card),
        })

        if (foreseen && achieved.length > 0) {
          continue
        }
        else {
          break
        }
      }
    },
  ],
}
