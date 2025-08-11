module.exports = {
  name: `Pagoda`,
  color: `purple`,
  age: 2,
  expansion: `echo`,
  biscuits: `k2hk`,
  dogmaBiscuit: `k`,
  echo: ``,
  dogma: [
    `Draw and reveal a {3}. You may tuck another card of matching color from your hand. If you do, and Pagoda was foreseen, meld all cards of that color from all other boards.`
  ],
  dogmaImpl: [
    (game, player, { foreseen, self }) => {
      const hand = game.cards.byPlayer(player, 'hand')
      const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 3))

      if (card) {
        const matching = hand.filter(other => other.color === card.color)
        const tucked = game.actions.chooseAndTuck(player, matching, { min: 0, max: 1 })[0]

        if (tucked && foreseen) {
          game.log.addForeseen(self)
          const toMeld = game
            .getPlayersOther(player)
            .flatMap(p => game.cards.byPlayer(p, card.color))
          game.aMeldMany(player, toMeld)
        }
      }
    }
  ],
  echoImpl: [],
}
