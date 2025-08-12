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
        .cards.tops(player)
        .filter(card => card.checkHasBiscuit('k'))

      game.actions.returnMany(player, toReturn)
      game.actions.drawAndTuck(player, game.getEffectAge(this, 4))
    },

    (game, player) => {
      game.actions.drawAndTuck(player, game.getEffectAge(this, 4))
    },

    (game, player, { foreseen, self }) => {
      if (foreseen) {
        game.log.addForeseen(self)
        game.actions.drawAndMeld(player, game.getEffectAge(this, 5))
      }
    }
  ],
  echoImpl: (game, player) => {
    const choices = game
      .players.all()
      .flatMap(player => game.util.colors().map(color => ({ player, color })))
      .map(x => `${x.player.name} ${x.color}`)

    const toSplayLeft = game.actions.choose(player, choices, { title: 'Choose a stack to splay left' })
    if (toSplayLeft && toSplayLeft.length > 0) {
      const [playerName, color] = toSplayLeft[0].split(' ')
      const target = game.players.byName(playerName)
      game.actions.splay(player, color, 'left', { owner: target })
    }
  },
}
