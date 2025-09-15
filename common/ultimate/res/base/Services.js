module.exports = {
  name: `Services`,
  color: `purple`,
  age: 9,
  expansion: `base`,
  biscuits: `hlll`,
  dogmaBiscuit: `l`,
  dogma: [
    `I demand you transfer all the cards of the value of my choice from your score pile to my hand! If you transferred any cards, then transfer a top card without a {l} from my board to your hand.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const value = game.actions.chooseAge(leader)
      const cards = game
        .cards.byPlayer(player, 'score')
        .filter(c => c.getAge() === value)

      const transferred = game.actions.transferMany(player, cards, game.zones.byPlayer(leader, 'hand'))
      if (transferred && transferred.length > 0) {
        const choices = game
          .cards.tops(leader)
          .filter(card => !card.checkHasBiscuit('l'))
        game.actions.chooseAndTransfer(player, choices, game.zones.byPlayer(player, 'hand'))
      }
    }
  ],
}
