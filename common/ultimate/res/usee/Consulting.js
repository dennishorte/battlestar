module.exports = {
  name: `Consulting`,
  color: `blue`,
  age: 9,
  expansion: `usee`,
  biscuits: `hffc`,
  dogmaBiscuit: `f`,
  dogma: [
    `Choose an opponent. Draw and meld two {0}. Super-execute the top card on your board of that player's choice.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const opponent = game.actions.choosePlayer(player, game.players.opponentsOf(player))

      game.actions.drawAndMeld(player, game.getEffectAge(self, 10))
      game.actions.drawAndMeld(player, game.getEffectAge(self, 10))

      const topCards = game.getTopCards(player)
      const card = game.actions.chooseCard(opponent, topCards)

      game.log.add({
        template: '{opponent} chooses {card} for {player} to execute',
        args: { opponent, player, card }
      })

      game.aSuperExecute(player, card)
    },
  ],
}
