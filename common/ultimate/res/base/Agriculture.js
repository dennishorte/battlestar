module.exports = {
  name: `Agriculture`,
  color: `yellow`,
  age: 1,
  expansion: `base`,
  biscuits: `hlll`,
  dogmaBiscuit: `l`,
  dogma: [
    `You may return a card from your hand. If you do, draw and score a card of value one higher than the card you returned.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cardsInHand = game.getZoneByPlayer(player, 'hand').cards().map(c => c.name)
      const returned = game.requestInputSingle({
        actor: player.name,
        title: 'Choose a Card',
        choices: cardsInHand,
        min: 0,
        max: 1,
      })

      if (returned.length > 0) {
        const card = game.getCardByName(returned[0])
        const returnedCard = game.aReturn(player, card)
        if (returnedCard) {
          game.aDrawAndScore(player, card.getAge() + 1)
        }
      }
    },
  ],
}
