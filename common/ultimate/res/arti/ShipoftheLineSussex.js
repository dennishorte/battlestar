module.exports = {
  name: `Ship of the Line Sussex`,
  color: `red`,
  age: 5,
  expansion: `arti`,
  biscuits: `ffhf`,
  dogmaBiscuit: `f`,
  dogma: [
    `If you have no cards in your score pile, choose a color and score all cards of that color from your board. Otherwise, return all cards from your score pile.`
  ],
  dogmaImpl: [
    (game, player) => {
      if (game.getCardsByZone(player, 'score').length === 0) {
        const colors = game.actions.choose(player, game.utilColors(), { title: 'Choose a Color' })
        const color = colors[0]
        game.aScoreMany(player, game.getCardsByZone(player, color))
      }

      else {
        game.aReturnMany(player, game.getCardsByZone(player, 'score'))
      }
    }
  ],
}
