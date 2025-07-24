module.exports = {
  name: `Red Herring`,
  color: `red`,
  age: 6,
  expansion: `usee`,
  biscuits: `chcc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Splay your red cards left, right, or up.`,
    `Draw and tuck a {6}. If the color on your board of the card you tuck is splayed in the same direction as your red cards, splay that color up. Otherwise, unsplay that color.`
  ],
  dogmaImpl: [
    (game, player) => {
      const red = game.zones.byPlayer(player, 'red')

      if (red.cards().length < 2) {
        game.log.add({ template: 'Red cannot be splayed' })
        return
      }

      const choices = ['left', 'right', 'up'].filter(x => x !== red.splay)

      const direction = game.actions.choose(player, choices, {
        title: 'Choose a direction to splay red',
      })[0]
      game.actions.splay(player, 'red', direction)
    },
    (game, player, { self }) => {
      const card = game.actions.drawAndTuck(player, game.getEffectAge(self, 6))
      if (card) {
        const redSplay = game.zones.byPlayer(player, 'red').splay
        const cardSplay = game.zones.byPlayer(player, card.color).splay
        if (redSplay === cardSplay) {
          game.actions.splay(player, card.color, 'up')
        }
        else {
          game.aUnsplay(player, card.color)
        }
      }
    }
  ],
}
