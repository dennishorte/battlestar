Error.stackTraceLimit = 100

const t = require('../../testutil.js')


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
      const request2 = t.choose(game, 'Play Card.Aboleth')
      const request3 = t.choose(game, 'Place 2 spies')
      const request4 = t.choose(game, 'Chasmleap Bridge')
      const request5 = t.choose(game, 'Menzoberranzan')

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
      const request2 = t.choose(game, 'Play Card.Aboleth')
      const request3 = t.choose(game, 'Draw a card for each spy you have on the board')

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
      const request2 = t.choose(game, 'Play Card.House Guard')
      const request3 = t.choose(game, 'Play Card.Ambassador')
      const request4 = t.choose(game, 'Pass')

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
      const request2 = t.choose(game, 'Play Card.Gauth')
      const request3 = t.choose(game, '*Draw a card. Choose one opponent with more than 3 cards to discard a card')
      const request4 = t.choose(game, 'Ambassador')
      const request5 = t.choose(game, 'yes')


      t.testBoard(game, {
        dennis: {
          hand: ['Soldier'],
          played: ['Gauth'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'House Guard', 'Soldier'],
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
      const request2 = t.choose(game, 'Play Card.Beholder')

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
      const request2 = t.choose(game, 'Play Card.Brainwashed Slave')
      const request3 = t.choose(game, 'Place a spy')
      const request4 = t.choose(game, 'Chasmleap Bridge')

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
      const request2 = t.choose(game, 'Play Card.Brainwashed Slave')
      const request3 = t.choose(game, 'Return one of your spies > +2 power, + 2 influence')
      const request4 = t.choose(game, 'Chasmleap Bridge')

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
      const request2 = t.choose(game, 'Play Card.Chuul')
      const request3 = t.choose(game, 'Chasmleap Bridge')
      const request4 = t.choose(game, 'House Guard')

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
      const request2 = t.choose(game, 'Play Card.Chuul')
      const request3 = t.choose(game, 'Chasmleap Bridge')

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

  describe('Cloaker', () => {
    test('place a spy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Cloaker', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Cloaker')
      const request3 = t.choose(game, 'Place a spy')
      const request4 = t.choose(game, 'Chasmleap Bridge')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Cloaker'],
        },
        'Chasmleap Bridge': {
          spies: ['dennis'],
        },
      })
    })

    test('return a spy (no valid target)', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Cloaker', 'House Guard'],
        },
        Menzoberranzan: {
          troops: [],
          spies: ['dennis']
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Cloaker')
      const request3 = t.choose(game, "Return one of your spies > Assassinate a troop at that spy's site")
      const request4 = t.choose(game, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Cloaker'],
        },
        Menzoberranzan: {
          troops: [],
          spies: [],
        },
        'araum-ched': {
          troops: ['neutral']
        },
      })
    })

    test('return a spy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Cloaker', 'House Guard'],
        },
        Menzoberranzan: {
          troops: ['neutral', 'neutral', 'dennis'],
          spies: ['dennis']
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Cloaker')
      const request3 = t.choose(game, "Return one of your spies > Assassinate a troop at that spy's site")
      const request4 = t.choose(game, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Cloaker'],
          trophyHall: ['neutral'],
        },
        Menzoberranzan: {
          spies: [],
          troops: ['neutral', 'dennis'],
        },
      })
    })
  })

  describe('Cranium Rats', () => {
    test('do the things', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Cranium Rats', 'House Guard'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'House Guard', 'Ambassador'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Cranium Rats')
      const request3 = t.choose(game, 'ched-halls a')
      const request4 = t.choose(game, 'ched-halls b')
      const request5 = t.choose(game, 'House Guard')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Cranium Rats'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'Ambassador'],
          discard: ['House Guard'],
        },
        'ched-halls a': {
          troops: ['dennis'],
        },
        'ched-halls b': {
          troops: ['dennis'],
        },
      })
    })
  })

  describe('Death Tyrant', () => {
    test('assassinate and influence', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Death Tyrant', 'House Guard'],
        },
        Menzoberranzan: {
          troops: ['neutral', 'neutral', 'micah', 'neutral'],
          spies: ['dennis'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Death Tyrant')
      const request3 = t.choose(game, 'Menzoberranzan')
      const request4 = t.choose(game, 'neutral', 'neutral', 'micah')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Death Tyrant'],
          trophyHall: ['neutral', 'neutral', 'troop-micah'],
          influence: 3,
        },
        Menzoberranzan: {
          troops: ['neutral'],
          spies: ['dennis'],
        },
      })
    })
  })

  describe('Elder Brain', () => {
    test('promote and play', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Elder Brain', 'House Guard'],
          deck: ['House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Elder Brain')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Elder Brain'],
          innerCircle: ['House Guard'],
          power: 2,
        },
      })
    })

    test('promote when deck and discard are empty', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Elder Brain', 'House Guard'],
          deck: [],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Elder Brain')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Elder Brain'],
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
      const request2 = t.choose(game, 'Play Card.Gauth')
      const request3 = t.choose(game, '+2 influence')

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
      const request2 = t.choose(game, 'Play Card.Gauth')
      const request3 = t.choose(game, '*Draw a card. Choose one opponent with more than 3 cards to discard a card')
      const request4 = t.choose(game, 'House Guard')

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

  describe('Grimlock', () => {
    test('deploy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Grimlock', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Grimlock')
      const request3 = t.choose(game, 'ched-halls a')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Grimlock'],
        },
        'ched-halls a': {
          troops: ['dennis'],
        },
      })
    })

    test('discard-this', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Gauth'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'House Guard', 'Grimlock'],
          deck: ['Spellspinner', 'Spellspinner'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Gauth')
      const request3 = t.choose(game, '*Draw a card. Choose one opponent with more than 3 cards to discard a card')
      const request4 = t.choose(game, 'Grimlock')


      t.testBoard(game, {
        dennis: {
          hand: ['Soldier'],
          played: ['Gauth'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'House Guard', 'Spellspinner', 'Spellspinner'],
          discard: ['Grimlock'],
        },
      })
    })
  })

  describe('Intellect Devourer', () => {
    test('+3 influence', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Intellect Devourer', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Intellect Devourer')
      const request3 = t.choose(game, '+3 influence')


      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Intellect Devourer'],
          influence: 3
        },
      })
    })

    test('Return up to two troops or spies', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Intellect Devourer', 'House Guard'],
        },
        'Ched Nasad': {
          spies: ['micah']
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Intellect Devourer')
      const request3 = t.choose(game, 'Return up to two troops or spies')
      const request4 = t.choose(game, 'spy.Ched Nasad, micah')
      const request5 = t.choose(game, 'troop.araum-ched, neutral')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Intellect Devourer'],
        },
        'Ched Nasad': {
          troops: ['dennis'],
          spies: [],
        },
        'araum-ched': {
          troops: [],
        },
      })
    })
  })

  describe('Mindwitness', () => {
    test('assassinate and discard', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Mindwitness', 'House Guard'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'House Guard', 'Grimlock'],
        },
        'ched-halls a': {
          troops: ['micah'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Mindwitness')
      const request3 = t.choose(game, 'ched-halls a, micah')
      const request4 = t.choose(game, 'House Guard')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Mindwitness'],
          trophyHall: ['troop-micah'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'Grimlock'],
          discard: ['House Guard'],
        },
        'Ched Nasad': {
          troops: ['dennis'],
        },
      })

    })
  })

  describe('Neogi', () => {
    test('deploy and opponents discard', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Neogi'],
        },
        micah: {
          hand: ['House Guard', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Neogi')
      const request3 = t.choose(game, 'ched-halls a')
      const request4 = t.choose(game, 'ched-halls b')
      const request5 = t.choose(game, 'ched-llace a')
      const request6 = t.choose(game, 'ched-llace b')
      const request7 = t.choose(game, 'House Guard')

      t.testBoard(game, {
        dennis: {
          discard: ['Neogi'],
        },
        micah: {
          hand: ['House Guard'],
          discard: ['House Guard'],
        },
        'ched-halls a': {
          troops: ['dennis'],
        },
        'ched-halls b': {
          troops: ['dennis'],
        },
        'ched-llace a': {
          troops: ['dennis'],
        },
        'ched-llace b': {
          troops: ['dennis'],
        },
      })
    })
  })

  describe('Nothic', () => {
    test('place a spy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Nothic', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Nothic')
      const request3 = t.choose(game, 'Place a spy')
      const request4 = t.choose(game, 'Chasmleap Bridge')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Nothic'],
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
          hand: ['Nothic'],
          deck: ['House Guard'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'Spellspinner', 'Spellspinner'],
        },
        Menzoberranzan: {
          spies: ['dennis']
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Nothic')
      const request3 = t.choose(game, '*Return one of your spies > Draw a card. Each opponent with more than 3 cards must discard a card')
      const request4 = t.choose(game, 'Menzoberranzan')
      const request5 = t.choose(game, 'Spellspinner')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Nothic'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'Spellspinner'],
          discard: ['Spellspinner'],
        },
      })
    })
  })

  describe('Puppeteer', () => {
    test('+2 influence', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Puppeteer', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.House Guard')
      const request3 = t.choose(game, 'Play Card.Puppeteer')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Puppeteer', 'House Guard'],
          power: 2,
          influence: 2,
        },
      })
    })

    test('promote', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Puppeteer', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.House Guard')
      const request3 = t.choose(game, 'Play Card.Puppeteer')
      const request4 = t.choose(game, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Puppeteer'],
          innerCircle: ['House Guard'],
        },
      })
    })
  })

  describe('Quaggoth', () => {
    test('(basic) Assassinate one white troop for each site you control', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Quaggoth', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Quaggoth')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Quaggoth'],
          trophyHall: ['neutral'],
        },
        'araum-ched': {
          troops: []
        },
      })
    })

    test('(more) Assassinate one white troop for each site you control', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Quaggoth', 'House Guard'],
        },
        'Chasmleap Bridge': {
          troops: ['dennis'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Quaggoth')
      const request3 = t.choose(game, 'araum-chasm, neutral')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Quaggoth'],
          trophyHall: ['neutral', 'neutral'],
        },
        'araum-chasm': {
          troops: []
        },
        'araum-ched': {
          troops: []
        },
      })
    })
  })

  describe('Spectator', () => {
    test('influence and power', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Spectator', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Spectator')
      const request3 = t.choose(game, '+2 power and +1 influence')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Spectator'],
          power: 2,
          influence: 1,
        },
      })
    })
  })

  describe('Ulitharid', () => {
    test('play and then devour a card from the market', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Ulitharid', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Ulitharid')
      const request3 = t.choose(game, 'Spellspinner')
      const request4 = t.choose(game, 'Place a spy')
      const request5 = t.choose(game, 'Chasmleap Bridge')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Ulitharid'],
        },
        devoured: ['Spellspinner'],
        'Chasmleap Bridge': {
          spies: ['dennis'],
        },
      })

      expect(game.zones.byId('market').cardlist().length).toBe(6)
    })
  })

  describe('Umber Hulk', () => {
    test('deploy 3 troops', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Umber Hulk', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Umber Hulk')
      const request3 = t.choose(game, 'ched-halls a')
      const request4 = t.choose(game, 'ched-halls b')
      const request5 = t.choose(game, 'ched-llace a')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Umber Hulk'],
        },
        'ched-halls a': {
          troops: ['dennis'],
        },
        'ched-halls b': {
          troops: ['dennis'],
        },
        'ched-llace a': {
          troops: ['dennis'],
        },
      })
    })

    test('discard-this', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Gauth', 'House Guard'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'House Guard', 'Umber Hulk'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, 'Play Card.Gauth')
      const request3 = t.choose(game, '*Draw a card. Choose one opponent with more than 3 cards to discard a card')
      const request4 = t.choose(game, 'Umber Hulk')
      const request5 = t.choose(game, 'Play Card.House Guard')
      const request6 = t.choose(game, 'Play Card.Soldier')
      const request7 = t.choose(game, 'Pass')

      t.testBoard(game, {
        dennis: {
          hand: ['Noble', 'Noble', 'Soldier', 'Soldier'],
          discard: ['Gauth', 'House Guard', 'Soldier'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'House Guard', 'Soldier'],
          discard: ['Umber Hulk'],
        },
      })
    })
  })
})
