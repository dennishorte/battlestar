module.exports = {
  name: `Calculator`,
  color: `blue`,
  age: 9,
  expansion: `echo`,
  biscuits: `ihis`,
  dogmaBiscuit: `i`,
  echo: ``,
  dogma: [
    `Score two bottom non-blue cards from your board. If you scored two cards and they have a total value less than 11, draw a card of that total value and repeat this dogma effect (only once).`,
    `You may splay your blue cards up.`
  ],
  dogmaImpl: [
    (game, player) => {
      let repeated = false

      while (true) {
        const choices = game
          .util.colors()
          .map(color => game.getBottomCard(player, color))
          .filter(card => card !== undefined)
          .filter(card => card.color !== 'blue')
        const scored = game.actions.chooseAndScore(player, choices, { count: 2 })
        if (scored && scored.length >= 2) {
          const total = scored[0].getAge() + scored[1].getAge()
          if (total >= 11) {
            game.mLog({ template: 'Total age was not less than 11' })
            break
          }
          else {
            game.aDraw(player, { age: total })
            if (repeated) {
              break
            }
            else {
              repeated = true
              continue
            }
          }
        }
        else {
          game.mLog({ template: 'Did not return two cards' })
          break
        }
      }
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['blue'], 'up')
    }
  ],
  echoImpl: [],
}
