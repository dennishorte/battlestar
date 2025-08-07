module.exports = {
  name: `Dance`,
  color: `green`,
  age: 1,
  expansion: `usee`,
  biscuits: `llhl`,
  dogmaBiscuit: `l`,
  dogma: [
    `Transfer a top card on your board with {k} to the board of any other player. If you do, meld the lowest top card without {k} from that player's board.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('k'))

      const card = game.actions.chooseCard(player, choices)
      if (card) {
        const otherPlayers = game
          .players.opponentsOf(player)

        const targetPlayer = game.actions.choosePlayer(player, otherPlayers)
        game.actions.transfer(player, card, game.zones.byPlayer(targetPlayer, card.color))

        const topCastleCards = game
          .getTopCards(targetPlayer)
          .filter(card => !card.checkHasBiscuit('k'))

        const meldChoices = game.util.lowestCards(topCastleCards)

        const meldCard = game.actions.chooseCard(player, meldChoices, {
          title: 'Choose card to meld',
        })

        if (meldCard) {
          game.actions.meld(player, meldCard)
        }
      }
    },
  ],
}
