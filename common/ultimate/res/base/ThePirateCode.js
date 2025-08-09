module.exports = {
  name: `The Pirate Code`,
  color: `red`,
  age: 5,
  expansion: `base`,
  biscuits: `cfch`,
  dogmaBiscuit: `c`,
  dogma: [
    `I demand you transfer two cards of value {4} or less from your score pile to my score pile!`,
    `If any cards were transferred due to the demand, score the lowest top card with a {c} from your board.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const choices = game
        .cards.byPlayer(player, 'score')
        .filter(card => card.getAge() <= 4)
      const target = game.zones.byPlayer(leader, 'score')
      const transferred = game.actions.chooseAndTransfer(player, choices, target, { count: 2 })
      if (transferred && transferred.length > 0) {
        game.state.dogmaInfo.piratesLooted = true
      }
    },

    (game, player) => {
      if (game.state.dogmaInfo.piratesLooted) {
        const choices = game
          .cards.tops(player)
          .filter(card => card.checkHasBiscuit('c'))
        const cards = game.aChooseLowest(player, choices, 1)
        if (cards && cards.length > 0) {
          game.actions.score(player, cards[0])
        }
      }
      else {
        game.log.addNoEffect()
      }
    }
  ],
}
