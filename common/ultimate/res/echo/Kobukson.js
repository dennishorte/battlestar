module.exports = {
  name: `Kobukson`,
  color: `red`,
  age: 4,
  expansion: `echo`,
  biscuits: `5fh&`,
  dogmaBiscuit: `f`,
  echo: `Splay left a color on any player's board.`,
  dogma: [
    `I demand you return a top card with {k} of each color on your board! Draw and tuck a {4}!`,
    `Draw and tuck a {4}.`,
    `If Kobukson was foreseen, draw and meld a {5}.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const toReturn = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('k'))

      game.aReturnMany(player, toReturn)
      game.aDrawAndTuck(player, game.getEffectAge(this, 4))
    },

    (game, player) => {
      game.aDrawAndTuck(player, game.getEffectAge(this, 4))
    },

    (game, player, { foreseen, self }) => {
      if (foreseen) {
        game.mLogWasForeseen(self)
        game.aDrawAndMeld(player, game.getEffectAge(this, 5))
      }
    }
  ],
  echoImpl: (game, player) => {
    const choices = game
      .getPlayerAll()
      .flatMap(player => game.utilColors().map(color => ({ player, color })))
      .map(x => `${x.player.name} ${x.color}`)

    const toSplayLeft = game.aChoose(player, choices, { title: 'Choose a stack to splay left' })
    if (toSplayLeft && toSplayLeft.length > 0) {
      const [playerName, color] = toSplayLeft[0].split(' ')
      const target = game.getPlayerByName(playerName)
      game.aSplay(player, color, 'left', { owner: target })
    }
  },
}
