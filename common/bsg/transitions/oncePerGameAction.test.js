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
    test('draws four quorum cards', () => {
      const game = _oncePerGameFixture('Laura Roslin')
      const quorumCards = game.getCardsKindByPlayer('quorum', 'dennis')
      // One starting card, plus 4
      expect(quorumCards.length).toBe(5)
    })

    test('can only choose from among drawn cards', () => {
      const game = _oncePerGameFixture('Laura Roslin')
      const quorumCards = game.getCardsKindByPlayer('quorum', 'dennis')
      quorumCards.shift()
      const quorumOptions = quorumCards.map(c => c.id).sort()
      const action = game.getWaiting('dennis')
      expect(action.name).toBe('Skilled Politician')
      expect(action.options.sort()).toStrictEqual(quorumOptions)
    })

    test('unused cards are put on the bottom of the deck', () => {
      const game = _oncePerGameFixture('Laura Roslin')
      const quorumCards = game.getCardsKindByPlayer('quorum', 'dennis')
      quorumCards.shift()
      const quorumOptions = quorumCards.map(c => c.id).sort()
      game.submit({
        actor: 'dennis',
        name: 'Skilled Politician',
        option: [quorumOptions[2]]
      })

      const quorumZone = game.getZoneByName('decks.quorum')
      for (const i of [0, 1, 3]) {
        const cardId = quorumOptions[i]
        // 17 card deck. Two in hand. Indices should be 12, 13, 14
        expect(quorumZone.cards.findIndex(c => c.id === cardId)).toBeGreaterThan(11)
      }
    })

    test.skip('selected card is executed', () => {
      const game = _oncePerGameFixture('Laura Roslin')
      const quorumCards = game.getCardsKindByPlayer('quorum', 'dennis')
      quorumCards.shift()
      const quorumOptions = quorumCards.map(c => c.id).sort()
      game.submit({
        actor: 'dennis',
        name: 'Skilled Politician',
        option: [quorumOptions[2]]
      })
      // Not sure how to test this
    })

    test('once per game marked as used', () => {
      const game = _oncePerGameFixture('Laura Roslin')
      expect(game.checkPlayerOncePerGameUsed('dennis')).toBe(true)
    })
  })

  describe('Lee "Apollo" Adama', () => {
    test('executes lee-apollo-cag transition', () => {
      const game = _oncePerGameFixture('Lee "Apollo" Adama')
      expect(game.getTransition().name).toBe('lee-apollo-cag')
    })

    test('can choose a viper to activate', () => {
      const game = _oncePerGameFixture('Lee "Apollo" Adama')
      const action = game.getWaiting('dennis')
      expect(action.name).toBe('Select Viper to Activate')
      expect(action.options.length).toBe(2)
    })

    test('if all vipers in same zone, auto-selects', () => {
      const game = _oncePerGameFixture('Lee "Apollo" Adama', game => {
        game.aClearSpace()
        game.aDeployShips([
          [], [], [],
          [], [], ['viper', 'viper', 'raider']
        ])
      })
      const action = game.getWaiting('dennis')
      expect(action.name).toBe('Activate Selected Viper')
    })

    test('can choose what to do with that viper', () => {
      const game = _oncePerGameFixture('Lee "Apollo" Adama', game => {
        game.aClearSpace()
        game.aDeployShips([
          [], [], [],
          [], [], ['viper', 'viper', 'raider']
        ])
      })
      const action = game.getWaiting('dennis')
      expect(action.name).toBe('Activate Selected Viper')
      expect(action.options.map(o => o.name).sort())
        .toStrictEqual(['Attack with Viper', 'Move Viper'])
    })

    test('move action executes', () => {
      const game = _oncePerGameFixture('Lee "Apollo" Adama', game => {
        game.aClearSpace()
        game.aDeployShips([
          [], [], [],
          [], [], ['viper', 'raider']
        ])
      })
      game.submit({
        actor: 'dennis',
        name: 'Activate Selected Viper',
        option: [{
          name: 'Move Viper',
          option: ['clockwise']
        }]
      })
      expect(game.getZoneSpaceByIndex(0).cards.length).toBe(1)
      expect(game.getZoneSpaceByIndex(0).cards[0].name).toBe('viper')
      expect(game.getZoneSpaceByIndex(5).cards.length).toBe(1)
      expect(game.getZoneSpaceByIndex(5).cards[0].name).toBe('raider')
    })

    test('attack action executes', () => {
      const game = _oncePerGameFixture('Lee "Apollo" Adama', game => {
        game.aClearSpace()
        game.aDeployShips([
          [], [], [],
          [], [], ['viper', 'raider']
        ])
        jest.spyOn(game, 'aAttackCylonWithViperByKind')
      })
      game.submit({
        actor: 'dennis',
        name: 'Activate Selected Viper',
        option: [{
          name: 'Attack with Viper',
          option: ['raider']
        }]
      })
      expect(game.aAttackCylonWithViperByKind.mock.calls.length).toBe(1)
      expect(game.aAttackCylonWithViperByKind.mock.calls[0][2]).toBe('raider')
    })

    test('once per game marked as used', () => {
      const game = _oncePerGameFixture('Lee "Apollo" Adama')
      expect(game.checkPlayerOncePerGameUsed('dennis')).toBe(true)
    })
  })

  describe("Saul Tigh", () => {
    test('moves the president title to the admiral', () => {
      const game = _oncePerGameFixture('Saul Tigh')
      expect(game.getPlayerAdmiral().name).toBe('dennis')
      expect(game.getPlayerPresident().name).toBe('dennis')
    })

    test('once per game marked as used', () => {
      const game = _oncePerGameFixture('Saul Tigh')
      expect(game.checkPlayerOncePerGameUsed('dennis')).toBe(true)
    })
  })

  describe("Tom Zarek", () => {
    test('can choose which resource to increase', () => {
      const game = _oncePerGameFixture('Tom Zarek')
      const action = game.getWaiting('dennis')
      expect(action.name).toBe('Unconventional Tactics')
      expect(action.options.sort()).toStrictEqual(['food', 'fuel', 'morale'])
    })

    test('population goes down', () => {
      const game = _oncePerGameFixture('Tom Zarek')
      game.submit({
        actor: 'dennis',
        name: 'Unconventional Tactics',
        option: ['food']
      })
      expect(game.getCounterByName('population')).toBe(11)
    })

    test('chosen resource is increased', () => {
      const game = _oncePerGameFixture('Tom Zarek')
      game.submit({
        actor: 'dennis',
        name: 'Unconventional Tactics',
        option: ['food']
      })
      expect(game.getCounterByName('food')).toBe(9)
    })

    test('once per game marked as used', () => {
      const game = _oncePerGameFixture('Tom Zarek')
      expect(game.checkPlayerOncePerGameUsed('dennis')).toBe(true)
    })
  })
})
