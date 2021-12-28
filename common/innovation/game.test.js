Error.stackTraceLimit = 100

const Game = require('./game.js')

function _deepLog(obj) {
  console.log(JSON.stringify(obj, null, 2))
}

describe('new game', () => {
  test('creates', () => {
    const lobby = {
      game: 'Innovation',
      name: 'Test Lobby',
      options: {
        expansions: ['base']
      },
      users: [
        { _id: 0, name: 'dennis' },
        { _id: 1, name: 'micah' },
        { _id: 2, name: 'tom' },
      ],
    }

    const game = Game.factory(lobby)
    game.run()
    expect(game.getTransition()).toBeDefined()
  })
})

describe('triggers', () => {

  // Possibly tricky cards
  // - Alhazen
  // - Jackie Chan

  describe.skip('count-biscuits', () => {})
  describe.skip('count-score', () => {})

  describe.skip('eligibility-achievements', () => {})
  describe.skip('eligibility-decrees', () => {})

  describe.skip('list-achievements', () => {})
  describe.skip('list-bonuses', () => {})
  describe.skip('list-dogma', () => {})
  describe.skip('list-echo', () => {})
  describe.skip('list-hand', () => {})
  describe.skip('list-inspire', () => {})
  describe.skip('list-score', () => {})

  describe.skip('claim-achievement-first', () => {})
  describe.skip('claim-achievement-instead', () => {})
  describe.skip('demand-success-first', () => {})
  describe.skip('demand-success-instead', () => {})
  describe.skip('dogma-first', () => {})
  describe.skip('dogma-instead', () => {})
  describe.skip('draw-first', () => {})
  describe.skip('draw-instead', () => {})
  describe.skip('draw-share-first', () => {})
  describe.skip('draw-share-instead', () => {})
  describe.skip('fade-before', () => {})
  describe.skip('fade-instead', () => {})
  describe.skip('foreshadow-first', () => {})
  describe.skip('foreshadow-instead', () => {})
  describe.skip('game-end-first', () => {})
  describe.skip('game-end-instead', () => {})
  describe.skip('inspire-first', () => {})
  describe.skip('inspire-instead', () => {})
  describe.skip('meld-first', () => {})
  describe.skip('meld-instead', () => {})
  describe.skip('not-share-first', () => {})
  describe.skip('not-share-instead', () => {})
  describe.skip('remove-first', () => {})
  describe.skip('remove-instead', () => {})
  describe.skip('return-first', () => {})
  describe.skip('return-instead', () => {})
  describe.skip('score-first', () => {})
  describe.skip('score-instead', () => {})
  describe.skip('splay-first', () => {})
  describe.skip('splay-instead', () => {})
  describe.skip('transfer-first', () => {})
  describe.skip('transfer-instead', () => {})
  describe.skip('tuck-first', () => {})
  describe.skip('tuck-instead', () => {})

  describe.skip('achievement-check', () => {})
  describe.skip('turn-start', () => {})  // Used by Monument
})
