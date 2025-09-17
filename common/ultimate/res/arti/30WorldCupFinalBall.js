module.exports = {
  name: `'30 World Cup Final Ball`,
  color: `purple`,
  age: 8,
  expansion: `arti`,
  biscuits: `llih`,
  dogmaBiscuit: `l`,
  dogma: [
    `I compel you to return one of your achievements!`,
    `Draw and reveal an {8}. The single player with the highest top card of the drawn card's color achieves it, ignoring eligibility. If that happens, repeat this effect.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'achievements'))
    },

    (game, player, { self }) => {
      while (true) {
        const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 8))
        const orderedPlayers = game
          .players.all()
          .map(player => ({ player, card: game.cards.top(player, card.color) }))
          .filter(x => x.card !== undefined)
          .map(({ player, card }) => ({ player, age: card.getAge() }))
          .sort((l, r) => r.age - l.age)

        if (
          orderedPlayers.length === 1
          || (orderedPlayers.length > 1 && orderedPlayers[0].age > orderedPlayers[1].age)
        ) {
          game.actions.claimAchievement(orderedPlayers[0].player, card)

        }
        else {
          game.log.add({
            template: 'No single player has the highest top card.'
          })
          break
        }
      }
    },
  ],
}
