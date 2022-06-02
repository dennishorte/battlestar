Error.stackTraceLimit = 100

const {
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')

const t = require('./testutil.js')


describe('Tyrants Cards', () => {

  describe('Core', () => {

    test('House Guard', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['House Guard'],
        }
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.House Guard')

      expect(t.dennis(game).power).toBe(2)
    })

    test('Priestess of Lolth', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Priestess of Lolth'],
        }
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Priestess of Lolth')

      expect(t.dennis(game).influence).toBe(2)
    })

    describe('Insane Outcast', () => {
      test('play', () => {
        const game = t.gameFixture({
          dennis: {
            hand: ['House Guard', 'Insane Outcast'],
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Insane Outcast')
        const request3 = t.choose(game, request2, 'House Guard')

        t.testBoard(game, {
          dennis: {
            played: [],
            discard: ['House Guard'],
          }
        })
      })

      test.skip('devour', () => {

      })

      test.skip('promote', () => {

      })
    })

  })

  describe('Drow Expansion', () => {

    describe('Blackguard', () => {
      test('power', () => {
        const game = t.gameFixture({
          dennis: {
            hand: ['Blackguard'],
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Blackguard')
        const request3 = t.choose(game, request2, '+2 power')

        expect(t.dennis(game).power).toBe(2)
      })

      test('assassinate', () => {
        const game = t.gameFixture({
          dennis: {
            hand: ['Blackguard'],
          }
        })

        t.setTroops(game, 'ched-halls a', ['neutral'])

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Blackguard')
        const request3 = t.choose(game, request2, 'Assassinate a troop')

        t.testBoard(game, {
          dennis: {
            played: ['Blackguard'],
            trophyHall: ['neutral'],
          },
          'ched-halls a': {
            troops: [],
          },
        })
      })
    })

    describe('Bounty Hunter', () => {
      test('power', () => {
        const game = t.gameFixture({
          dennis: {
            hand: ['Bounty Hunter'],
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Bounty Hunter')

        expect(t.dennis(game).power).toBe(3)
      })
    })

    describe('Doppelganger', () => {
      test('supplant', () => {
        const game = t.gameFixture({
          dennis: {
            hand: ['Doppelganger'],
          }
        })

        t.setTroops(game, 'ched-halls a', ['dennis', 'micah'])

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Doppelganger')

        t.testBoard(game, {
          dennis: {
            played: ['Doppelganger'],
            trophyHall: ['troop-micah'],
          },
          'ched-halls a': {
            troops: ['dennis', 'dennis']
          },
        })
      })
    })

    describe('Deathblade', () => {
      test('assassinate two', () => {
        const game = t.gameFixture({
          dennis: {
            hand: ['Deathblade'],
          }
        })

        t.setTroops(game, 'ched-halls a', ['neutral', 'micah'])

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Deathblade')
        const request3 = t.choose(game, request2, 'ched-halls a, micah')

        t.testBoard(game, {
          dennis: {
            played: ['Deathblade'],
            trophyHall: ['troop-micah', 'neutral'],
          },
          'ched-halls a': {
            troops: []
          },
        })
      })
    })

    describe('Inquisitor', () => {
      test('power', () => {
        const game = t.gameFixture({
          dennis: {
            hand: ['Inquisitor'],
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Inquisitor')
        const request3 = t.choose(game, request2, '+2 influence')

        expect(t.dennis(game).influence).toBe(2)
      })

      test('assassinate', () => {
        const game = t.gameFixture({
          dennis: {
            hand: ['Inquisitor'],
          }
        })

        t.setTroops(game, 'ched-halls a', ['neutral'])

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Inquisitor')
        const request3 = t.choose(game, request2, 'Assassinate a troop')

        t.testBoard(game, {
          dennis: {
            played: ['Inquisitor'],
            trophyHall: ['neutral'],
          },
          'ched-halls a': {
            troops: [],
          },
        })
      })
    })

    describe('Advance Scout', () => {
      test('supplant', () => {
        const game = t.gameFixture({
          dennis: {
            hand: ['Advance Scout'],
          }
        })

        t.setTroops(game, 'ched-halls a', ['neutral', 'micah'])

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Advance Scout')

        t.testBoard(game, {
          dennis: {
            played: ['Advance Scout'],
            trophyHall: ['neutral'],
          },
          'ched-halls a': {
            troops: ['dennis', 'micah']
          },
        })
      })
    })

    describe('Underdark Ranger', () => {
      test('assassinate two white', () => {
        const game = t.gameFixture({
          dennis: {
            hand: ['Underdark Ranger'],
          }
        })

        t.setTroops(game, 'ched-halls a', ['neutral', 'micah'])
        t.setTroops(game, 'ched-llace a', ['neutral', 'dennis'])

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Underdark Ranger')
        const request3 = t.choose(game, request2, 'ched-halls a, neutral')

        t.testBoard(game, {
          dennis: {
            played: ['Underdark Ranger'],
            trophyHall: ['neutral', 'neutral'],
          },
          'ched-halls a': {
            troops: ['micah']
          },
          'ched-llace a': {
            troops: ['dennis']
          },
        })
      })

      test('only one valid target', () => {
        const game = t.gameFixture({
          dennis: {
            hand: ['Underdark Ranger'],
          }
        })

        t.setTroops(game, 'ched-halls a', ['neutral', 'micah'])
        t.setTroops(game, 'ched-llace a', ['dennis'])

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Underdark Ranger')

        t.testBoard(game, {
          dennis: {
            played: ['Underdark Ranger'],
            trophyHall: ['neutral'],
          },
          'ched-halls a': {
            troops: ['micah']
          },
          'ched-llace a': {
            troops: ['dennis']
          },
        })
      })
    })

  })
})
