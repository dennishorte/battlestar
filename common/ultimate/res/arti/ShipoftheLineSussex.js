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
      if (game.cards.byPlayer(player, 'score').length === 0) {
        const colorChoices = game.util.colors().map(c =>
          game.actions.option({ id: c, title: c, kind: 'color' })
        )
        const colors = game.actions.choose(player, colorChoices, { title: 'Choose a Color' })
        const pick = colors[0]
        const color = (pick && typeof pick === 'object') ? pick.id : pick
        game.actions.scoreMany(player, game.cards.byPlayer(player, color))
      }

      else {
        game.actions.returnMany(player, game.cards.byPlayer(player, 'score'))
      }
    }
  ],
}
