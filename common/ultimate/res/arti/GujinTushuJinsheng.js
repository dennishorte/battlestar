module.exports = {
  name: `Gujin Tushu Jinsheng`,
  color: `yellow`,
  age: 5,
  expansion: `arti`,
  biscuits: `schs`,
  dogmaBiscuit: `s`,
  dogma: [
    `If Gujin Tushu Jinsheng is on your board, choose any other top card on any other board. Execute the echo and dogma effects on the chosen card as if they were on this card. Do not share them.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      if (!game.isCardOnPlayerBoard(player, self)) {
        game.log.add({
          template: "{card} is not on {player}'s board.",
          args: { card: self, player }
        })
        return
      }

      const choices = game
        .getPlayerOther(player)
        .flatMap(player => game.getTopCards(player))
      const card = game.actions.chooseCard(player, choices)
      if (card) {
        game.aExecuteAsIf(player, card)
      }
    }
  ],
}
