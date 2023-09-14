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

  describe('Fire Elemental Myrmidon', () => {
    test('+2 power, no promo', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Fire Elemental Myrmidon'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Fire Elemental Myrmidon')
      const request3 = t.choose(game, request2, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Fire Elemental Myrmidon'],
        },
      })
    })

    test('+2 power, promote obdience', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Fire Elemental Myrmidon', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Fire Elemental Myrmidon')
      const request3 = t.choose(game, request2, 'Play Card.House Guard')
      const request4 = t.choose(game, request3, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Fire Elemental Myrmidon'],
          innerCircle: ['House Guard'],
        },
      })
    })

    test('+2 power, cannot promote malice', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Fire Elemental Myrmidon', 'Eternal Flame Cultist'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Fire Elemental Myrmidon')
      const request3 = t.choose(game, request2, 'Play Card.Eternal Flame Cultist')
      const request4 = t.choose(game, request3, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Fire Elemental Myrmidon', 'Eternal Flame Cultist'],
          trophyHall: ['neutral'],
        },
      })
    })
  })

  describe('Vanifer', () => {
    test('assassinate a troop', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Vanifer', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Vanifer')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Vanifer'],
          trophyHall: ['neutral'],
          power: 0,
        },
        'araum-ched': {
          troops: [],
        },
      })

    })

    test('Recruit a Malice card that costs 4 or less without paying its cost', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Vanifer', 'Fire Elemental'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Vanifer')
      const request3 = t.choose(game, request2, 'Blackguard')

      t.testBoard(game, {
        dennis: {
          hand: ['Fire Elemental'],
          played: ['Vanifer'],
          discard: ['Blackguard'],
          trophyHall: ['neutral'],
        },
        'araum-ched': {
          troops: [],
        },
      })
    })
  })

  describe('Imix', () => {
    test('+4 power', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Imix', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Imix')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Imix'],
          power: 4,
        },
      })

    })

    test('Malice Focus > +2 power', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Imix', 'Fire Elemental'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Imix')

      t.testBoard(game, {
        dennis: {
          hand: ['Fire Elemental'],
          played: ['Imix'],
          power: 6
        },
      })
    })
  })

  describe('Crushing Wave Cultist', () => {
    test('Assassinate a white troop', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Crushing Wave Cultist', 'House Guard'],
        },
        'ched-llace a': {
          troops: ['micah'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Crushing Wave Cultist')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Crushing Wave Cultist'],
          trophyHall: ['neutral'],
        },
      })

    })

    test('Conquest Focus > Deploy 2 troops', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Crushing Wave Cultist', 'Advance Scout'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Crushing Wave Cultist')
      const request3 = t.choose(game, request2, 'Ched Nasad')
      const request4 = t.choose(game, request3, 'Ched Nasad')

      t.testBoard(game, {
        dennis: {
          hand: ['Advance Scout'],
          played: ['Crushing Wave Cultist'],
          trophyHall: ['neutral'],
        },
        'Ched Nasad': {
          troops: ['dennis', 'dennis', 'dennis'],
        },
      })
    })
  })

  describe('Water Elemental', () => {
    test('Assassinate a white troop', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Water Elemental', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Water Elemental')
      const request3 = t.choose(game, request2, 'Ched Nasad')
      const request4 = t.choose(game, request3, 'Ched Nasad')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Water Elemental'],
        },
        'Ched Nasad': {
          troops: ['dennis', 'dennis', 'dennis'],
        },
      })

    })

    test('Conquest Focus > Deploy 2 troops', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'elementals'],
        dennis: {
          hand: ['Water Elemental', 'Advance Scout'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Water Elemental')
      const request3 = t.choose(game, request2, 'Ched Nasad')
      const request4 = t.choose(game, request3, 'Ched Nasad')

      t.testBoard(game, {
        dennis: {
          hand: ['Advance Scout', 'Soldier'],
          played: ['Water Elemental'],
        },
        'Ched Nasad': {
          troops: ['dennis', 'dennis', 'dennis'],
        },
      })
    })
  })

})
