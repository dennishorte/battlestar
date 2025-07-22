module.exports = {
  name: `Road Building`,
  color: `red`,
  age: 2,
  expansion: `base`,
  biscuits: `kkhk`,
  dogmaBiscuit: `k`,
  dogma: [
    `Meld one or two cards from your hand. If you meld two, you may transfer your top red card to another player's board. If you do, meld that player's top green card.`
  ],
  dogmaImpl: [
    (game, player) => {
      // Meld one or two cards
      const cards = game.actions.chooseAndMeld(player, game.cards.byPlayer(player, 'hand'), { min: 1, max: 2 })

      // If melded two...
      if (cards && cards.length === 2) {

        // Choose an opponent to swap with
        const choices = game
          .players.all()
          .filter(other => other !== player)
        const title = 'Choose a player to transfer your top red card to'
        const opp = game.actions.choosePlayer(player, choices, { title, min: 0, max: 1 })

        // If you chose to swap, do it.
        if (opp) {
          const topRed = game.getTopCard(player, 'red')

          if (topRed) {
            game.aTransfer(player, topRed, game.zones.byPlayer(opp, 'red'))

            // After transferring, meld their top green card
            const topGreen = game.getTopCard(opp, 'green')
            if (topGreen) {
              game.actions.meld(player, topGreen)
            }
          }
        }
        else {
          game.log.add({
            template: '{player} chooses not to transfer cards',
            args: { player }
          })
        }
      }
    }
  ],
}
