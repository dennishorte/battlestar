Error.stackTraceLimit = 100

const t = require('./testutil.js')


describe('Undead expansion', () => {
  describe('Banshee', () => {
    test('place a spy; no power', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Banshee', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Banshee')
      const request3 = t.choose(game, request2, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Banshee'],
          power: 0,
        },
        Menzoberranzan: {
          spies: ['dennis'],
          troops: ['neutral', 'neutral', 'neutral'],
        },
      })
    })

    test('place a spy; enemy troop but not spy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Banshee', 'House Guard'],
        },
        Menzoberranzan: {
          troops: ['neutral', 'neutral', 'neutral', 'micah'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Banshee')
      const request3 = t.choose(game, request2, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Banshee'],
          power: 0,
        },
        Menzoberranzan: {
          spies: ['dennis'],
          troops: ['neutral', 'neutral', 'neutral', 'micah'],
        },
      })
    })

    test('place a spy; enemy spy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'undead'],
        dennis: {
          hand: ['Banshee', 'House Guard'],
        },
        Menzoberranzan: {
          troops: ['neutral', 'neutral', 'neutral'],
          spies: ['micah'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Banshee')
      const request3 = t.choose(game, request2, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Banshee'],
          power: 3,
        },
        Menzoberranzan: {
          spies: ['dennis', 'micah'],
          troops: ['neutral', 'neutral', 'neutral'],
        },
      })
    })
  })
})
