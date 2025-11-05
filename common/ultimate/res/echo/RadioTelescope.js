module.exports = {
  name: `Radio Telescope`,
  color: `blue`,
  age: 8,
  expansion: `echo`,
  biscuits: `hsss`,
  dogmaBiscuit: `s`,
  echo: ``,
  dogma: [
    `For every color on your board with {s}, draw a {9}. If Radio Telescope was foreseen, for every color also draw a {0}. Meld one of the cards drawn and return the rest. If you meld AI due to this effect, you win.`
  ],
  dogmaImpl: [
    (game, player, { foreseen, self }) => {
      const count = Object
        .values(player.biscuitsByColor())
        .map(biscuits => biscuits.s)
        .filter(count => count > 0)
        .length

      const drawn = []
      for (let i = 0; i < count; i++) {
        const card = game.actions.draw(player, { age: game.getEffectAge(self, 9) })
        if (card) {
          drawn.push(card)
        }
      }

      game.log.addForeseen(foreseen, self)
      if (foreseen) {
        for (let i = 0; i < count; i++) {
          const card = game.actions.draw(player, { age: game.getEffectAge(self, 10) })
          if (card) {
            drawn.push(card)
          }
        }
      }

      const melded = game.actions.chooseAndMeld(player, drawn)

      if (melded.length > 0 && melded[0].name === 'A.I.') {
        game.youWin(player, self.name)
      }

      const toReturn = drawn.filter(card => card !== melded[0])
      game.actions.returnMany(player, toReturn)
    }
  ],
  echoImpl: [],
}
