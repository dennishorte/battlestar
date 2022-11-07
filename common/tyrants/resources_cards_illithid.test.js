Error.stackTraceLimit = 100

const t = require('./testutil.js')


describe('Illithids expansion', () => {
  describe('Aboleth', () => {
    test('place 2 spies', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Aboleth', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Aboleth')
      const request3 = t.choose(game, request2, 'Place 2 spies')
      const request4 = t.choose(game, request3, 'Chasmleap Bridge')
      const request5 = t.choose(game, request4, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Aboleth'],
        },
        Menzoberranzan: {
          spies: ['dennis'],
          troops: ['neutral', 'neutral', 'neutral'],
        },
        'Chasmleap Bridge': {
          spies: ['dennis'],
        },
      })
    })

    test('draw a card for each spy you have on the board', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Aboleth'],
        },
        Menzoberranzan: {
          spies: ['dennis'],
          troops: ['neutral', 'neutral', 'neutral'],
        },
        'Chasmleap Bridge': {
          spies: ['dennis'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Aboleth')
      const request3 = t.choose(game, request2, 'Draw a card for each spy you have on the board')

      t.testBoard(game, {
        dennis: {
          hand: ['Soldier', 'Soldier'],
          played: ['Aboleth'],
        },
      })
    })
  })

  describe('Ambassador', () => {
    test('promote', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Ambassador', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.House Guard')
      const request3 = t.choose(game, request2, 'Play Card.Ambassador')
      const request4 = t.choose(game, request3, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Ambassador'],
          innerCircle: ['House Guard'],
        },
      })
    })

    test('on discard', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Gauth'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'House Guard', 'Ambassador'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Gauth')
      const request3 = t.choose(game, request2, '*Draw a card. Choose one opponent with more than 3 cards to discard a card')
      const request4 = t.choose(game, request3, 'Ambassador')
      const request5 = t.choose(game, request4, 'yes')


      t.testBoard(game, {
        dennis: {
          hand: ['Soldier'],
          played: ['Gauth'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'House Guard'],
          innerCircle: ['Ambassador'],
        },
      })
    })
  })

  describe('Beholder', () => {
    test('assassinate and points', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Beholder'],
          trophyHall: ['neutral', 'neutral', 'neutral', 'neutral']
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Beholder')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Beholder'],
          trophyHall: ['neutral', 'neutral', 'neutral', 'neutral', 'neutral'],
          power: 1,
        },
      })
    })
  })

  describe('Brainwashed Slave', () => {
    test('place a spy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Brainwashed Slave', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Brainwashed Slave')
      const request3 = t.choose(game, request2, 'Place a spy')
      const request4 = t.choose(game, request3, 'Chasmleap Bridge')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Brainwashed Slave'],
        },
        'Chasmleap Bridge': {
          spies: ['dennis'],
        },
      })
    })

    test('return a spy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Brainwashed Slave', 'House Guard'],
        },
        'Chasmleap Bridge': {
          spies: ['dennis']
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Brainwashed Slave')
      const request3 = t.choose(game, request2, 'Return one of your spies > +2 power, + 2 influence')
      const request4 = t.choose(game, request3, 'Chasmleap Bridge')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Brainwashed Slave'],
          power: 2,
          influence: 2,
        },
        'Chasmleap Bridge': {
          spies: [],
        },
      })

    })
  })

  describe('Chuul', () => {
    test('place a spy and opponents discard', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Chuul', 'House Guard'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'House Guard', 'Ambassador'],
        },
        'Chasmleap Bridge': {
          troops: ['micah'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Chuul')
      const request3 = t.choose(game, request2, 'Chasmleap Bridge')
      const request4 = t.choose(game, request3, 'House Guard')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Chuul'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'Ambassador'],
          discard: ['House Guard'],
        },
        'Chasmleap Bridge': {
          spies: ['dennis'],
          troops: ['micah'],
        },
      })
    })

    test('place a spy but opponents do not discard', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Chuul', 'House Guard'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'House Guard'],
        },
        'Chasmleap Bridge': {
          troops: ['micah'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Chuul')
      const request3 = t.choose(game, request2, 'Chasmleap Bridge')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Chuul'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'House Guard'],
        },
        'Chasmleap Bridge': {
          spies: ['dennis'],
          troops: ['micah'],
        },
      })
    })

  })

  describe('Gauth', () => {
    test('influence', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Gauth'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Gauth')
      const request3 = t.choose(game, request2, '+2 influence')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Gauth'],
          influence: 2,
        }
      })
    })

    test('Draw and opponents discard', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Gauth'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'House Guard', 'Ambassador'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Gauth')
      const request3 = t.choose(game, request2, '*Draw a card. Choose one opponent with more than 3 cards to discard a card')
      const request4 = t.choose(game, request3, 'House Guard')

      t.testBoard(game, {
        dennis: {
          hand: ['Soldier'],
          played: ['Gauth'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'Ambassador'],
          discard: ['House Guard'],
        },
      })
    })
  })
})
