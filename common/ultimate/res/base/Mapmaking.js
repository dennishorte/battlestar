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
      const age = game.getEffectAge(self, 1)
      const target = game.zones.byPlayer(leader, 'score')
      const transferredCards = game.actions.chooseAndTransfer(
        player,
        game.cards.byPlayer(player, 'score'),
        target,
        { filter: card => card.getAge() === age }
      )

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
