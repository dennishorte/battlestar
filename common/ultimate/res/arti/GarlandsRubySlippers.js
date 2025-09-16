
module.exports = {
  name: `Garland's Ruby Slippers`,
  color: `purple`,
  age: 8,
  expansion: `arti`,
  biscuits: `hiii`,
  dogmaBiscuit: `i`,
  dogma: [
    `Meld an {8} from your hand. If the melded card has no effects (of any kind), you win. Otherwise, execute the effects of the melded card as if they were on this card. Do not share them.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.getAge() === game.getEffectAge(self, 8))
      const cards = game.aChooseAndMeld(player, choices)

      if (cards && cards.length > 0) {
        const card = cards[0]
        if (
          card.dogma.length === 0
          && card.echo.length === 0
          && card.inspire.length === 0
          && card.karma.length === 0
        ) {
          game.youWin(player, self.name)
        }

        else {
          game.aExecuteAsIf(player, card)
        }
      }
    }
  ],
}
