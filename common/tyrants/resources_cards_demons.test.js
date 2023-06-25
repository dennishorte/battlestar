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

  describe('Derro', () => {
    test('supplant', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Derro', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Derro')
      const request3 = t.choose(game, request2, 'Menzoberranzan, neutral')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Derro'],
          discard: ['Insane Outcast'],
          trophyHall: ['neutral'],
        },
        Menzoberranzan: {
          troops: ['neutral', 'neutral', 'dennis'],
        },
      })
    })
  })

  describe('Ettin', () => {
    test('deploy', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Ettin', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Ettin')
      const request3 = t.choose(game, request2, 'Deploy 3 troops')
      const request4 = t.choose(game, request3, 'ched-llace a')
      const request5 = t.choose(game, request4, 'ched-llace b')
      const request6 = t.choose(game, request5, 'Llacerellyn')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Ettin'],
        },
        'ched-llace a': {
          troops: ['dennis'],
        },
        'ched-llace b': {
          troops: ['dennis'],
        },
        'Llacerellyn': {
          troops: ['dennis'],
        },
      })
    })

    test('assassinate', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Ettin', 'House Guard'],
        },
        'erynd-llace': {
          troops: ['dennis'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Ettin')
      const request3 = t.choose(game, request2, 'Assassinate 2 white troops')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Ettin'],
          trophyHall: ['neutral'],
        },
        'erynd-llace': {
          troops: ['dennis'],
        },
        'araum-ched': {
          troops: []
        },
      })
    })
  })

  describe('Balor', () => {
    test('activate', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Balor', 'House Guard', 'Priestess of Lolth'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Balor')
      const request3 = t.choose(game, request2, 'Priestess of Lolth')
      const request4 = t.choose(game, request3, 'Menzoberranzan, neutral')
      const request5 = t.choose(game, request4, 'ched-llace a')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Balor'],
          trophyHall: ['neutral'],
        },
        devoured: ['Priestess of Lolth'],
        Menzoberranzan: {
          troops: ['neutral', 'neutral', 'dennis']
        },
        'ched-llace a': {
          troops: ['neutral'],
        },
      })
    })
  })

  describe('Demogorgon', () => {
    test('activate', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Demogorgon', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Demogorgon')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Demogorgon'],
        },
      })
    })
  })

  describe('Night Hag', () => {
    test('activate', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Night Hag', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Night Hag')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Night Hag'],
        },
      })
    })
  })

  describe('Jackalwere', () => {
    test('activate', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Jackalwere', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Jackalwere')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Jackalwere'],
        },
      })
    })
  })

  describe('Succubus', () => {
    test('activate', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Succubus', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Succubus')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Succubus'],
        },
      })
    })
  })

  describe('Vrock', () => {
    test('activate', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Vrock', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Vrock')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Vrock'],
        },
      })
    })
  })

  describe("Graz'zt", () => {
    test('activate', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ["Graz'zt", 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, "Play Card.Graz'zt")

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ["Graz'zt"],
        },
      })
    })
  })

  describe('Myconid Adult', () => {
    test('activate', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Myconid Adult', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Myconid Adult')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Myconid Adult'],
        },
      })
    })
  })

  describe('Nalfeshnee', () => {
    test('activate', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Nalfeshnee', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Nalfeshnee')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Nalfeshnee'],
        },
      })
    })
  })

  describe('Hezrou', () => {
    test('activate', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Hezrou', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Hezrou')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Hezrou'],
        },
      })
    })
  })

  describe('Myconid Sovereign', () => {
    test('activate', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Myconid Sovereign', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Myconid Sovereign')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Myconid Sovereign'],
        },
      })
    })
  })

  describe('Zuggtmoy', () => {
    test('activate', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'demons'],
        dennis: {
          hand: ['Zuggtmoy', 'House Guard'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Zuggtmoy')

      t.testBoard(game, {
        dennis: {
          hand: ['House Guard'],
          played: ['Zuggtmoy'],
        },
      })
    })
  })

})
