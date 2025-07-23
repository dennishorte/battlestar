module.exports = {
  name: `Mapmaking`,
  color: `green`,
  age: 2,
  expansion: `base`,
  biscuits: `hcck`,
  dogmaBiscuit: `c`,
  dogma: [
    `I demand you transfer a {1} from your score pile to my score pile.`,
    `If any card was transferred due to the demand, draw and score a {1}.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const choices = game
        .zones.byPlayer(player, 'score')
        .cards()
        .filter(card => card.getAge() === game.getEffectAge(self, 1))
        .map(card => card.id)
      const target = game.zones.byPlayer(leader, 'score')
      const transferredCards = game.actions.chooseAndTransfer(player, choices, target)

      if (transferredCards.length > 0) {
        game.state.dogmaInfo.transferred = true
      }
    },

    (game, player, { self }) => {
      if (game.state.dogmaInfo.transferred) {
        game.actions.drawAndScore(player, game.getEffectAge(self, 1))
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
}
