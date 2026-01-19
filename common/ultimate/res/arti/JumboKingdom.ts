import util from '../../../lib/util.js'

export default {
  name: `Jumbo Kingdom`,
  color: `purple`,
  age: 11,
  expansion: `arti`,
  biscuits: `hccs`,
  dogmaBiscuit: `c`,
  dogma: [
    `Choose a color on your board. Junk all cards of that color from all boards.`,
    `Choose a valued card in the junk. Score all cards of the chosen card's value in the junk. If you do, and you score fewer than eleven points, repeat this effect.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game.cards.tops(player).map(card => card.color)
      const color = game.actions.choose(player, choices, {
        title: 'Choose a color',
      })

      const toJunk = game.players.all().flatMap(player => game.cards.byPlayer(player, color))
      game.actions.junkMany(player, toJunk, { ordered: true })
    },

    (game, player) => {
      while (true) {
        const values = game
          .cards
          .byZone('junk')
          .filter(card => card.checkIsAgeCard())
          .map(card => card.getAge())
        const uniqueValues = util.array.distinct(values).sort((l, r) => l - r)
        const value = game.actions.chooseAge(player, uniqueValues)

        if (value) {
          const toScore = game.cards.byZone('junk').filter(card => card.checkIsAgeCard() && card.getAge() === value)
          const scored = game.actions.scoreMany(player, toScore, { ordered: true })
          const totalScore = scored.reduce((acc, card) => acc + card.getAge(), 0)
          if (scored.length > 0 && totalScore < 11) {
            game.log.add({
              template: '{player} scored fewer than 11 points',
              args: { player }
            })
            continue
          }
        }

        break
      }
    },
  ],
}
