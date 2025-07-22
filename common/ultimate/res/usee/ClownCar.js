module.exports = {
  name: `Clown Car`,
  color: `purple`,
  age: 9,
  expansion: `usee`,
  biscuits: `cchl`,
  dogmaBiscuit: `c`,
  dogma: [
    `I demand you meld a card from my score pile! If the melded card has no {c}, repeat this effect!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      let canRepeat = true
      while (canRepeat) {
        const scoreCards = game.cards.byPlayer(leader, 'score')
        const card = game.actions.chooseCards(leader, scoreCards, { hidden: true })[0]
        if (card) {
          game.actions.meld(player, card)
          canRepeat = !card.checkHasBiscuit('c')
        }
        else {
          canRepeat = false
        }
      }
    },
  ],
}
