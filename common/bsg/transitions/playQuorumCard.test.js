Error.stackTraceLimit = 100

const GameFixtureFactory = require('../test/fixture.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

function _deepLog(obj) {
  console.log(JSON.stringify(obj, null, 2))
}


function _quorumFixture(cardName) {
  const factory = new GameFixtureFactory()
  const game = factory.build().advanceTo('player-turn-action').game
  const player = game.getPlayerCurrentTurn()
  util.assert(
    game.checkPlayerIsPresident(player),
    'Player is not President, so cannot use quorum cards'
  )
  const { card, zoneName } = game.getCardByPredicate(c => c.name === cardName)
  game.mMoveCard(zoneName, game.getZoneByPlayer(player), card)
  game.run()
  game.submit({
    actor: player.name,
    name: 'Action',
    option: [{
      name: 'Quorum Card',
      option: [card.id]
    }]
  })
  return game
}


describe('quorum actions', () => {

  describe("Accept Prophecy", () => {
    test('player draws a skill card', () => {
      const game = _quorumFixture('Accept Prophecy')
      expect(game.getTransition().name).toBe('draw-skill-cards')
      expect(game.getWaiting('dennis')).toBeDefined()
    })

    test('card long-term effect becomes active', () => {
      const game = _quorumFixture('Accept Prophecy')
      expect(game.checkEffect('Accept Prophecy')).toBe(true)
    })

    test('card affects administration action', () => {
      // Tested in Administration
    })

    test('card affects admirals quarters action', () => {
      // Tested in Admiral's Quarters
    })
  })

  describe("Arrest Order", () => {
    test('president chooses a player to move to brig', () => {
      const game = _quorumFixture('Arrest Order')
      game.submit({
        actor: 'dennis',
        name: 'Arrest Order',
        option: ['tom']
      })
      expect(game.getZoneByPlayerLocation('tom').details.name).toBe('Brig')
    })

    test('president cannot choose self', () => {
      const game = _quorumFixture('Arrest Order')
      const action = game.getWaiting('dennis').actions[0]
      expect(action.options.includes('dennis')).toBe(false)
    })
  })

  describe("Assign Arbitrator", () => {
    test('president draws two politics cards', () => {
      const game = _quorumFixture('Assign Arbitrator')
      const skillCards = game.getCardsKindByPlayer('skill', 'dennis')
      const politicsCards = skillCards.filter(c => c.skill === 'politics')
      expect(politicsCards.length).toBe(4)
    })

    test('president chooses arbitrator', () => {
      const game = _quorumFixture('Assign Arbitrator')
      game.submit({
        actor: 'dennis',
        name: 'Assign Arbitrator',
        option: ['micah'],
      })
      expect(game.checkPlayerIsArbitrator('micah')).toBe(true)
    })

    test('arbitrator can affect pass value of admirals quarters', () => {
      // tested in Admiral's Quarters action
    })

    test('arbitrator effect only works one time', () => {
      // tested in Admiral's Quarters action
    })
  })

  describe("Assign Mission Specialist", () => {
    test('president draws two politics cards', () => {
      const game = _quorumFixture('Assign Mission Specialist')
      const skillCards = game.getCardsKindByPlayer('skill', 'dennis')
      const politicsCards = skillCards.filter(c => c.skill === 'politics')
      expect(politicsCards.length).toBe(4)
    })

    test('president chooses mission specialist', () => {
      const game = _quorumFixture('Assign Mission Specialist')
      game.submit({
        actor: 'dennis',
        name: 'Assign Mission Specialist',
        option: ['micah'],
      })
      expect(game.checkPlayerIsMissionSpecialist('micah')).toBe(true)
    })

    test('mission specialist chooses the destination on the next jump', () => {
      // Tested in jump-choose-destination
    })

    test('mission specialist effect works only one time', () => {
      // Tested in jump-choose-destination
    })
  })

  describe.skip("Assign Vice President", () => {

  })

  describe.skip("Authorization of Brutal Force", () => {

  })

  describe.skip("Encourage Mutiny", () => {

  })

  describe.skip("Food Rationing", () => {

  })

  describe.skip("Inspirational Speech", () => {

  })

  describe.skip("Presidential Pardon", () => {

  })

  describe.skip("Release Cylon Mugshots", () => {

  })
})
