Error.stackTraceLimit = 100

const t = require('./testutil.js')


describe('Elementals expansion', () => {

  describe('Eternal Flame Cultist', () => {
    test('assassinate a troop', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Eternal Flame Cultist', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Eternal Flame Cultist')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Eternal Flame Cultist'],
          trophyHall: ['neutral'],
          power: 0,
        },
        'araum-ched': {
          troops: [],
        },
      })

    })

    test('Malice Focus > +2 power (in hand)', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Eternal Flame Cultist', 'Fire Elemental'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Eternal Flame Cultist')

      t.testBoard(game, {
        dennis: {
          hand: ['Fire Elemental'],
          played: ['Eternal Flame Cultist'],
          trophyHall: ['neutral'],
          power: 2,
        },
        'araum-ched': {
          troops: [],
        },
      })
    })

    test('Malice Focus > +2 power (played)', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Eternal Flame Cultist', 'Fire Elemental Myrmidon'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Fire Elemental Myrmidon')
      const request3 = t.choose(game, request2, 'Play Card.Eternal Flame Cultist')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Eternal Flame Cultist', 'Fire Elemental Myrmidon'],
          trophyHall: ['neutral'],
          power: 4,
        },
        'araum-ched': {
          troops: [],
        },
      })
    })
  })

  describe('Fire Elemental', () => {
    test('Choose: +2 power', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Fire Elemental', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Fire Elemental')
      const request3 = t.choose(game, request2, '+2 power')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Fire Elemental'],
          power: 2,
        },
      })
    })

    test('Choose: +2 influence', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Fire Elemental', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Fire Elemental')
      const request3 = t.choose(game, request2, '+2 influence')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Fire Elemental'],
          influence: 2,
        },
      })
    })

    test('Malice Focus > draw a card', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Fire Elemental', 'Fire Elemental'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Fire Elemental')
      const request3 = t.choose(game, request2, '+2 influence')

      t.testBoard(game, {
        dennis: {
          hand: ['Fire Elemental', 'Soldier',],
          played: ['Fire Elemental'],
          influence: 2,
        },
      })
    })

  })

})
