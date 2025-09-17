module.exports = {
  name: `Ark of the Covenant`,
  color: `purple`,
  age: 1,
  expansion: `arti`,
  biscuits: `hkkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `Return a card from your hand. Score all cards of the same color on the boards of all players with no top Artifacts.`,
    `If Ark of the Covenant is a top card on any board, transfer it to your hand.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'))
      if (cards && cards.length > 0) {
        const color = cards[0].color

        const toScore = game
          .players
          .all()
          .filter(player => game.cards.tops(player).every(card => !card.checkIsArtifact()))
          .flatMap(player => game.cards.byPlayer(player, color))

        game.actions.scoreMany(player, toScore, game.zones.byPlayer(player, 'score'))
      }
    },

    (game, player) => {
      const ark = game.cards.byId('Ark of the Covenant')
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
