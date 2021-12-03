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

  describe.skip("Arrest Order", () => {

  })

  describe.skip("Assign Arbitrator", () => {

  })

  describe.skip("Assign Mission Specialist", () => {

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
