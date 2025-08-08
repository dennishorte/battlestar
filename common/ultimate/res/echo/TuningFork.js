module.exports = {
  name: `Tuning Fork`,
  color: `purple`,
  age: 5,
  expansion: `echo`,
  biscuits: `&ssh`,
  dogmaBiscuit: `s`,
  echo: `Look at the top card of any deck, then place it back on top.`,
  dogma: [
    `Return a card from your hand. If you do, draw and reveal a card of the same value, and meld it if it is of higher value than the top card of the same color on your board. Otherwise, return it. You may repeat this dogma effect.`
  ],
  dogmaImpl: [
    (game, player) => {
      while (true) {
        const returned = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'))[0]
        if (returned) {
          const revealed = game.aDrawAndReveal(player, returned.getAge())
          if (revealed) {
            const top = game.getTopCard(player, revealed.color)
            if (!top || revealed.getAge() > top.getAge()) {
              game.aMeld(player, revealed)
            }
            else {
              game.aReturn(player, revealed)
            }
          }
        }
        else {
          break
        }

        if (game.getCardsByZone(player, 'hand').length === 0) {
          break
        }

        const repeat = game.aYesNo(player, 'Repeat this dogma effect?')
        if (repeat) {
          continue
        }
        else {
          break
        }
      }
    }
  ],
  echoImpl: (game, player) => {
    const exp = game.aChoose(player, game.getExpansionList(), { title: 'Choose the type of deck' })[0]
    const ages = [1,2,3,4,5,6,7,8,9,10]
      .filter(age => game.getZoneByDeck(exp, age).cards().length > 0)
    const age = game.aChooseAge(player, ages)

    const card = game.mDraw(player, exp, age)
    game.mMoveCardToTop(card, game.getZoneById(card.home), { player })
  },
}
