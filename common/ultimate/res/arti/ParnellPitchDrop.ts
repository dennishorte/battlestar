export default {
  name: `Parnell Pitch Drop`,
  color: `blue`,
  age: 8,
  expansion: `arti`,
  biscuits: `sssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw and meld a card of value one higher than the highest top card on your board. Junk an available standard achievement. If you don't, and the melded card has at least three {i}, you win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndMeld(player, game.getHighestTopAge(player) + 1)
      const junked = game.actions.junkAvailableAchievement(player, game.getAges())

      if (!junked && card.biscuits.split('i').length - 1 >= 3) {
        game.youWin(player, self.name)
      }
    }
  ],
}
