import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Sanskrit`,
  color: `green`,
  age: 11,
  expansion: `arti`,
  biscuits: `shps`,
  dogmaBiscuit: `s`,
  dogma: [
    `Junk all cards in all score piles. If you don't, for each player, chose their highest top card, then for each other dfferent color, transfer their top card of that color to their score pile.`
  ],
  dogmaImpl: [
    (game, player) => {
      const toJunk = game
        .players
        .all()
        .flatMap(p => game.cards.byPlayer(p, 'score'))
      const junked = game.actions.junkMany(player, toJunk)

      if (junked.length !== toJunk.length) {
        game.log.add({
          template: '{player} did not junk all cards in all score piles',
          args: { player }

        })
      }
      else if (junked.length === 0) {
        game.log.add({
          template: 'All score piles were empty',
        })
      }

      if (junked.length === 0 || junked.length !== toJunk.length) {
        const others = game.players.other(player)
        while (others.length > 0) {
          const other = game.actions.choosePlayer(player, others)
          const options = game.util.highestCards(game.cards.tops(other))
          const chosen = game.actions.chooseCard(player, options)

          const removeIndex = others.findIndex(x => x.id === other.id)
          others.splice(removeIndex, 1)

          // Maybe they don't have any cards on their board.
          if (chosen) {
            const toTransfer = game
              .cards
              .tops(other)
              .filter(card => card.color !== chosen.color)
            game.actions.transferMany(player, toTransfer, game.zones.byPlayer(other, 'score'))
          }
        }
      }
    },
  ],
} satisfies AgeCardData
