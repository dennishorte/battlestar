Error.stackTraceLimit = 100

const GameFixtureFactory = require('../test/fixture.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

function _deepLog(obj) {
  console.log(JSON.stringify(obj, null, 2))
}

function _oncePerGameFixture(characterName, setupFunc) {
  const factory = new GameFixtureFactory()
  factory.options.players[0].character = characterName
  const game = factory.build().advanceTo('player-turn-action').game
  if (setupFunc) {
    setupFunc(game)
  }
  game.run()

  const character = game.getCardCharacterByPlayer('dennis')
  game.submit({
    actor: 'dennis',
    name: 'Action',
    option: [{
      name: 'Once Per Game Action',
      option: [character.oncePerGameAbility.split(' - ')[0]]
    }]
  })
  return game
}

describe('once per game actions', () => {
  test("each player can only use one once per game action", () => {

  })

  describe("Gaius Baltar", () => {
    test('choose player', () => {
      const game = _oncePerGameFixture('Gaius Baltar')
      const action = game.getWaiting('dennis')
      expect(action).toBeDefined()
      expect(action.name).toBe('Cylon Detector')
      expect(action.options.sort()).toStrictEqual(['micah', 'tom'])
    })

    test('view ALL loyalty cards', () => {
      const game = _oncePerGameFixture('Gaius Baltar', game => {
        jest.spyOn(game, 'aRevealLoyaltyCards')
      })
      game.submit({
        actor: 'dennis',
        name: 'Cylon Detector',
        option: ['micah']
      })
      expect(game.aRevealLoyaltyCards.mock.calls.length).toBe(1)
      expect(game.aRevealLoyaltyCards.mock.calls[0][2]).toBeGreaterThan(5)
    })

    test('once per game marked as used', () => {
      const game = _oncePerGameFixture('Gaius Baltar')
      expect(game.checkPlayerOncePerGameUsed('dennis')).toBe(true)
    })
  })

  describe("Laura Roslin", () => {

  })

  describe('Lee "Apollo" Adama', () => {

  })

  describe("Saul Tigh", () => {

  })

  describe("Tom Zarek", () => {

  })
})
