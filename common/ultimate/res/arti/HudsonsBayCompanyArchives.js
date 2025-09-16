module.exports = {
  name: `Hudson's Bay Company Archives`,
  color: `green`,
  age: 5,
  expansion: `arti`,
  biscuits: `chfc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Score the bottom card of every color on your board. Meld a card from your score pile. Splay right the color of the melded card.`
  ],
  dogmaImpl: [
    (game, player) => {
      const toScore = game
        .utilColors()
        .flatMap(color => game.getCardsByZone(player, color).slice(-1))
      game.aScoreMany(player, toScore)

      const cards = game.actions.chooseAndMeld(player, game.getCardsByZone(player, 'score'))
      if (cards && cards.length > 0) {
        game.aSplay(player, cards[0].color, 'right')
      }
    }
  ],
}
