Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Skinning', () => {
  test('dogma: score card with {r}, meld cards equal to {r} count', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        yellow: ['Skinning'],
        red: ['Fire'], // Fire has {r} biscuit (rsrh = 2 {r})
        hand: ['Tools', 'Curing'], // Two cards to meld
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Skinning')
    // Choose which card with {r} to score (Fire or Skinning)
    request = t.choose(game, request, 'Fire') // Choose Fire to score
    // Fire has 1 {r}, so meld 1 card from hand
    // Tools or Curing will be melded (auto-selects if count matches)
    // If a request is returned, handle it
    request = t.choose(game, request, 'Tools')


    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Skinning'],
        blue: ['Curing', 'Tools'],
        score: ['Fire'], // Fire scored
      },
    })
  })

  test('dogma: score card with {r}, no cards in hand to meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        yellow: ['Skinning'],
        red: ['Fire'], // Fire has {r} biscuit
        hand: [], // No cards in hand
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Skinning')
    // Choose which card with {r} to score (Fire or Skinning)
    request = t.choose(game, request, 'Fire') // Choose Fire to score
    // Fire has {r}, try to meld cards, but hand is empty

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Skinning'],
        score: ['Fire'], // Fire scored
        hand: [], // No cards to meld
      },
    })
  })

  test('dogma: score card with {r}, choose which cards to meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        yellow: ['Skinning'],
        red: ['Fire'], // Fire has 1 {r} biscuit
        hand: ['Tools', 'Curing', 'Mathematics'], // Three cards in hand
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Skinning')
    // Choose which card with {r} to score (Fire or Skinning)
    request = t.choose(game, request, 'Fire') // Choose Fire to score
    // Fire has 1 {r}, so meld 1 card from hand
    // Tools, Curing, or Mathematics will be melded (auto-selects or player chooses)
    // If a request is returned, handle it
    request = t.choose(game, request, 'Curing', 'Mathematics')
    request = t.choose(game, request, 'Curing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Skinning'],
        blue: ['Mathematics', 'Curing'],
        score: ['Fire'], // Fire scored
        hand: ['Tools'],
      },
    })
  })
})
