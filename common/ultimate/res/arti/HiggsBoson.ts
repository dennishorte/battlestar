import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Higgs Boson`,
  color: `blue`,
  age: 10,
  expansion: `arti`,
  biscuits: `ppph`,
  dogmaBiscuit: `s`,
  dogma: [
    `Score all cards on your board.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.scoreMany(player, game.cards.fullBoard(player))
    }

  ],
} satisfies AgeCardData
