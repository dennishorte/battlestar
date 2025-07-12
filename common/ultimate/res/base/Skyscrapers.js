module.exports = {
  name: `Skyscrapers`,
  color: `yellow`,
  age: 8,
  expansion: `base`,
  biscuits: `hfcc`,
  dogmaBiscuit: `c`,
  dogma: [
    `I demand you transfer a top non-yellow card with a {i} from your board to mine! If you do, score the top card of that color, then return all cards of that color from your board, and transfer Skyscrapers to my hand if it is a top card!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('i'))
      const cards = game.aChooseAndTransfer(player, choices, { toBoard: true, player: leader })
      if (cards && cards.length > 0) {
        const remaining = game.cards.byPlayer(player, cards[0].color)
        if (remaining.length > 0) {
          game.aScore(player, remaining[0])
        }
        game.aReturnMany(player, remaining.slice(1), { ordered: true })

        const topYellowCard = game.getTopCard(leader, 'yellow')
        if (topYellowCard && topYellowCard.name === 'Skyscrapers') {
          game.aTransfer(player, topYellowCard, game.zones.byPlayer(leader, 'hand'))
        }
      }
    }
  ],
}
