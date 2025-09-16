
module.exports = {
  name: `Where's Waldo`,
  color: `yellow`,
  age: 10,
  expansion: `arti`,
  biscuits: `lihl`,
  dogmaBiscuit: `l`,
  dogma: [
    `You win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.youWin(player, self.name)
    }
  ],
}
