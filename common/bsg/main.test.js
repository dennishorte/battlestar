const bsg = require('./main.js')


function gameFixture() {
  const lobby = {
    game: 'BattleStar Galactica',
    name: 'Test Lobby',
    options: {
      expansions: ['base game']
    },
    users: [
      { _id: 0, name: 'dennis' },
      { _id: 1, name: 'micah' },
      { _id: 2, name: 'scott' },
    ],
  }
  return bsg.factory(lobby)

}


describe('newGame', () => {
  test('setup', () => {
    const game = gameFixture()
  })
})
