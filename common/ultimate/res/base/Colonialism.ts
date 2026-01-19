export default {
  name: `Colonialism`,
  color: `red`,
  age: 4,
  expansion: `base`,
  biscuits: `hfsf`,
  dogmaBiscuit: `f`,
  dogma: [
    `Draw and tuck a {3}. If it has a {c}, repeat this dogma effect.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      while (true) {
        const card = game.actions.drawAndTuck(player, game.getEffectAge(self, 3))
        if (card.biscuits.includes('c')) {
          game.log.add({ template: 'effect repeats' })
        }
        else {
          break
        }
      }
    }
  ],
}
