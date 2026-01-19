export default {
  id: `Christiaan Huygens`,  // Card names are unique in Innovation
  name: `Christiaan Huygens`,
  color: `blue`,
  age: 5,
  expansion: `figs`,
  biscuits: `pssh`,
  dogmaBiscuit: `s`,
  karma: [
    `If you would dogma a card as your first action, instead junk all cards in the {6} deck. Then draw and reveal one {7}, two {8}, or three {9}. If the drawns cards have more {i} than you have on your board, return them.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-instead',
      matches: (game) => game.state.actionNumber === 1,
      func: (game, player, { self }) => {
        game.actions.junkDeck(player, 6)

        const drawChoice = game.actions.choose(player, [
          'draw one ' + game.getEffectAge(self, 7),
          'draw two ' + game.getEffectAge(self, 8),
          'draw three ' + game.getEffectAge(self, 9),
        ], {
          title: 'What would you like to draw?'
        })[0]

        let count
        let age

        if (drawChoice.startsWith('draw one')) {
          count = 1
          age = game.getEffectAge(self, 7)
        }
        else if (drawChoice.startsWith('draw two')) {
          count = 2
          age = game.getEffectAge(self, 8)
        }
        else {
          count = 3
          age = game.getEffectAge(self, 9)
        }

        const drawn = []
        for (let i = 0; i < count; i++) {
          drawn.push(game.actions.draw(player, { age }))
        }

        const clocksDrawn = drawn.reduce((acc, card) => acc + card.getBiscuitCount('i'), 0)
        const clocksOnBoard = player.biscuits().i

        game.log.add({
          template: 'Clocks drawn: {count}',
          args: { count: clocksDrawn }
        })
        game.log.add({
          template: 'Clocks on board: {count}',
          args: { count: clocksOnBoard }
        })

        if (clocksDrawn > clocksOnBoard) {
          game.actions.returnMany(player, drawn)
        }
      }
    }
  ]
}
