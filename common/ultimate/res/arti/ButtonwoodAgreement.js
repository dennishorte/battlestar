module.exports = {
  name: `Buttonwood Agreement`,
  color: `green`,
  age: 6,
  expansion: `arti`,
  biscuits: `fcfh`,
  dogmaBiscuit: `f`,
  dogma: [
    `Choose three colors. Draw and reveal a {8}. If the drawn card is one of the chosen colors, score it and splay up that color. Otherwise, return all cards of the drawn card's color from your score pile, and unsplay that color.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const colorOptions = game.util.colors().map(c =>
        game.actions.option({ id: c, title: c, kind: 'color' })
      )
      const selections = game.actions.choose(player, colorOptions, { count: 3 })
      const colors = selections.map(s => (s && typeof s === 'object') ? s.id : s)
      const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 8))

      if (colors.includes(card.color)) {
        game.actions.score(player, card)
        game.actions.splay(player, card.color, 'up')
      }
      else {
        const toReturn = game
          .cards.byPlayer(player, 'score')
          .filter(other => other.color === card.color)
        game.actions.returnMany(player, toReturn)
        game.actions.unsplay(player, card.color)
      }
    }
  ],
}
