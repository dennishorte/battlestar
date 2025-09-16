module.exports = {
  name: `Ark of the Covenant`,
  color: `purple`,
  age: 1,
  expansion: `arti`,
  biscuits: `hkkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `Return a card from your hand. Transfer all cards of the same color from the boards of all players with no top Artifacts to your score pile. If Ark of the Covenant is a top card on any board, transfer it to your hand.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.actions.chooseAndReturn(player, game.getCardsByZone(player, 'hand'))
      if (cards && cards.length > 0) {
        const color = cards[0].color

        const toTransfer = game
          .players.all()
          .filter(player => game.cards.tops(player).every(card => !card.checkIsArtifact()))
          .flatMap(player => game.getCardsByZone(player, color))

        game.actions.transferMany(player, toTransfer, game.zones.byPlayer(player, 'score'), { ordered: true })
      }

      const ark = game.getCardByName('Ark of the Covenant')
      if (game.checkCardIsTop(ark)) {
        game.actions.transfer(player, ark, game.zones.byPlayer(player, 'hand'))
      }
      else {
        game.log.add({
          template: 'Ark of the Covenant is not a top card',
        })
      }

    }
  ],
}
