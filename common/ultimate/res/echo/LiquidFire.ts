import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Liquid Fire`,
  color: `red`,
  age: 3,
  expansion: `echo`,
  biscuits: `hsss`,
  dogmaBiscuit: `s`,
  echo: ``,
  dogma: [
    `I demand you draw and reveal a card of value equal to the highest bonus on your board! Transfer it to my forecast! If it is red, transfer all cards from your hand to my score pile.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const age = Math.max(...game.getBonuses(player))
      if (age && age > 0) {
        const card = game.actions.drawAndReveal(player, age)
        if (card) {
          game.actions.transfer(player, card, game.zones.byPlayer(leader, 'forecast'))

          if (card.color === 'red') {
            game.actions.transferMany(player, game.cards.byPlayer(player, 'hand'), game.zones.byPlayer(leader, 'score'))
          }

        }
      }
      else {
        game.log.add({
          template: '{player} has no bonuses',
          args: { player }
        })
      }
    }
  ],
  echoImpl: [],
} satisfies AgeCardData
