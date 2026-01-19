export default {
  name: `Sniping`,
  color: `red`,
  age: 6,
  expansion: `usee`,
  biscuits: `ffhf`,
  dogmaBiscuit: `f`,
  dogma: [
    `I demand you unsplay the color on your board of my choice! Meld your bottom card of that color! Transfer your bottom non-top card of that color to my board!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const chosenColor = game.actions.chooseColor(leader)
      game.actions.unsplay(player, chosenColor)

      const cards = game.cards.byPlayer(player, chosenColor)
      if (cards.length > 0) {
        game.actions.meld(player, game.cards.bottom(player, chosenColor))

        if (cards.length > 1) {
          const bottomCard = game.cards.bottom(player, chosenColor)
          game.actions.transfer(player, bottomCard, game.zones.byPlayer(leader, chosenColor))
        }
      }
    },
  ],
}
