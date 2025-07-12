module.exports = {
  name: `Secret Santa`,
  color: `red`,
  age: 10,
  expansion: `usee`,
  biscuits: `sshp`,
  dogmaBiscuit: `s`,
  dogma: [
    `I demand you meld a card from my score pile!`,
    `Draw and score three {0}.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const choices = game.zones.byPlayer(leader, 'score').cards()
      const card = game.actions.chooseCards(player, choices, { hidden: true })[0]
      if (card) {
        game.aMeld(player, card)
      }
    },
    (game, player, { self }) => {
      game.aDrawAndScore(player, game.getEffectAge(self, 10))
      game.aDrawAndScore(player, game.getEffectAge(self, 10))
      game.aDrawAndScore(player, game.getEffectAge(self, 10))
    }
  ],
}
