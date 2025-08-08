module.exports = {
  name: `Bandage`,
  color: `red`,
  age: 8,
  expansion: `echo`,
  biscuits: `l&hl`,
  dogmaBiscuit: `l`,
  echo: [`Meld a card from hand with a {l}.`],
  dogma: [
    `I demand you return the highest card in your score pile for which you do not have a card of matching value in your hand! Return a top card from your board with a {i}!`
  ],
  dogmaImpl: [
    (game, player) => {
      const handAges = game
        .getCardsByZone(player, 'hand')
        .map(card => card.getAge())
      const choices = game
        .getCardsByZone(player, 'score')
        .filter(card => !handAges.includes(card.getAge()))
      const highest = game.utilHighestCards(choices)
      game.aChooseAndReturn(player, highest)

      const boardChoices = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('i'))
      game.aChooseAndReturn(player, boardChoices)
    }
  ],
  echoImpl: [
    (game, player) => {
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.checkHasBiscuit('l'))
      game.aChooseAndMeld(player, choices)
    }
  ],
}
