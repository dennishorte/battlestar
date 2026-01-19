import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Dead Sea Scrolls`,
  color: `purple`,
  age: 2,
  expansion: `arti`,
  biscuits: `hksk`,
  dogmaBiscuit: `k`,
  dogma: [
    `Draw an Artifact of value equal to the value of your highest top card. Junk the artifact deck of that value.`,
    `Choose a player. Junk an available achievement of value equal the the highest top card on that player's board.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const highestTopAge = game.getHighestTopCard(player).getAge()
      game.actions.draw(player, { age: highestTopAge, exp: 'arti' })
      game.actions.junkDeck(player, highestTopAge, { exp: 'arti' })
    },

    (game, player) => {
      const chosenPlayer = game.actions.choosePlayer(player, game.players.active())
      const highestTopAge = game.getHighestTopCard(chosenPlayer).getAge()
      game.actions.junkAvailableAchievement(player, [highestTopAge])
    },
  ],
} satisfies AgeCardData
