module.exports = {
  name: `Twister`,
  color: `purple`,
  age: 10,
  expansion: `arti`,
  biscuits: `hffi`,
  dogmaBiscuit: `f`,
  dogma: [
    `I compel you to reveal your score pile! For each color, meld a card of that color from your score pile.`
  ],
  dogmaImpl: [
    (game, player) => {
      game
        .getCardsByZone(player, 'score')
        .forEach(card => game.mReveal(player, card))

      const meldedColors = []
      while (true) {
        const choices = game
          .getCardsByZone(player, 'score')
          .filter(card => !meldedColors.includes(card.color))

        if (choices.length === 0) {
          game.mLog({ template: 'No more colors to meld' })
          break
        }

        const card = game.aChooseCard(player, choices, { title: 'Choose a card to meld' })
        meldedColors.push(card.color)
        game.aMeld(player, card)
      }
    }
  ],
}
