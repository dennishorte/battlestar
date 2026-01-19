import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Emma Watson`,  // Card names are unique in Innovation
  name: `Emma Watson`,
  color: `purple`,
  age: 11,
  expansion: `figs`,
  biscuits: `hppp`,
  dogmaBiscuit: `p`,
  karma: [
    `When you meld this card, unsplay all colors on all boards.`,
    `If a player would meld a card, first return their top six cards of its color. If you don't, that player scores all cards of its color from all boards.`
  ],
  karmaImpl: [
    {
      trigger: 'when-meld',
      matches: () => true,
      func: (game, player) => {
        for (const target of game.players.all()) {
          for (const color of game.util.colors()) {
            game.actions.unsplay(player, game.zones.byPlayer(target, color))
          }

        }
      }
    },
    {
      trigger: 'meld',
      triggerAll: true,
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card, owner }) => {
        const toReturn = game.cards.byPlayer(player, card.color).slice(0, 6)
        const returned = game.actions.returnMany(owner, toReturn)

        if (returned.length < 6) {
          game.log.add({
            template: 'Fewer than six cards were returned'
          })

          const toScore = game
            .players
            .all()
            .flatMap(target => game.cards.byPlayer(target, card.color))

          game.actions.scoreMany(player, toScore)
        }
      }
    }
  ]
} satisfies AgeCardData
