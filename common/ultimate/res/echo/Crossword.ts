export default {
  name: `Crossword`,
  color: `purple`,
  age: 8,
  expansion: `echo`,
  biscuits: `c8hc`,
  dogmaBiscuit: `c`,
  echo: ``,
  dogma: [
    `For each even bonus on your board, draw a card of that value. If Crossword was foreseen, transfer the drawn cards to the available achievements.`,
    `For each odd bonus on your board, return the lowest card from your hand.`
  ],
  dogmaImpl: [
    (game, player, { foreseen, self }) => {
      const remaining = game
        .getBonuses(player)
        .filter(bonus => bonus % 2 === 0)
        .sort()

      const drawn = []
      while (remaining.length > 0) {
        const next = game.actions.choose(player, remaining, { title: 'Draw next...' })[0]
        const index = remaining.indexOf(next)
        remaining.splice(index, 1)

        const card = game.actions.draw(player, { age: next })
        drawn.push(card)
      }

      game.log.addForeseen(foreseen, self)
      if (foreseen) {
        game.actions.transferMany(player, drawn, game.zones.byId('achievements'), { ordered: true })
      }
    },

    (game, player) => {
      const count = game
        .getBonuses(player)
        .filter(bonus => bonus % 2 === 1)
        .length

      const toReturn = game.actions.chooseLowest(player, game.cards.byPlayer(player, 'hand'), count)
      game.actions.returnMany(player, toReturn)
    },
  ],
  echoImpl: [],
}
