export default {
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
    (game, player, { self }) => {
      const cards = [
        game.actions.draw(player, { age: game.getEffectAge(self, 1), exp: 'echo' }),
        game.actions.draw(player, { age: game.getEffectAge(self, 1), exp: 'echo' }),
      ]

      const foreshadowed = game.actions.chooseCard(player, cards, {
        title: 'Choose a card to foreshadow',
      })

      game.actions.foreshadow(player, foreshadowed)
      game.actions.return(player, cards.filter(x => x.id !== foreshadowed.id)[0])
    }
  ],
  echoImpl: [
    (game, player, { self }) => {
      game.actions.draw(player, { age: game.getEffectAge(self, 2) })
    }
  ],
}
