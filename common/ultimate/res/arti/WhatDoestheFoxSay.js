module.exports = {
  name: `What Does the Fox Say`,
  color: `yellow`,
  age: 11,
  expansion: `arti`,
  biscuits: `hcpp`,
  dogmaBiscuit: `p`,
  dogma: [
    `Draw two {e}. Meld on of them, then meld the other and if it is your turn super-execute it, otherwise self-execute it.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const cards = [
        game.actions.draw(player, { age: game.getEffectAge(self, 11) }),
        game.actions.draw(player, { age: game.getEffectAge(self, 11) }),
      ]

      const toMeld = game.actions.chooseCard(player, cards, {
        title: 'Which card to meld first?',
      })
      game.actions.meld(player, toMeld)

      const other = cards.filter(c => c.id !== toMeld.id)[0]
      game.actions.meld(player, other)

      if (player.isCurrentPlayer()) {
        game.aSuperExecute(self, player, other)
      }
      else {
        game.aSelfExecute(self, player, other)
      }
    },
  ],
}
