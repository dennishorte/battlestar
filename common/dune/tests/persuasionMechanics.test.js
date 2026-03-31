const t = require('../testutil')

describe('Persuasion Mechanics', () => {

  test('persuasion is lost at end of reveal turn (not stored)', () => {
    const game = t.fixture()
    game.run()

    // Both players reveal — dennis accumulates persuasion from cards
    t.choose(game, 'Agent Turn.Dagger')
    t.choose(game, 'Assembly Hall')

    t.choose(game, 'Reveal Turn') // micah
    t.choose(game, 'Pass')        // micah acquire

    t.choose(game, 'Reveal Turn') // dennis
    // Dennis should have persuasion from revealed cards
    // Pass on acquiring — persuasion is lost
    t.choose(game, 'Pass')

    const dennis = game.players.byName('dennis')
    // After reveal turn cleanup, persuasion should be 0
    expect(dennis.getCounter('persuasion')).toBe(0)
  })

  test('acquire phase loops until player passes', () => {
    const game = t.fixture()
    game.run()

    // Dennis reveals all 5 cards — gains persuasion
    t.choose(game, 'Reveal Turn') // dennis

    // Should be in acquire phase — Pass is available
    const choices = t.currentChoices(game)
    expect(choices).toContain('Pass')

    // Acquire a card
    const affordable = choices.filter(c => c !== 'Pass')
    expect(affordable.length).toBeGreaterThan(0)
    t.choose(game, affordable[0])

    // Should still be in acquire phase (Pass available again)
    const choices2 = t.currentChoices(game)
    expect(choices2).toContain('Pass')
    t.choose(game, 'Pass')
  })
})
