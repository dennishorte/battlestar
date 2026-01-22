Error.stackTraceLimit = 100

const t = require('../../testutil.js')


describe('Drow Expansion', () => {

  describe('Blackguard', () => {
    test('power', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Blackguard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Blackguard')
      const request3 = t.choose(game, '+2 power')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Blackguard'],
          power: 2,
        }
      })
    })

    test('assassinate', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Blackguard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Blackguard')
      const request3 = t.choose(game, 'Assassinate a troop')

      t.testBoard(game, {
        dennis: {
          discard: ['Blackguard'],
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
      const request2 = t.choose(game, 'Play Card.Bounty Hunter')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Bounty Hunter'],
          power: 3,
        }
      })
    })
  })

  describe('Doppelganger', () => {
    test('supplant', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Doppelganger'],
        },
        'ched-halls a': {
          troops: ['micah']
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Doppelganger')
      const request3 = t.choose(game, 'ched-halls a, micah')

      t.testBoard(game, {
        dennis: {
          discard: ['Doppelganger'],
          trophyHall: ['troop-micah'],
        },
        'ched-halls a': {
          troops: ['dennis']
        },
      })
    })
  })

  describe('Deathblade', () => {
    test('assassinate two', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Deathblade'],
        },
        'ched-halls a': {
          troops: ['micah'],
        },
        'ched-llace a': {
          troops: ['micah'],
        },
      })


      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Deathblade')
      const request3 = t.choose(game, 'ched-halls a, micah')
      const request4 = t.choose(game, 'araum-ched, neutral')

      t.testBoard(game, {
        dennis: {
          discard: ['Deathblade'],
          trophyHall: ['troop-micah', 'neutral'],
        },
        'ched-halls a': {
          troops: []
        },
      })
    })
  })

  describe('Inquisitor', () => {
    test('influence', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Inquisitor'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Inquisitor')
      const request3 = t.choose(game, '+2 influence')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Inquisitor'],
          influence: 2,
        }
      })
    })

    test('assassinate', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Inquisitor'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Inquisitor')
      const request3 = t.choose(game, 'Assassinate a troop')

      t.testBoard(game, {
        dennis: {
          discard: ['Inquisitor'],
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
      const request2 = t.choose(game, 'Play Card.Advance Scout')

      t.testBoard(game, {
        dennis: {
          discard: ['Advance Scout'],
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
        },
        'ched-halls a': {
          troops: ['neutral'],
        },
        'ched-llace a': {
          troops: ['neutral'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Underdark Ranger')
      const request3 = t.choose(game, 'ched-halls a, neutral')
      const request4 = t.choose(game, 'ched-llace a, neutral')

      t.testBoard(game, {
        dennis: {
          discard: ['Underdark Ranger'],
          trophyHall: ['neutral', 'neutral'],
        },
        'ched-halls a': {
          troops: []
        },
        'ched-llace a': {
          troops: []
        },
      })
    })

    test('only one valid target', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Underdark Ranger'],
        },
        'ched-llace a': {
          troops: ['dennis'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Underdark Ranger')

      t.testBoard(game, {
        dennis: {
          discard: ['Underdark Ranger'],
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
      const request2 = t.choose(game, 'Play Card.Master of Melee-Magthere')
      const request3 = t.choose(game, 'Deploy 4 troops')
      const request4 = t.choose(game, 'ched-llace a')
      const request5 = t.choose(game, 'ched-llace b')
      const request6 = t.choose(game, 'Llacerellyn')
      const request7 = t.choose(game, 'erynd-llace')

      t.testBoard(game, {
        dennis: {
          discard: ['Master of Melee-Magthere'],
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
      const request2 = t.choose(game, 'Play Card.Master of Melee-Magthere')
      const request3 = t.choose(game, 'Supplant a white troop anywhere on the board')
      const request4 = t.choose(game, 'Gracklstugh, neutral')

      t.testBoard(game, {
        dennis: {
          discard: ['Master of Melee-Magthere'],
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
      const request2 = t.choose(game, 'Play Card.Weaponmaster')
      const request3 = t.choose(game, 'Deploy a troop')
      const request4 = t.choose(game, 'ched-halls a')
      const request5 = t.choose(game, 'Assassinate a white troop')
      const request6 = t.choose(game, 'Deploy a troop')
      const request7 = t.choose(game, 'araum-ched')

      t.testBoard(game, {
        dennis: {
          discard: ['Weaponmaster'],
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
      const request2 = t.choose(game, 'Play Card.Spellspinner')
      const request3 = t.choose(game, 'Place a spy')
      const request4 = t.choose(game, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          discard: ['Spellspinner'],
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
        },
        'Menzoberranzan': {
          spies: ['dennis'],
        },
      })


      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Spellspinner')
      const request3 = t.choose(game, "Return one of your spies > Supplant a troop at that spy's site")
      const request4 = t.choose(game, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          discard: ['Spellspinner'],
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
      const request2 = t.choose(game, 'Play Card.Spy Master')
      const request3 = t.choose(game, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          discard: ['Spy Master'],
        },
        'Menzoberranzan': {
          troops: ['neutral', 'neutral', 'neutral'],
          spies: ['dennis'],
        },
      })
    })
  })

  describe('Infiltrator', () => {
    test('place a spy', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Infiltrator'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Infiltrator')
      const request3 = t.choose(game, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          discard: ['Infiltrator'],
          power: 0,
        },
        'Menzoberranzan': {
          troops: ['neutral', 'neutral', 'neutral'],
          spies: ['dennis'],
        },
      })
    })

    test('place a spy, gain power', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Infiltrator'],
        },
        'Menzoberranzan': {
          troops: ['neutral', 'neutral', 'micah'],
        },
      })


      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Infiltrator')
      const request3 = t.choose(game, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Infiltrator'],
          power: 1,
        },
        'Menzoberranzan': {
          troops: ['neutral', 'neutral', 'micah'],
          spies: ['dennis'],
        },
      })
    })
  })

  describe('Information Broker', () => {
    test('place a spy', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Information Broker'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Information Broker')
      const request3 = t.choose(game, 'Place a spy')
      const request4 = t.choose(game, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          discard: ['Information Broker'],
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
          hand: ['Information Broker'],
          deck: ['House Guard', 'House Guard', 'House Guard'],
        },
        'Menzoberranzan': {
          spies: ['dennis'],
        },
      })


      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Information Broker')
      const request3 = t.choose(game, "Return one of your spies > Draw 3 cards")
      const request4 = t.choose(game, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          played: ['Information Broker'],
          hand: ['House Guard', 'House Guard', 'House Guard'],
        },
        'Menzoberranzan': {
          troops: ['neutral', 'neutral', 'neutral'],
        },
      })

    })
  })

  describe('Masters of Sorcere', () => {
    test('place a spy', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Masters of Sorcere'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Masters of Sorcere')
      const request3 = t.choose(game, 'Place 2 spies')
      const request4 = t.choose(game, 'Menzoberranzan')
      const request5 = t.choose(game, 'Kanaglym')

      t.testBoard(game, {
        dennis: {
          discard: ['Masters of Sorcere'],
        },
        'Menzoberranzan': {
          troops: ['neutral', 'neutral', 'neutral'],
          spies: ['dennis'],
        },
        'Kanaglym': {
          spies: ['dennis'],
        },
      })
    })

    test('return a spy', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Masters of Sorcere'],
        },
        'Menzoberranzan': {
          spies: ['dennis'],
        },
      })


      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Masters of Sorcere')
      const request3 = t.choose(game, "Return one of your spies > +4 power")
      const request4 = t.choose(game, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Masters of Sorcere'],
          power: 4,
        },
      })
    })
  })

  describe('Advocate', () => {
    test('influence', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Advocate'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Advocate')
      const request3 = t.choose(game, '+2 influence')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Advocate'],
          influence: 2,
        }
      })
    })

    test('promote', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Advocate', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.House Guard')
      const request3 = t.choose(game, 'Play Card.Advocate')
      const request4 = t.choose(game, "At end of turn, promote another card played this turn")
      const request5 = t.choose(game, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Advocate'],
          innerCircle: ['House Guard'],
        },
      })

    })
  })

  describe('Chosen of Lolth', () => {
    test('return a troop', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Chosen of Lolth', 'House Guard'],
        },
        'ched-llace a': {
          troops: ['micah'],
        },
        'Ched Nasad': {
          spies: ['micah'],
        },
      })


      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Chosen of Lolth')
      const request3 = t.choose(game, 'troop.ched-llace a, micah')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Chosen of Lolth'],
        },
        'Ched Nasad': {
          troops: ['dennis'],
          spies: ['micah'],
        },
        'ched-llace a': {
          troops: [],
        },
      })
    })

    test('return a spy', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Chosen of Lolth', 'House Guard'],
        },
        'Ched Nasad': {
          spies: ['micah'],
        },
        'ched-llace a': {
          troops: ['micah'],
        },
      })


      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Chosen of Lolth')
      const request3 = t.choose(game, 'spy.Ched Nasad, micah')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Chosen of Lolth'],
        },
        'Ched Nasad': {
          troops: ['dennis'],
          spies: [],
        },
        'ched-llace a': {
          troops: ['micah'],
        },
      })
    })

    test('promote', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Chosen of Lolth', 'House Guard'],
        }
      })

      let request = game.run()
      request = t.choose(game, 'Play Card.Chosen of Lolth')
      request = t.choose(game, 'Play Card.House Guard')
      request = t.choose(game, 'Pass')

      t.testBoard(game, {
        dennis: {
          innerCircle: ['House Guard'],
          discard: ['Chosen of Lolth'],
        },
      })
    })
  })

  describe('Drow Negotiator', () => {
    test('three in inner circle', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Drow Negotiator', 'House Guard'],
          innerCircle: ['House Guard', 'House Guard', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Drow Negotiator')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Drow Negotiator'],
          innerCircle: ['House Guard', 'House Guard', 'House Guard'],
          influence: 0,
        },
      })
    })

    test('four in inner circle', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Drow Negotiator', 'House Guard'],
          innerCircle: ['House Guard', 'House Guard', 'House Guard', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Drow Negotiator')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Drow Negotiator'],
          innerCircle: ['House Guard', 'House Guard', 'House Guard', 'House Guard'],
          influence: 3,
        },
      })
    })

    test('promote', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Drow Negotiator', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Drow Negotiator')
      const request3 = t.choose(game, 'Play Card.House Guard')
      const request4 = t.choose(game, 'Pass')

      t.testBoard(game, {
        dennis: {
          innerCircle: ['House Guard'],
          discard: ['Drow Negotiator'],
        },
      })
    })
  })

  describe('Council Member', () => {
    test('move up to 2 enemy troops', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Council Member'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Council Member')
      const request3 = t.choose(game, 'Gracklstugh')

      t.testBoard(game, {
        dennis: {
          discard: ['Council Member'],
        },
        'araum-ched': {
          troops: [],
          spies: [],
        },
        Gracklstugh: {
          troops: ['neutral', 'neutral', 'neutral'],
          spies: [],
        }
      })
    })

    test('At end of turn, promote another card played this turn', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Council Member', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Council Member')
      const request3 = t.choose(game, 'Gracklstugh')
      const request4 = t.choose(game, 'Play Card.House Guard')
      const request5 = t.choose(game, 'Pass')

      t.testBoard(game, {
        dennis: {
          innerCircle: ['House Guard'],
          discard: ['Council Member'],
        },
      })

    })
  })

  describe('Matron Mother', () => {
    test('Put your deck into your discard pile. Then promote a card from your discard pile.', () => {
      const game = t.gameFixture({
        dennis: {
          deck: ['House Guard'],
          hand: ['Matron Mother'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Matron Mother')

      t.testBoard(game, {
        dennis: {
          innerCircle: ['House Guard'],
          hand: ['Matron Mother'],
        },
      })
    })
  })

})
