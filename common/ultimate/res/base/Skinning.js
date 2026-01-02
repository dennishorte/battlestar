module.exports = {
  name: `Skinning`,
  color: `yellow`,
  age: 0,
  expansion: `base`,
  biscuits: `hlrr`,
  dogmaBiscuit: `r`,
  dogma: [
    `Score a card with {r} on your board. If you do, meld a card from your hand for each {r} on the scored card.`
  ],
  dogmaImpl: [
    (game, player) => {
      const scoreChoices = game
        .cards
        .tops(player)
        .filter(card => card.checkHasBiscuit('r'))

      const scored = game.actions.chooseAndScore(player, scoreChoices)[0]

      if (scored) {
        game.actions.chooseAndMeld(player, game.cards.byPlayer(player, 'hand'), { count: scored.getBiscuitCount('r') })
      }
    }
  ],
}
