module.exports = {
  name: `Roundhay Garden Scene`,
  color: `purple`,
  age: 7,
  expansion: `arti`,
  biscuits: `lllh`,
  dogmaBiscuit: `l`,
  dogma: [
    `Meld the highest card from your score pile. Draw and score two cards of value equal to the melded card. Execute the effects of the melded card as if they were on this card. Do not share them.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game.utilHighestCards(game.getCardsByZone(player, 'score'))
      const cards = game.actions.chooseAndMeld(player, choices)
      if (cards && cards.length > 0) {
        const card = cards[0]
        game.aDrawAndScore(player, card.getAge())
        game.aDrawAndScore(player, card.getAge())
        game.aExecuteAsIf(player, card)
      }
    }
  ],
}
