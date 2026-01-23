Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Greta Thunberg', () => {
  test('karma: dogma card, junk card with f, no win (other cards with f remain)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Greta Thunberg'], // Greta Thunberg on top (karma active)
        red: ['Robotics'], // Robotics has 'f' biscuit (hfpf) - being dogmatized
        green: ['Corporations'], // Corporations has 'f' biscuit - will be junked by karma
      },
      decks: {
        base: {
          10: ['A.I.', 'Software'], // Cards drawn by Robotics' dogma effect
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Robotics')
    // Karma triggers: first junk another top card with 'f' from any board
    // Robotics is being dogmatized, so we can't junk it
    // Corporations is auto-selected (only valid choice)
    // After junking, Robotics still has 'f', so no win
    // Robotics' dogma effects execute: score top green (none, Corporations was junked), then draw and meld A.I. (has 'i', so self-executes), which draws and scores Software

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Greta Thunberg'],
        red: ['Robotics'], // Robotics remains (has 'f')
        green: [], // Corporations was junked by karma before Robotics' dogma could score it
        purple: ['A.I.'], // A.I. drawn and melded by Robotics' second dogma effect (has 'i', so self-executed)
        score: ['Software'], // Software drawn and scored by A.I.'s self-execution
      },
    })
  })

  test('karma: dogma card without f, junk last card with f, owner wins', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Greta Thunberg'], // Greta Thunberg on top (karma active, owner is dennis)
        red: ['Archery'], // Archery does not have 'f' biscuit - being dogmatized
        green: ['Corporations'], // Corporations has 'f' biscuit - only card with 'f'
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Archery')
    // Karma triggers: first junk another top card with 'f' from any board
    // Owner (dennis) chooses to junk Corporations from dennis's board
    // Corporations is auto-selected (only valid choice)
    // After junking, there are no top cards with 'f' anywhere, so owner (dennis) wins

    t.testGameOver(request, 'dennis', 'Greta Thunberg')
    t.testBoard(game, {
      dennis: {
        yellow: ['Greta Thunberg'],
        red: ['Archery'], // Archery remains
        green: [], // Corporations was junked
      },
    })
  })

  test('karma: dogma card, no cards with f available to junk', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Greta Thunberg'], // Greta Thunberg on top (karma active, owner is dennis)
        red: ['Archery'], // Archery does not have 'f' biscuit
      },
      micah: {
        green: ['Sailing'], // Sailing does not have 'f' biscuit
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Archery')
    // Karma triggers: first junk another top card with 'f' from any board
    // No cards with 'f' available (excluding Archery which doesn't have 'f' anyway)
    // chooseAndJunk is called with empty array, returns immediately (no request)
    // Check: no top cards with 'f' anywhere, so owner (dennis) wins
    // The game should be over at this point

    t.testGameOver(request, 'dennis', 'Greta Thunberg')
    t.testBoard(game, {
      dennis: {
        yellow: ['Greta Thunberg'],
        red: ['Archery'], // Archery remains
      },
      micah: {
        green: ['Sailing'], // Sailing remains
      },
    })
  })

  test('karma: dogma card with f, junk different card with f, no win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Greta Thunberg'], // Greta Thunberg on top (karma active)
        red: ['Robotics', 'Machine Tools'], // Robotics has 'f' biscuit (hfpf) - being dogmatized, Machine Tools has 'f' (ffhf)
        green: ['Corporations'], // Corporations has 'f' biscuit - will be junked by karma, then Robotics tries to score it but it's gone
      },
      decks: {
        base: {
          10: ['A.I.', 'Software'], // Cards drawn by Robotics' dogma effect
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Robotics')
    // Karma triggers: first junk another top card with 'f' from any board
    // Robotics is being dogmatized, so we can't junk it
    // Owner (dennis) chooses to junk Corporations from dennis's board
    // Corporations is auto-selected (only one choice available after filtering)
    // After junking, Robotics and Machine Tools still have 'f', so no win

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Greta Thunberg'],
        red: ['Robotics', 'Machine Tools'], // Robotics on top (has 'f'), Machine Tools below (has 'f')
        green: [], // Corporations was junked by karma before Robotics' dogma could score it
        purple: ['A.I.'], // A.I. drawn and meld by Robotics' second dogma effect (has 'i', so self-executed)
        score: ['Software'], // Software drawn and scored by A.I.'s self-execution
      },
    })
  })

  test('karma: triggerAll - opponent dogmas, owner effect applies', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 2 })
    t.setBoard(game, {
      dennis: {
        red: ['Archery'], // Archery does not have 'f' biscuit - being dogmatized
      },
      micah: {
        yellow: ['Greta Thunberg'], // Greta Thunberg on top (karma active, owner is micah)
        green: ['Corporations'], // Corporations has 'f' biscuit
      },
    })

    let request
    request = game.run()
    // dennis is first player
    request = t.choose(game, 'Dogma.Archery')
    // Karma triggers (triggerAll: true) - dennis dogmas, but micah's karma triggers
    // First junk another top card with 'f' from any board
    // Archery is being dogmatized but doesn't have 'f', so Corporations is available
    // Owner (micah) chooses to junk Corporations from micah's board
    // Corporations is auto-selected (only valid choice)
    // After junking, there are no top cards with 'f', so micah (owner) wins

    t.testGameOver(request, 'micah', 'Greta Thunberg')
    t.testBoard(game, {
      dennis: {
        red: ['Archery'], // Archery remains
      },
      micah: {
        yellow: ['Greta Thunberg'],
        green: [], // Corporations was junked
      },
    })
  })
})
