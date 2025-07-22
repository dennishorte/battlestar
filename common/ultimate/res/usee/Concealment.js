module.exports = {
  name: `Concealment`,
  color: `red`,
  age: 8,
  expansion: `usee`,
  biscuits: `hffi`,
  dogmaBiscuit: `f`,
  dogma: [
    `I demand you tuck all your secrets!`,
    `Safeguard your bottom purple card.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.tuckMany(player, game.cards.byPlayer(player, 'safe'))
    },
    (game, player) => {
      const bottomPurpleCard = game
        .getBottomCards(player)
        .find(card => card.color === 'purple')

      if (bottomPurpleCard) {
        game.aSafeguard(player, bottomPurpleCard)
      }
      else {
        game.log.add({
          template: '{player} has no bottom purple card',
          args: { player }
        })
      }
    },
  ],
}
