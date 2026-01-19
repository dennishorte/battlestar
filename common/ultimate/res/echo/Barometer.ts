import util from '../../../lib/util.js'

export default {
  name: `Barometer`,
  color: `yellow`,
  age: 4,
  expansion: `echo`,
  biscuits: `l&lh`,
  dogmaBiscuit: `l`,
  echo: `Transfer a {5} from your forecast to your hand.`,
  dogma: [
    `Draw and foreshadow a card of value two higher than a bonus on any board, if there is one.`,
    `You may return all the cards in your forecast. If any were blue, claim the Destiny achievement.`
  ],
  dogmaImpl: [
    (game, player) => {
      const bonuses = game
        .players.all()
        .flatMap(player => game.getBonuses(player))
        .map(bonus => bonus + 2)
        .sort((l, r) => l - r)
      const distinct = util.array.distinct(bonuses)
      const age = game.actions.chooseAge(player, distinct)
      if (age) {
        game.actions.drawAndForeshadow(player, age)
      }
    },

    (game, player) => {
      const returnAll = game.actions.chooseYesNo(player, 'Return all card from your forecast?')
      if (returnAll) {
        const returned = game.actions.returnMany(player, game.cards.byPlayer(player, 'forecast'))
        if (returned && returned.some(card => card.color === 'blue')) {
          game.actions.claimAchievement(player, { name: 'Destiny' })
        }
      }
    },
  ],
  echoImpl: (game, player) => {
    const choices = game
      .cards.byPlayer(player, 'forecast')
      .filter(card => card.getAge() === 5)
    game.actions.chooseAndTransfer(player, choices, game.zones.byPlayer(player, 'hand'))
  },
}
