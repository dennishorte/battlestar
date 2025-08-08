module.exports = {
  name: `Ruler`,
  color: `blue`,
  age: 1,
  expansion: `echo`,
  biscuits: `shs&`,
  dogmaBiscuit: `s`,
  echo: [`Draw a {2}.`],
  dogma: [
    `Draw two Echoes {1}. Foreshadow one of the drawn cards and return the other.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = [
        game.aDraw(player, { age: game.getEffectAge(this, 1), exp: 'echo' }),
        game.aDraw(player, { age: game.getEffectAge(this, 1), exp: 'echo' }),
      ]

      const foreshadowed = game.aChooseCard(player, cards, {
        title: 'Choose a card to foreshadow',
      })

      game.aForeshadow(player, foreshadowed)
      game.aReturn(player, cards.filter(x => x.id !== foreshadowed.id)[0])
    }
  ],
  echoImpl: [
    (game, player) => {
      game.aDraw(player, { age: game.getEffectAge(this, 2) })
    }
  ],
}
