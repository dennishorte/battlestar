import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Fight Club`,
  color: `red`,
  age: 10,
  expansion: `usee`,
  biscuits: `hppl`,
  dogmaBiscuit: `p`,
  dogma: [
    `I demand you transfer one of your secrets to my achievements!`,
    `You may splay your yellow cards up.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const choices = game.cards.byPlayer(player, 'safe')
      const secret = game.actions.chooseCard(player, choices)

      if (secret) {
        game.actions.transfer(player, secret, game.zones.byPlayer(leader, 'achievements'))
      }

    },
    (game, player) => {
      game.actions.chooseAndSplay(player, ['yellow'], 'up')
    }
  ],
} satisfies AgeCardData
