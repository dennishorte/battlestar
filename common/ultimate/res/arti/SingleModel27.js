module.exports = {
  name: `Single Model 27`,
  color: `yellow`,
  age: 7,
  expansion: `arti`,
  biscuits: `hfii`,
  dogmaBiscuit: `i`,
  dogma: [
    `Tuck a card from your hand. If you do, splay up its color, and then tuck all cards from your score pile of that color.`
  ],
  dogmaImpl: [
    (game, player) => {
      const tucked = game.actions.chooseAndTuck(player, game.getCardsByZone(player, 'hand'))
      if (tucked && tucked.length > 0) {
        const color = tucked[0].color
        game.aSplay(player, color, 'up')

        const toTuck = game
          .getCardsByZone(player, 'score')
          .filter(card => card.color === color)
        game.aTuckMany(player, toTuck)
      }
    }
  ],
}
