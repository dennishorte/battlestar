module.exports = {
  name: `Tale of the Shipwrecked Sailor`,
  color: `purple`,
  age: 1,
  expansion: `arti`,
  biscuits: `hkss`,
  dogmaBiscuit: `s`,
  dogma: [
    `Choose a color. Draw a {1}. Meld a card of the chosen color from your hand. If you do, splay that color left, and junk an available achievement of value equal to the the value of the melded card.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const color = game.actions.choose(player, game.util.colors(), { title: 'Choose a Color ' })[0]
      game.log.add({
        template: '{player} chooses {color}',
        args: { player, color }
      })
      game.actions.draw(player, { age: game.getEffectAge(self, 1) })
      const choices = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.color === color)
      const melded = game.actions.chooseAndMeld(player, choices)
      if (melded.length > 0) {
        game.actions.splay(player, color, 'left')
        game.actions.junkAvailableAchievement(player, [melded[0].getAge()])
      }
    }
  ],
}
