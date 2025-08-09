module.exports = {
  name: `Shuriken`,
  color: `red`,
  age: 4,
  expansion: `echo`,
  biscuits: `cchc`,
  dogmaBiscuit: `c`,
  echo: ``,
  dogma: [
    `I demand you transfer two non-red top cards with {k} or {p} of different colors from your board to my board! If you do, and Shuriken was foreseen, transfer them to my achievements!`,
    `You may splay your purple cards right.`
  ],
  dogmaImpl: [
    (game, player, { leader, foreseen, self }) => {
      const choices = game
        .cards.tops(player)
        .filter(card => card.color !== 'red')
        .filter(card => card.checkHasBiscuit('k') || card.checkHasBiscuit('p'))

      let cards = game.aChooseCards(player, choices, { count: 2 })

      if (cards.length > 0) {
        const transferred = []
        while (cards.length > 0) {
          const card = game.aChooseCard(player, cards)
          cards = cards.filter(other => other.id !== card.id)

          const trans = game.aTransfer(player, card, game.zones.byPlayer(leader, card.color))
          if (trans) {
            transferred.push(trans)
          }
        }

        if (foreseen && transferred.length === 2) {
          game.mLogWasForeseen(self)
          game.aTransferMany(player, transferred, game.zones.byPlayer(leader, 'achievements'), { ordered: true })
        }
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['purple'], 'right')
    }
  ],
  echoImpl: [],
}
