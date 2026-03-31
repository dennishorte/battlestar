const t = require('../testutil')

describe('CHOAM Contract Types', () => {

  test('contract data includes immediate, harvest, and board-space types', () => {
    const contracts = require('../res/cards/contracts.js')
    const names = contracts.map(c => c.name)

    // Should have immediate contracts
    const hasImmediate = names.some(n => n === 'Immediate')
    expect(hasImmediate).toBe(true)

    // Should have harvest contracts
    const hasHarvest = names.some(n => n.includes('Harvest'))
    expect(hasHarvest).toBe(true)

    // Should have acquire-TSMF contract
    const hasTSMF = names.some(n => n.includes('Spice Must Flow'))
    expect(hasTSMF).toBe(true)
  })

  test('harvest contract completes when gaining enough spice at maker space', () => {
    const game = t.fixture({ useCHOAM: true })
    t.setBoard(game, {
      dennis: { contracts: ['Harvest 3+ Spice'], water: 1 },
      bonusSpice: { 'imperial-basin': 2 },
    })
    game.run()

    // Dennis sends agent to Imperial Basin (maker space) to harvest spice
    // Base harvest is 1, plus 2 bonus = 3 spice total -> triggers Harvest 3+
    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Imperial Basin')
    // Imperial Basin offers deployment
    const choices = t.currentChoices(game)
    if (choices.some(c => c.includes('Deploy'))) {
      t.choose(game, choices.find(c => c.includes('0')))
    }

    const completed = game.zones.byId('dennis.contractsCompleted')
    expect(completed.cardlist().length).toBe(1)
    expect(completed.cardlist()[0].name).toBe('Harvest 3+ Spice')
  })

  test('contract market refills after taking a contract', () => {
    const game = t.fixture({ useCHOAM: true })
    game.run()

    const market = game.zones.byId('common.contractMarket')
    expect(market.cardlist().length).toBe(2)

    // Take a contract via the Accept Contract space
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Micah visits Accept Contract
    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Accept Contract')

    // Choose a contract from market
    const choices = t.currentChoices(game)
    t.choose(game, choices[0])

    // Market should still have 2 contracts (refilled from deck)
    expect(market.cardlist().length).toBe(2)
  })
})
