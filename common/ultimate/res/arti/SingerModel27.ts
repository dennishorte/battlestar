export default {
  name: `Singer Model 27`,
  color: `yellow`,
  age: 7,
  expansion: `arti`,
  biscuits: `hfii`,
  dogmaBiscuit: `i`,
  dogma: [
    `Tuck a card from your hand. If you do, splay up its color, and then tuck all cards from your score pile of that color. If you do, junk an available standard achievement.`
  ],
  dogmaImpl: [
    (game, player) => {
      const tucked = game.actions.chooseAndTuck(player, game.cards.byPlayer(player, 'hand'))[0]
      if (tucked) {
        const color = tucked.color
        game.actions.splay(player, color, 'up')

        const toTuck = game
          .cards
          .byPlayer(player, 'score')
          .filter(card => card.color === color)
        const tuckedFromScore = game.actions.tuckMany(player, toTuck)

        if (tuckedFromScore.length > 0) {
          game.actions.junkAvailableAchievement(player, game.getAges())
        }
      }
    }
  ],
}
