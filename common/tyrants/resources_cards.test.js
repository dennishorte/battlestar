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

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Blackguard')
        const request3 = t.choose(game, request2, 'Assassinate a troop')

        t.testBoard(game, {
          dennis: {
            played: ['Blackguard'],
            trophyHall: ['neutral'],
          },
          'araum-ched': {
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
        const request3 = t.choose(game, request2, 'ched-halls a, micah')

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
        const request4 = t.choose(game, request3, 'ched-halls a, neutral')

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

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Inquisitor')
        const request3 = t.choose(game, request2, 'Assassinate a troop')

        t.testBoard(game, {
          dennis: {
            played: ['Inquisitor'],
            trophyHall: ['neutral'],
          },
          'araum-ched': {
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

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Advance Scout')

        t.testBoard(game, {
          dennis: {
            played: ['Advance Scout'],
            trophyHall: ['neutral'],
          },
          'araum-ched': {
            troops: ['dennis']
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
        const request4 = t.choose(game, request3, 'ched-llace a, neutral')

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

        t.setTroops(game, 'ched-llace a', ['dennis'])

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Underdark Ranger')

        t.testBoard(game, {
          dennis: {
            played: ['Underdark Ranger'],
            trophyHall: ['neutral'],
          },
          'araum-ched': {
            troops: []
          },
          'ched-llace a': {
            troops: ['dennis']
          },
        })
      })
    })

    describe('Master of Melee-Magthere', () => {
      test('deploy', () => {
        const game = t.gameFixture({
          dennis: {
            hand: ['Master of Melee-Magthere'],
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Master of Melee-Magthere')
        const request3 = t.choose(game, request2, 'Deploy 4 troops')
        const request4 = t.choose(game, request3, 'ched-llace a')
        const request5 = t.choose(game, request4, 'ched-llace b')
        const request6 = t.choose(game, request5, 'Llacerellyn')
        const request7 = t.choose(game, request6, 'erynd-llace')

        t.testBoard(game, {
          dennis: {
            played: ['Master of Melee-Magthere'],
          },
          'ched-llace a': {
            troops: ['dennis'],
          },
          'ched-llace b': {
            troops: ['dennis'],
          },
        })
      })

      test('supplant', () => {
        const game = t.gameFixture({
          dennis: {
            hand: ['Master of Melee-Magthere'],
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Master of Melee-Magthere')
        const request3 = t.choose(game, request2, 'Supplant a white troop anywhere on the board')
        const request4 = t.choose(game, request3, 'Gracklstugh, neutral')

        t.testBoard(game, {
          dennis: {
            played: ['Master of Melee-Magthere'],
            trophyHall: ['neutral'],
          },
          'Gracklstugh': {
            troops: ['neutral', 'dennis'],
          },
        })
      })
    })

    describe('Weaponmaster', () => {
      test('three choices', () => {
        const game = t.gameFixture({
          dennis: {
            hand: ['Weaponmaster'],
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Weaponmaster')
        const request3 = t.choose(game, request2, 'Deploy a troop')
        const request4 = t.choose(game, request3, 'ched-halls a')
        const request5 = t.choose(game, request4, 'Assassinate a white troop')
        const request6 = t.choose(game, request5, 'Deploy a troop')
        const request7 = t.choose(game, request6, 'araum-ched')

        t.testBoard(game, {
          dennis: {
            played: ['Weaponmaster'],
            trophyHall: ['neutral'],
          },
          'araum-ched': {
            troops: ['dennis'],
          },
          'ched-halls a': {
            troops: ['dennis'],
          },
        })

      })
    })

    describe('Spellspinner', () => {
      test('place a spy', () => {
        const game = t.gameFixture({
          dennis: {
            hand: ['Spellspinner'],
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Spellspinner')
        const request3 = t.choose(game, request2, 'Place a spy')
        const request4 = t.choose(game, request3, 'Menzoberranzan')

        t.testBoard(game, {
          dennis: {
            played: ['Spellspinner'],
          },
          'Menzoberranzan': {
            troops: ['neutral', 'neutral', 'neutral'],
            spies: ['dennis'],
          },
        })
      })

      test('return a spy', () => {
        const game = t.gameFixture({
          dennis: {
            hand: ['Spellspinner'],
          }
        })

        t.setSpies(game, 'Menzoberranzan', ['dennis'])

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Spellspinner')
        const request3 = t.choose(game, request2, "Return one of your spies > Supplant a troop at that spy's site")

        t.testBoard(game, {
          dennis: {
            played: ['Spellspinner'],
            trophyHall: ['neutral'],
          },
          'Menzoberranzan': {
            troops: ['neutral', 'neutral', 'dennis'],
          },
        })

      })
    })

    describe('Spy Master', () => {
      test('place a spy', () => {
        const game = t.gameFixture({
          dennis: {
            hand: ['Spy Master'],
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Spy Master')
        const request3 = t.choose(game, request2, 'Menzoberranzan')

        t.testBoard(game, {
          dennis: {
            played: ['Spy Master'],
          },
          'Menzoberranzan': {
            troops: ['neutral', 'neutral', 'neutral'],
            spies: ['dennis'],
          },
        })
      })
    })

  })
})
