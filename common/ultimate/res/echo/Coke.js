module.exports = {
  name: `Coke`,
  color: `red`,
  age: 5,
  expansion: `echo`,
  biscuits: `&ffh`,
  dogmaBiscuit: `f`,
  echo: [`Draw and tuck a {4}.`],
  dogma: [
    `Draw and reveal a {6}. If it has a {f}, meld it and repeat this dogma effect. Otherwise, foreshadow it.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      while (true) {
        const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 6))
        if (card) {
          if (card.checkHasBiscuit('f')) {
            game.log.add({ template: 'Card has {f}.' })
            game.actions.meld(player, card)
            continue
          }
          else {
            game.log.add({ template: 'Card did not have {f}.' })
            game.actions.foreshadow(player, card)
            break
          }
        }
        else {
          break
        }
      }
    }
  ],
  echoImpl: [
    (game, player, { self }) => {
      game.actions.drawAndTuck(player, game.getEffectAge(self, 4))
    }
  ],
}
