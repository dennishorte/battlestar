Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Shelter', () => {
  test('dogma: demand - opponent scores card, has fewer cards in score pile, loses', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        yellow: ['Shelter'],
        score: ['Archery', 'Gunpowder', 'Construction'], // Leader has 3 cards in score pile
      },
      micah: {
        hand: ['Fire'], // One card to score
        score: ['Tools'], // Opponent has 1 card in score pile
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Shelter')
    // Demand effect: Micah must score a card from hand
    // Fire auto-selects if only one choice
    // After scoring: micah has 2 cards, dennis has 3 cards
    // Micah has fewer, so micah loses

    t.testGameOver(request, 'dennis', 'Shelter') // Dennis wins when Micah loses
  })


  test('dogma: demand - opponent scores card, has equal or more cards in score pile, no loss', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        yellow: ['Shelter'],
        score: ['Archery'], // Leader has 1 card in score pile
      },
      micah: {
        hand: ['Fire'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Shelter')
    // Demand effect: Micah must score a card from hand

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Shelter'],
        score: ['Archery'], // 1 card
      },
      micah: {
        score: ['Fire'], // 1 card; equal is safe
      },
    })
  })

  test('dogma: demand - opponent has no cards in hand, has fewer cards in score pile, loses', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        yellow: ['Shelter'],
        score: ['Archery', 'Gunpowder'], // Leader has 2 cards in score pile
      },
      micah: {
        hand: [], // No cards in hand
        score: ['Tools'], // Opponent has 1 card in score pile
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Shelter')
    // Demand effect: Micah has no cards in hand, so can't score
    // Micah has 1 card in score pile, dennis has 2 cards
    // Micah has fewer, so micah loses

    t.testGameOver(request, 'dennis', 'Shelter') // Dennis wins when Micah loses
  })

  test('dogma: demand - opponent scores one of multiple cards, has fewer cards, loses', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        yellow: ['Shelter'],
        score: ['Archery', 'Gunpowder', 'Construction'], // Leader has 3 cards in score pile
      },
      micah: {
        hand: ['Fire', 'Stone Knives'], // Two cards to choose from
        score: ['Tools'], // Opponent has 1 card in score pile
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Shelter')
    // Demand effect: Micah must score a card from hand
    request = t.choose(game, request, 'Fire') // Choose Fire to score
    // After scoring: micah has 2 cards, dennis has 3 cards
    // Micah has fewer, so micah loses

    t.testGameOver(request, 'dennis', 'Shelter') // Dennis wins when Micah loses
  })
})
