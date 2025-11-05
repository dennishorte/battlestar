module.exports = {
  name: `Along the River during the Qingming Festival`,
  color: `yellow`,
  age: 3,
  expansion: `arti`,
  biscuits: `ccch`,
  dogmaBiscuit: `c`,
  dogma: [
    `Draw and reveal a {4}. If it is yellow, tuck it. If it is purple, score it. Otherwise, repeat this effect.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      while (true) {
        const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 4))
        if (card.color === 'yellow') {
          game.actions.tuck(player, card)
          break
        }
        else if (card.color === 'purple') {
          game.actions.score(player, card)
          break
        }
        else {
          game.log.add({
            template: 'Card is neither yellow nor purple. Repeating effect.'
          })
          continue
        }
      }
    }
  ],
}
