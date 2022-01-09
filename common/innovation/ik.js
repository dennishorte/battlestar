Error.stackTraceLimit = 100

const t = require('./testutil.js')
const game = t.fixtureDogma('Philosophy')
t.setColor(game, 'micah', 'red', ['Construction', 'Industrialization'])
game.run()
t.dogma(game, 'Philosophy')
game.submit({
  actor: 'micah',
  name: 'Choose Colors',
  option: ['red']
})
