module.exports = {
  name: `Parachute`,
  color: `red`,
  age: 8,
  expansion: `echo`,
  biscuits: `fhii`,
  dogmaBiscuit: `i`,
  echo: ``,
  dogma: [
    `I demand you transfer all cards without {i} in your hand to my hand!`,
    `If parachute was foreseen, junk all cards from all boards.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      game.actions.transferMany(player, game.cards.byPlayer(player, 'hand'), game.zones.byPlayer(leader, 'hand'), {
        filter: card => !card.checkHasBiscuit('i'),
      })
    },

    (game, player, { foreseen, self }) => {
      game.log.addForeseen(foreseen, self)
      if (foreseen) {
        const toJunk = game.players.all().flatMap(p => {
          return game.util.colors().flatMap(color => game.cards.byPlayer(p, color))
        })

        game.actions.junkMany(player, toJunk, { ordered: true })
      }
    },
  ],
  echoImpl: [],
}
