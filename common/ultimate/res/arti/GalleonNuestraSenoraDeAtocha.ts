import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Galleon Nuestra Senora De Atocha`,
  color: `red`,
  age: 4,
  expansion: `arti`,
  biscuits: `ffch`,
  dogmaBiscuit: `f`,
  dogma: [
    `I compel you to transfer all the cards of the value of my choice from your score pile to my score pile! If you transfered any, transfer a top card on your board of that value to my board.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const age = game.actions.chooseAge(leader)
      const toTransfer = game
        .cards
        .byPlayer(player, 'score')
        .filter(card => card.getAge() === age)
      const transferred = game.actions.transferMany(player, toTransfer, game.zones.byPlayer(leader, 'score'))

      if (transferred.length > 0) {
        const age = transferred[0].getAge()
        const choices = game
          .cards
          .tops(player)
          .filter(card => card.getAge() === age)
        const card = game.actions.chooseCard(player, choices)
        if (card) {
          game.actions.transfer(player, card, game.zones.byPlayer(leader, card.color))
        }

      }
    }
  ],
} satisfies AgeCardData
