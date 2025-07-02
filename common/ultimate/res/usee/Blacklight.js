module.exports = {
  name: `Blacklight`,
  color: `blue`,
  age: 8,
  expansion: `usee`,
  biscuits: `hfff`,
  dogmaBiscuit: `f`,
  dogma: [
    `Choose to either unsplay one color of your cards, or splay up an unsplayed color on your board and draw a {9}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const unsplayChoices = ['yellow', 'red', 'blue', 'green', 'purple']
        .filter(color => game.getZoneByPlayer(player, color).splay !== 'none')

      const splayChoices = ['yellow', 'red', 'blue', 'green', 'purple']
        .filter(color => game.getZoneByPlayer(player, color).splay === 'none')

      const choices = []
      if (unsplayChoices.length > 0) {
        choices.push({
          title: 'Unsplay',
          choices: unsplayChoices,
          min: 0,
          max: 1,
        })
      }
      if (splayChoices.length > 0) {
        choices.push({
          title: 'Splay up and draw',
          choices: splayChoices,
          min: 0,
          max: 1,
        })
      }

      const choice = game.actions.choose(player, choices)[0]

      if (choice.title === 'Unsplay') {
        game.aUnsplay(player, choice.selection[0])
      }
      else if (choice.title === 'Splay up and draw') {
        game.aSplay(player, choice.selection[0], 'up')
        game.aDraw(player, { age: game.getEffectAge(self, 9) })
      }
      else {
        throw new Error('Invalid option: ' + choice)
      }
    },
  ],
}
