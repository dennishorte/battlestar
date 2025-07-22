module.exports = {
  name: `Shangri-La`,
  color: `yellow`,
  age: 8,
  expansion: `usee`,
  biscuits: `hcll`,
  dogmaBiscuit: `l`,
  dogma: [
    `Draw and tuck an {8}. If it has {f}, score it. Otherwise, draw and meld an {8}. If it is an {8}, repeat this effect.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const executeEffect = () => {
        const tucked = game.aDrawAndTuck(player, game.getEffectAge(self, 8))
        if (tucked.checkHasBiscuit('f')) {
          game.aScore(player, tucked)
        }
        else {
          const melded = game.actions.drawAndMeld(player, game.getEffectAge(self, 8))
          if (melded.getAge() === 8) {
            game.log.add({ template: 'Repeating effect' })
            executeEffect()
          }
        }
      }

      executeEffect()
    },
  ],
}
