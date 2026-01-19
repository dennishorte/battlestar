export default {
  name: `Compass`,
  color: `green`,
  age: 3,
  expansion: `base`,
  biscuits: `hccl`,
  dogmaBiscuit: `c`,
  dogma: [
    `I demand you transfer a top non-green card with {l} from your board to my board, and then meld a top card without {l} from my board!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const leafChoices = game
        .cards.tops(player)
        .filter(card => card.color !== 'green')
        .filter(card => card.checkHasBiscuit('l'))

      const card = game.actions.chooseCard(player, leafChoices)
      if (card) {
        game.actions.transfer(player, card, game.zones.byPlayer(leader, card.color))
      }

      const nonLeafChoices = game
        .cards.tops(leader)
        .filter(card => !card.checkHasBiscuit('l'))

      const card2 = game.actions.chooseCard(player, nonLeafChoices)
      if (card2) {
        game.actions.meld(player, card2)
      }
    }
  ],
}
