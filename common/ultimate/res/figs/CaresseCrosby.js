module.exports = {
  id: `Caresse Crosby`,  // Card names are unique in Innovation
  name: `Caresse Crosby`,
  color: `yellow`,
  age: 8,
  expansion: `figs`,
  biscuits: `lh8p`,
  dogmaBiscuit: `l`,
  karma: [
    `If a player would dogma a card of a color you do not have splayed left, first splay that color on any board left and draw two {2}. If you splay a fifth color left on your board this way, you win.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      triggerAll: true,
      kind: 'would-first',
      matches: (game, player, { card, self }) => game.zones.byPlayer(player, card.color).splay !== 'left',
      func(game, player, { card, self, owner }) {
        const choices = game
          .players
          .all()
          .filter(other => game.zones.byPlayer(other, card.color).splay !== 'left')
          .filter(other => game.zones.byPlayer(other, card.color).cardlist().length > 1)

        const chosenPlayer = game.actions.choosePlayer(player, choices)
        game.actions.splay(player, card.color, 'left', { owner: chosenPlayer })

        game.actions.draw(owner, { age: game.getEffectAge(self, 2) })
        game.actions.draw(owner, { age: game.getEffectAge(self, 2) })

        const allLeft = game.zones.colorStacks(owner).every(stack => stack.splay === 'left')
        if (chosenPlayer.id === owner.id && allLeft) {
          game.youWin(owner, self.name)
        }
      }
    },
  ]
}
