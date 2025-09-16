module.exports = {
  name: `The Daily Courant`,
  color: `yellow`,
  age: 5,
  expansion: `arti`,
  biscuits: `ffch`,
  dogmaBiscuit: `f`,
  dogma: [
    `Draw a card of any value, then place it on top of the draw pile of its age. Execute the effects of one of your other top cards as if they were on this card. Do not share them.`
  ],
  dogmaImpl: [
    (game, player) => {
      const age = game.actions.chooseAge(player)
      game.log.add({
        template: '{player} choose age {age}',
        args: { player, age }
      })
      const card = game.aDraw(player, { age })
      if (card) {
        game.mMoveCardToTop(card, game.getZoneByCardHome(card))
        game.log.add({
          template: '{player} puts {card} on back on top of deck',
          args: { player, card }
        })
      }

      const choices = game.getTopCards(player)
      const toExecute = game.actions.chooseCard(player, choices)
      if (toExecute) {
        game.log.add({
          template: '{player} executes {card}',
          args: {
            player,
            card: toExecute
          }
        })
        game.aExecuteAsIf(player, toExecute)
      }
    }
  ],
}
