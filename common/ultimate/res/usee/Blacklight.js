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
      const allColors = ['yellow', 'red', 'blue', 'green', 'purple']
      const mkColor = c => game.actions.option({ id: c, title: c, kind: 'color' })

      const unsplayChoices = allColors
        .filter(color => game.zones.byPlayer(player, color).splay !== 'none')
        .map(mkColor)

      const splayChoices = allColors
        .filter(color => game.zones.byPlayer(player, color).splay === 'none')
        .map(mkColor)

      const choices = []
      if (unsplayChoices.length > 0) {
        choices.push({
          title: 'Unsplay',
          id: 'unsplay',
          choices: unsplayChoices,
          min: 0,
          max: 1,
        })
      }
      if (splayChoices.length > 0) {
        choices.push({
          title: 'Splay up and draw',
          id: 'splay-up-draw',
          choices: splayChoices,
          min: 0,
          max: 1,
        })
      }

      const choice = game.actions.choose(player, choices)[0]
      const choiceId = choice.id ?? choice.title
      const inner = choice.selection[0]
      const color = (inner && typeof inner === 'object') ? inner.id : inner

      if (choiceId === 'unsplay' || choiceId === 'Unsplay') {
        game.actions.unsplay(player, color)
      }
      else if (choiceId === 'splay-up-draw' || choiceId === 'Splay up and draw') {
        game.actions.splay(player, color, 'up')
        game.actions.draw(player, { age: game.getEffectAge(self, 9) })
      }
      else {
        throw new Error('Invalid option: ' + JSON.stringify(choice))
      }
    },
  ],
}
