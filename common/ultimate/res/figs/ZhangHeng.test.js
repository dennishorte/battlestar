Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Zhang Heng', () => {
  test('karma: owner claims achievement, draws and tucks {3}, scores all other cards in that color', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Zhang Heng', 'Mathematics', 'Tools'], // Mathematics and Tools will be scored
        red: ['Archery', 'Oars'], // 2 red cards already
        yellow: ['Masonry'],
        hand: ['Engineering', 'The Wheel', 'Fermenting'], // Cards with {k} to meld
      },
      decks: {
        base: {
          3: ['Translation'], // Will be drawn and tucked to blue pile
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Masonry')
    request = t.choose(game, request, 'Engineering', 'The Wheel', 'Fermenting') // Meld 3 cards with {k}
    request = t.choose(game, request, 'auto') // Auto-order melds
    request = t.choose(game, request, 'auto') // Auto-order scores

    // Masonry's second effect claims Monument (3 red cards on board: Engineering, Archery, Oars)
    // Zhang Heng's karma: draws and tucks Translation (age 3) to blue pile
    // Then scores all other cards in blue pile (Zhang Heng, Mathematics, Tools) to dennis
    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Translation'], // Only Translation remains (tucked at end)
        red: ['Engineering', 'Archery', 'Oars'], // Meld puts cards at front
        yellow: ['Fermenting', 'Masonry'],
        green: ['The Wheel'],
        achievements: ['Monument'],
        score: ['Zhang Heng', 'Mathematics', 'Tools'], // All other blue cards scored
      },
    })
  })

  test('karma: opponent claims achievement, owner draws and tucks {3}, scores all other cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Zhang Heng', 'Mathematics', 'Tools'], // Owner of Zhang Heng
        red: ['Archery'],
        hand: ['Mysticism'], // A card for dennis to meld to end his turn
      },
      micah: {
        red: ['Oars', 'Road Building'], // 2 red cards already
        yellow: ['Masonry'],
        hand: ['Engineering', 'The Wheel', 'Fermenting'], // Cards with {k} to meld
      },
      decks: {
        base: {
          3: ['Translation'], // Will be drawn and tucked to dennis's blue pile
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Mysticism') // Micah activates Masonry on her board
    request = t.choose(game, request, 'Dogma.Masonry') // Micah activates Masonry on her board
    request = t.choose(game, request, 'Engineering', 'The Wheel', 'Fermenting') // Meld 3 cards with {k}
    request = t.choose(game, request, 'auto') // Auto-order melds
    request = t.choose(game, request, 'auto') // Auto-order scores

    // Micah claims Monument via Masonry (3 red cards: Engineering, Oars, Road Building)
    // Zhang Heng's karma (owned by dennis): draws and tucks Translation to dennis's blue pile
    // Then scores all other cards in blue pile (Zhang Heng, Mathematics, Tools) to micah (the player claiming)
    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        blue: ['Translation'], // Only Translation remains
        purple: ['Mysticism'],
      },
      micah: {
        red: ['Engineering', 'Oars', 'Road Building'], // Meld puts cards at front
        yellow: ['Fermenting', 'Masonry'],
        green: ['The Wheel'],
        achievements: ['Monument'],
        score: ['Zhang Heng', 'Mathematics', 'Tools'], // Scored to micah (player claiming)
      },
    })
  })
})
