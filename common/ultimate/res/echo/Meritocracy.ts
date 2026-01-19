import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Meritocracy`,
  color: `purple`,
  age: 11,
  expansion: `echo`,
  biscuits: `shst`,
  dogmaBiscuit: `s`,
  dogma: [
    `I demand you choose the standard icon of which I have the most among my icon types! Transfer all cards with that visible icon from your board to mine, or if Meritocracy was foreseen to my achievements!`
  ],
  dogmaImpl: [
    (game, player, { foreseen, leader }) => {
      // Biscuits that I have the most of on my board...
      const biscuits = Object
        .entries(leader.biscuits())
        .sort((l, r) => r[1] - l[1])

      const mostBiscuits = biscuits
        .filter(([, count]) => count === biscuits[0][1])
        .map(([biscuit,]) => game.util.biscuitIconToName(biscuit))

      // There's a weird edge case if the player somehow executes this card, but has no biscuits on their board.
      if (biscuits[0][1] === 0) {
        game.log.add({
          template: '{player} has no biscuits on their board',
          args: { player: leader },
        })
        return
      }

      // I demand you choose...
      const chosenBiscuitName = game.actions.choose(player, mostBiscuits)[0]
      const chosenBiscuit = game.util.biscuitNameToIcon(chosenBiscuitName)

      game.log.add({
        template: '{player} chooses {biscuit}',
        args: { player, biscuit: chosenBiscuit },
      })

      // Transfer all cards with that visible icon from your board to...
      const toTransfer = game
        .zones
        .colorStacks(player)
        .flatMap(stack => stack.cardlist())
        .filter(card => card.checkBiscuitIsVisible(chosenBiscuit))

      // or if Meritocracy was foreseen, to my achievements.
      if (foreseen) {
        game.actions.transferMany(player, toTransfer, game.zones.byPlayer(leader, 'achievements'))
      }

      // my board.
      else {
        game.actions.transferMany(player, toTransfer, { toBoard: true, player: leader })
      }
    }
  ],
} satisfies AgeCardData
