Error.stackTraceLimit = 100

const t = require('./testutil.js')


describe('Undead expansion', () => {
  describe('Ghoul', () => {
    test('power and outcasts', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Ghoul', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Ghoul')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Ghoul'],
          power: 2,
        },
        micah: {
          hand: ['Noble', 'Noble', 'Noble', 'Noble', 'Noble'],
          discard: ['Insane Outcast'],
        },
      })
    })
  })

  describe('Mind Flayer', () => {
    test('devour and influence', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Mind Flayer', 'Priestess of Lolth', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Mind Flayer')
      const request3 = t.choose(game, request2, 'House Guard')
      const request4 = t.choose(game, request3, '+3 influence')

      t.testBoard(game, {
        dennis: {
          hand: ['Priestess of Lolth'],
          played: ['Mind Flayer'],
          influence: 3,
        },
        devoured: ['House Guard'],
      })
    })

    test('devour and assassinate', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Mind Flayer', 'Priestess of Lolth', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Mind Flayer')
      const request3 = t.choose(game, request2, 'House Guard')
      const request4 = t.choose(game, request3, 'Assassinate a troop')

      t.testBoard(game, {
        dennis: {
          hand: ['Priestess of Lolth'],
          played: ['Mind Flayer'],
          trophyHall: ['neutral'],
          influence: 0,
        },
        devoured: ['House Guard'],
        'araum-ched': {
          troops: [],
        },
      })
    })

    test('do not devour', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Mind Flayer', 'Priestess of Lolth', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Mind Flayer')
      const request3 = t.choose(game, request2)

      t.testBoard(game, {
        dennis: {
          hand: ['Priestess of Lolth', 'House Guard'],
          played: ['Mind Flayer'],
        },
      })
    })
  })

  describe('Glavrezu', () => {
    test('devour and assassinate', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Glavrezu', 'Priestess of Lolth', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Glavrezu')
      const request3 = t.choose(game, request2, 'House Guard')

      t.testBoard(game, {
        dennis: {
          hand: ['Priestess of Lolth'],
          played: ['Glavrezu'],
          trophyHall: ['neutral'],
          influence: 0,
        },
        devoured: ['House Guard'],
        'araum-ched': {
          troops: [],
        },
      })
    })

    test('do not devour', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Glavrezu', 'Priestess of Lolth', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Glavrezu')
      const request3 = t.choose(game, request2)

      t.testBoard(game, {
        dennis: {
          hand: ['Priestess of Lolth', 'House Guard'],
          played: ['Glavrezu'],
        },
      })
    })
  })

  describe('Marilith', () => {
    test('devour and assassinate', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Marilith', 'Priestess of Lolth', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Marilith')
      const request3 = t.choose(game, request2, 'House Guard')

      t.testBoard(game, {
        dennis: {
          hand: ['Priestess of Lolth'],
          played: ['Marilith'],
          power: 5,
        },
        devoured: ['House Guard'],
      })
    })

    test('do not devour', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Marilith', 'Priestess of Lolth', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Marilith')
      const request3 = t.choose(game, request2)

      t.testBoard(game, {
        dennis: {
          hand: ['Priestess of Lolth', 'House Guard'],
          played: ['Marilith'],
          power: 0,
        },
      })
    })
  })

  describe('Orcus', () => {
    test('devour and assassinate; choose none', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Orcus', 'Priestess of Lolth', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Orcus')
      const request3 = t.choose(game, request2, 'House Guard')
      const request4 = t.choose(game, request3)

      t.testBoard(game, {
        dennis: {
          hand: ['Priestess of Lolth'],
          played: ['Orcus'],
          trophyHall: ['neutral'],
        },
        devoured: ['House Guard'],
      })
    })

    test('devour and assassinate; choose one', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Orcus', 'Priestess of Lolth', 'House Guard'],
        },
        micah: {
          trophyHall: ['neutral'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Orcus')
      const request3 = t.choose(game, request2, 'House Guard')
      const request4 = t.choose(game, request3, 'micah: neutral')
      const request5 = t.choose(game, request4, 'Chasmleap Bridge')

      t.testBoard(game, {
        dennis: {
          hand: ['Priestess of Lolth'],
          played: ['Orcus'],
          trophyHall: ['neutral'],
        },
        micah: {
          hand: ['Noble', 'Noble', 'Noble', 'Noble', 'Noble'],
          trophyHall: [],
        },
        devoured: ['House Guard'],
        'Chasmleap Bridge': {
          troops: ['neutral'],
        },
      })
    })

    test('do not devour', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Orcus', 'Priestess of Lolth', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Orcus')
      const request3 = t.choose(game, request2)

      t.testBoard(game, {
        dennis: {
          hand: ['Priestess of Lolth', 'House Guard'],
          played: ['Orcus'],
        },
      })
    })
  })

  describe('Gibbering Mouther', () => {
    test('devour and assassinate; choose none', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Gibbering Mouther', 'House Guard'],
        },
        Llacerellyn: {
          troops: ['dennis'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Gibbering Mouther')
      const request3 = t.choose(game, request2, 'erynd-llace')
      const request4 = t.choose(game, request3, 'llace-tsen')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Gibbering Mouther'],
        },
        micah: {
          hand: ['Noble', 'Noble', 'Noble', 'Noble', 'Noble'],
          discard: ['Insane Outcast'],
        },
      })
    })
  })
})
