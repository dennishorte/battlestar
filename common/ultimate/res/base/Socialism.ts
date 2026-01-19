export default {
  name: `Socialism`,
  color: `purple`,
  age: 8,
  expansion: `base`,
  biscuits: `lhll`,
  dogmaBiscuit: `l`,
  dogma: [
    `You may tuck a top card from your board. If you do, tuck all cards from your hand.`,
    `You may junk an available achievement of value 8, 9, or 10.`
  ],
  dogmaImpl: [
    (game, player) => {
      const topCards = game.cards.tops(player)
      const card = game.actions.chooseCard(player, topCards, {
        title: 'Tuck a top card from your board?',
        min: 0,
      })

      if (card) {
        game.actions.tuck(player, card)
        game.actions.tuckMany(player, game.cards.byPlayer(player, 'hand'))
      }
    },

    (game, player) => {
      game.actions.junkAvailableAchievement(player, [8, 9, 10], { min: 0 })
    },
  ],
}
