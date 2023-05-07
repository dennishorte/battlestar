Error.stackTraceLimit = 100

const {
  GameOverEvent,
  InputRequestEvent,
} = require('../../lib/game.js')

const t = require('./testutil_cube.js')


describe('CubeDraft', () => {

  test('game creation', () => {
    const game = t.fixture()
    const request1 = game.run()
    // If no errors thrown, success.
  })

  describe('make picks', () => {

    test('dennis first pick', () => {
      const game = t.fixture()

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'dennis', 'agility')

      t.testBoard(game, {
        dennis: {
          picked: ['agility'],
          waiting: [],
        },
        micah: {
          picked: [],
          waiting: ['micah-0', 'dennis-0'],
        },
      })
    })

    test('micah first pick', () => {
      const game = t.fixture()

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'micah', 'lightning bolt')

      t.testBoard(game, {
        dennis: {
          picked: [],
          waiting: ['dennis-0', 'micah-0'],
        },
        micah: {
          picked: ['lightning bolt'],
          waiting: [],
        },
      })
    })

    test('dennis micah dennis', () => {
      const game = t.fixture()

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'dennis', 'agility')
      const request3 = t.choose(game, request2, 'micah', 'lightning bolt')
      const request4 = t.choose(game, request3, 'dennis', 'mountain')

      t.testBoard(game, {
        dennis: {
          picked: ['agility', 'mountain'],
          waiting: [],
        },
        micah: {
          picked: ['lightning bolt'],
          waiting: ['dennis-0', 'micah-0'],
        },
      })
    })

    test('dennis micah micah', () => {
      const game = t.fixture()

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'dennis', 'agility')
      const request3 = t.choose(game, request2, 'micah', 'lightning bolt')
      const request4 = t.choose(game, request3, 'micah', 'advance scout')

      t.testBoard(game, {
        dennis: {
          picked: ['agility'],
          waiting: ['micah-0', 'dennis-0'],
        },
        micah: {
          picked: ['lightning bolt', 'advance scout'],
          waiting: [],
        },
      })
    })
  })

  describe('open next packs', () => {

    test('dennis opens first', () => {
      const game = t.fixture()

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'dennis', 'agility')
      const request3 = t.choose(game, request2, 'micah', 'lightning bolt')
      const request4 = t.choose(game, request3, 'micah', 'advance scout')
      const request5 = t.choose(game, request4, 'dennis', 'mountain')
      const request6 = t.choose(game, request5, 'dennis', 'akki ember-keeper')

      t.testBoard(game, {
        dennis: {
          picked: ['agility', 'mountain', 'akki ember-keeper'],
          waiting: ['dennis-1'],
        },
        micah: {
          picked: ['lightning bolt', 'advance scout'],
          waiting: ['micah-0'],
        },
      })
    })

    test('dennis opens then picks', () => {
      const game = t.fixture()

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'dennis', 'agility')
      const request3 = t.choose(game, request2, 'micah', 'lightning bolt')
      const request4 = t.choose(game, request3, 'micah', 'advance scout')
      const request5 = t.choose(game, request4, 'dennis', 'mountain')
      const request6 = t.choose(game, request5, 'dennis', 'akki ember-keeper')
      const request7 = t.choose(game, request6, 'dennis', 'goblin balloon brigade')

      t.testBoard(game, {
        dennis: {
          picked: ['agility', 'mountain', 'akki ember-keeper', 'goblin balloon brigade'],
          waiting: [],
        },
        micah: {
          picked: ['lightning bolt', 'advance scout'],
          waiting: ['micah-0', 'dennis-1'],
        },
      })
    })

  })
})
