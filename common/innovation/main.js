const { GameFactory } = require('./game.js')

const game = GameFactory('test game', 123)

console.log('*** first run')
const result = game.run()
console.log(result)

console.log('*** second run')
game.respondToInputRequest({ selection: ['response'], key: result.key })
