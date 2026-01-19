import util from '../../../lib/util.js'

export default {
  name: `Dragon's Lair`,
  color: `purple`,
  age: 10,
  expansion: `arti`,
  biscuits: `hccc`,
  dogmaBiscuit: `f`,
  dogma: [
    `I compel you to meld the lowest card in your score pile with a unique value. If you do, meld a card of the same color from your hand. If you meld one card total, you lose. Otherwise, junk the top card of each deck.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const scoreCards = game.cards.byPlayer(player, 'score')
      const scoreByValue = util.array.groupBy(scoreCards, card => card.getAge())
      const value = game
        .getAges()
        .sort((l, r) => l - r)
        .find(age => (age in scoreByValue) && scoreByValue[age].length === 1)
      if (value) {
        const card = scoreByValue[value][0]
        const meldedFromScore = game.actions.meld(player, card)

        if (meldedFromScore) {
          const handOptions = game.cards.byPlayer(player, 'hand').filter(other => other.color === card.color)
          const meldedFromHand = game.actions.chooseAndMeld(player, handOptions)[0]

          if (meldedFromHand) {
            game.log.add({
              template: 'Two cards were melded'
            })
            for (const age of game.getAges()) {
              for (const exp of game.getExpansionList()) {
                const cards = game.cards.byDeck(exp, age)
                if (cards.length > 0) {
                  game.actions.junk(player, cards[0])
                }
              }
            }
          }
          else {
            game.log.add({
              template: 'Only one card was melded'
            })
            game.aYouLose(player, self)
          }
        }
      }
      else {
        game.log.add({
          template: 'no cards in score pile with a unique value',
        })
      }
    }
  ],
}
