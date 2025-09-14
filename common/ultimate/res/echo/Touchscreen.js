module.exports = {
  name: `Touchscreen`,
  color: `blue`,
  age: 11,
  expansion: `echo`,
  biscuits: `hbss`,
  dogmaBiscuit: `s`,
  dogma: [
    `Splay each color on your board in a direction according to the exact number of cards of that color on your board: two or three, aslant; four or five, up; six or seven, right; eight or more, left. If you splay five colors, you win.`
  ],
  dogmaImpl: [
    (game, player) => {
      const directionFunc = (stack) => {
        const count = stack.cardlist().length
        if (count === 2 || count === 3) {
          return 'aslant'
        }
        else if (count === 4 || count === 5) {
          return 'up'
        }
        else if (count === 6 || count === 7) {
          return 'right'
        }
        else if (count >= 8) {
          return 'left'
        }
        else {
          return 'none'
        }
      }

      const todo = game
        .zones
        .colorStacks(player)
        .map((stack) => [stack, directionFunc(stack)])
        .filter(([stack, direction]) => direction !== 'none' && direction !== stack.splay)
        .map(([stack, direction]) => [stack.color, direction])

      while (todo.length > 0) {
        const options = todo.map(([color, direction]) => `${color} ${direction}`)
        const selected = game.actions.choose(player, options, {
          title: 'Choose a color to splay next'
        })[0]

        const [color, direction] = selected.split(' ')
        game.actions.splay(player, color, direction)

        const removeIndex = todo.findIndex(([todoColor,]) => todoColor === color)
        todo.splice(removeIndex, 1)
      }
    }
  ],
}
