module.exports = {
  name: `Optics`,
  color: `red`,
  age: 3,
  expansion: `base`,
  biscuits: `ccch`,
  dogmaBiscuit: `c`,
  dogma: [
    `Draw and meld a {3}. If it has a {c}, draw and score a {4}. Otherwise, transfer a card from your score pile to the score pile of an opponent with fewer points than you.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndMeld(player, game.getEffectAge(self, 3))
      if (card) {
        if (card.checkHasBiscuit('c')) {
          game.log.add({
            template: '{card} has a {c} biscuit',
            args: { card }
          })
          game.actions.drawAndScore(player, game.getEffectAge(self, 4))
        }
        else {
          game.log.add({
            template: '{card} does not have a {c} biscuit',
            args: { card }
          })
          const playerScore = game.getScore(player)
          const targets = game
            .players.opponentsOf(player)
            .filter(other => game.getScore(other) < playerScore)

          if (targets.length > 0) {
            const targetPlayer = game.actions.choosePlayer(player, targets)
            game.actions.chooseAndTransfer(
              player,
              game.cards.byPlayer(player, 'score'),
              game.zones.byPlayer(targetPlayer, 'score')
            )
          }
        }
      }
    }
  ],
}
