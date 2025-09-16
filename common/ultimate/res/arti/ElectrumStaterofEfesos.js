module.exports = {
  name: `Electrum Stater of Efesos`,
  color: `green`,
  age: 1,
  expansion: `arti`,
  biscuits: `chkc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Draw and reveal a {3}. If you do not have a top card of the drawn card's color, meld it and repeat this dogma effect.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      while (true) {
        const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 3))
        if (game.getTopCard(player, card.color)) {
          game.log.add({
            template: '{player} already has a top card of matching color',
            args: { player }
          })
          break
        }
        else {
          game.log.add({
            template: '{player} has no top cards of matching color',
            args: { player }
          })
          game.actions.meld(player, card)
        }
      }
    }
  ],
}
