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
      const opponent = game.actions.choosePlayer(player, game.players.opponents(player))
      const age = game.actions.chooseAge(player)

      const transferred = game.actions.chooseCard(player, game.cards.byPlayer(opponent, 'score'), {
        hidden: true,
        filter: card => card.getAge() === age,
      })
      if (transferred) {
        game.actions.transfer(player, transferred, game.zones.byPlayer(opponent, transferred.color))

        const matchingAchievements = game
          .cards
          .byPlayer(opponent, 'achievements')
          .filter(card => card.getAge() === transferred.getAge())

        if (matchingAchievements.length > 0) {
          game.actions.chooseAndAchieve(player, game.cards.byPlayer(opponent, 'score'), {
            hidden: true,
            filter: card => card.getAge() === age && player.canClaimAchievement(card),
          })
        }
      }
    }
  ],
  echoImpl: [
    (game, player, { self }) => {
      game.actions.drawAndMeld(player, game.getEffectAge(self, 8))
    }
  ],
}
