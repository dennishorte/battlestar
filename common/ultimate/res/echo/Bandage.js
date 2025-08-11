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
        .cards.byPlayer(player, 'hand')
        .map(card => card.getAge())
      const choices = game
        .cards.byPlayer(player, 'score')
        .filter(card => !handAges.includes(card.getAge()))
      const highest = game.util.highestCards(choices)
      game.actions.chooseAndReturn(player, highest)

      const boardChoices = game
        .cards.tops(player)
        .filter(card => card.checkHasBiscuit('i'))
      game.actions.chooseAndReturn(player, boardChoices)
    }
  ],
  echoImpl: [
    (game, player) => {
      const choices = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.checkHasBiscuit('l'))
      game.actions.chooseAndMeld(player, choices)
    }
  ],
}
