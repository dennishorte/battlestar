const t = require('../testutil')

// Advance every player through their turn (Reveal Turn → Pass on acquire/plot)
// without spending persuasion.
function revealAllAndPass(game) {
  const playerCount = game.players.all().length
  for (let i = 0; i < playerCount; i++) {
    t.choose(game, 'Reveal Turn')
    while (game.waiting) {
      const title = game.waiting.selectors[0]?.title || ''
      if (title.includes('Acquire') || title.includes('Plot')) {
        t.choose(game, 'Pass')
      }
      else {
        break
      }
    }
  }
}

describe('Imperium Row Refresh — Dice Variant', () => {

  test('row is refilled to 5 after recall', () => {
    const game = t.fixture({ imperiumRowRefresh: 'dice' })
    game.run()
    revealAllAndPass(game)
    t.testBoard(game, { round: 2 })
    const row = game.zones.byId('common.imperiumRow')
    expect(row.cardlist().length).toBe(5)
  })

  test('row is refilled to 5 across multiple rounds', () => {
    const game = t.fixture({ imperiumRowRefresh: 'dice' })
    game.run()
    revealAllAndPass(game)  // round 1
    revealAllAndPass(game)  // round 2
    t.testBoard(game, { round: 3 })
    const row = game.zones.byId('common.imperiumRow')
    expect(row.cardlist().length).toBe(5)
  })

  // Dice edge-case tests use setBoard({ diceValues: [d1, d2] }) to inject
  // specific roll values via the breakpoint system (survives replay).

  test('double-6 clears entire row (row refilled to 5 immediately)', () => {
    const game = t.fixture({ imperiumRowRefresh: 'dice' })
    t.setBoard(game, { diceValues: [6, 6] })
    game.run()

    const rowBefore = game.zones.byId('common.imperiumRow').cardlist().map(c => c.name)
    revealAllAndPass(game)

    const trash = game.zones.byId('common.trash').cardlist().map(c => c.name)
    for (const name of rowBefore) {
      expect(trash).toContain(name)
    }
    expect(game.zones.byId('common.imperiumRow').cardlist().length).toBe(5)
  })

  test('non-6 doubles remove only one card at that position', () => {
    const game = t.fixture({ imperiumRowRefresh: 'dice' })
    t.setBoard(game, { diceValues: [3, 3] })
    game.run()

    const rowBefore = game.zones.byId('common.imperiumRow').cardlist().map(c => c.name)
    const removedName = rowBefore[2]  // position 3 = index 2
    revealAllAndPass(game)

    const trash = game.zones.byId('common.trash').cardlist().map(c => c.name)
    expect(trash).toContain(removedName)
    const trashCount = trash.filter(n => n === removedName).length
    expect(trashCount).toBe(1)  // only one removal even though both dice showed 3
    expect(game.zones.byId('common.imperiumRow').cardlist().length).toBe(5)
  })

  test('two different non-6 dice remove two distinct cards', () => {
    const game = t.fixture({ imperiumRowRefresh: 'dice' })
    t.setBoard(game, { diceValues: [1, 3] })
    game.run()

    const rowBefore = game.zones.byId('common.imperiumRow').cardlist().map(c => c.name)
    const removed1 = rowBefore[0]  // position 1 = index 0
    const removed2 = rowBefore[2]  // position 3 = index 2
    revealAllAndPass(game)

    const trash = game.zones.byId('common.trash').cardlist().map(c => c.name)
    expect(trash).toContain(removed1)
    expect(trash).toContain(removed2)
    expect(game.zones.byId('common.imperiumRow').cardlist().length).toBe(5)
  })

  test('a 6 on one die removes only the non-6 position', () => {
    const game = t.fixture({ imperiumRowRefresh: 'dice' })
    t.setBoard(game, { diceValues: [6, 2] })
    game.run()

    const rowBefore = game.zones.byId('common.imperiumRow').cardlist().map(c => c.name)
    const removed = rowBefore[1]  // position 2 = index 1; die1=6 is ignored
    revealAllAndPass(game)

    const trash = game.zones.byId('common.trash').cardlist().map(c => c.name)
    expect(trash).toContain(removed)
    expect(trash.length).toBe(1)
    expect(game.zones.byId('common.imperiumRow').cardlist().length).toBe(5)
  })

})


describe('Imperium Row Refresh — Nuke Variant', () => {

  test('each player starts with one nuke', () => {
    const game = t.fixture({ imperiumRowRefresh: 'nuke' })
    game.run()
    expect(game.state.nukesAvailable['dennis']).toBe(true)
    expect(game.state.nukesAvailable['scott']).toBe(true)
    expect(game.state.nukesAvailable['micah']).toBe(true)
  })

  test('no nukes in non-nuke mode', () => {
    const game = t.fixture({ imperiumRowRefresh: 'none' })
    game.run()
    expect(Object.keys(game.state.nukesAvailable).length).toBe(0)
  })

  test('nuke option appears in acquire phase', () => {
    const game = t.fixture({ imperiumRowRefresh: 'nuke', dennis: { persuasion: 3 } })
    game.run()

    // Dennis reveals to enter acquire phase
    t.choose(game, 'Reveal Turn')

    // Acquire phase — nuke option should be present
    const choices = t.currentChoices(game)
    expect(choices).toContain('Use Nuke')
    expect(choices).toContain('Pass')

    // Clean up
    t.choose(game, 'Pass')
  })

  test('using nuke clears and refills the row', () => {
    const game = t.fixture({ imperiumRowRefresh: 'nuke' })
    game.run()

    const rowBefore = game.zones.byId('common.imperiumRow').cardlist().map(c => c.name)

    // Dennis reveals
    t.choose(game, 'Reveal Turn')
    // Choose Use Nuke
    t.choose(game, 'Use Nuke')

    const trash = game.zones.byId('common.trash').cardlist().map(c => c.name)
    // All original row cards now in trash
    for (const name of rowBefore) {
      expect(trash).toContain(name)
    }
    // Row refilled to 5
    const rowAfter = game.zones.byId('common.imperiumRow').cardlist()
    expect(rowAfter.length).toBe(5)
    // Row cards are different from before
    const newNames = rowAfter.map(c => c.name)
    expect(newNames).not.toEqual(rowBefore)

    t.choose(game, 'Pass')  // pass acquisition
  })

  test('nuke is consumed after use', () => {
    const game = t.fixture({ imperiumRowRefresh: 'nuke' })
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Use Nuke')
    t.choose(game, 'Pass')  // pass acquisition after nuke

    expect(game.state.nukesAvailable['dennis']).toBe(false)
  })

  test('nuke option absent after it has been used', () => {
    const game = t.fixture({ imperiumRowRefresh: 'nuke' })
    game.run()

    // Round 1: Dennis (first player) uses nuke; scott and micah pass
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Use Nuke')
    t.choose(game, 'Pass')
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Round 2: first player advances to scott, then micah, then dennis
    t.choose(game, 'Reveal Turn')   // scott — still has his nuke, skip
    t.choose(game, 'Pass')
    t.choose(game, 'Reveal Turn')   // micah — still has his nuke, skip
    t.choose(game, 'Pass')
    t.choose(game, 'Reveal Turn')   // dennis — nuke should be gone
    const choices = t.currentChoices(game)
    expect(choices).not.toContain('Use Nuke')
    t.choose(game, 'Pass')
  })

  test('other players still have nukes after dennis uses his', () => {
    const game = t.fixture({ imperiumRowRefresh: 'nuke' })
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Use Nuke')
    t.choose(game, 'Pass')

    expect(game.state.nukesAvailable['dennis']).toBe(false)
    expect(game.state.nukesAvailable['scott']).toBe(true)
    expect(game.state.nukesAvailable['micah']).toBe(true)
  })

})


describe('Imperium Row Refresh — Conveyor Belt (Shift) Variant', () => {

  test('row is 5 cards at game start', () => {
    const game = t.fixture({ imperiumRowRefresh: 'shift' })
    game.run()
    const row = game.zones.byId('common.imperiumRow')
    expect(row.cardlist().length).toBe(5)
  })

  test('after round 1 recall, oldest card is removed and replaced', () => {
    const game = t.fixture({ imperiumRowRefresh: 'shift' })
    game.run()

    const rowBefore = game.zones.byId('common.imperiumRow').cardlist()
    const oldestCard = rowBefore[rowBefore.length - 1]  // tail = oldest
    const oldestName = oldestCard.name

    revealAllAndPass(game)  // complete round 1

    t.testBoard(game, { round: 2 })
    const trash = game.zones.byId('common.trash').cardlist()
    expect(trash.some(c => c.name === oldestName)).toBe(true)

    const rowAfter = game.zones.byId('common.imperiumRow').cardlist()
    expect(rowAfter.length).toBe(5)
    expect(rowAfter.some(c => c.name === oldestName)).toBe(false)
  })

  test('new card enters at the head of the row', () => {
    const game = t.fixture({ imperiumRowRefresh: 'shift' })
    game.run()

    // The first card in the deck after filling row will be added at head
    const deckBefore = game.zones.byId('common.imperiumDeck').cardlist()
    const nextCard = deckBefore[0]
    const nextCardName = nextCard.name

    revealAllAndPass(game)  // complete round 1

    const rowAfter = game.zones.byId('common.imperiumRow').cardlist()
    // The newly added card should be at position 0 (head)
    expect(rowAfter[0].name).toBe(nextCardName)
  })

  test('cards shift consistently over multiple rounds', () => {
    const game = t.fixture({ imperiumRowRefresh: 'shift' })
    game.run()

    const initialRow = game.zones.byId('common.imperiumRow').cardlist().map(c => c.name)

    revealAllAndPass(game)  // round 1 end: initialRow[4] falls off
    revealAllAndPass(game)  // round 2 end: initialRow[3] falls off

    const trash = game.zones.byId('common.trash').cardlist().map(c => c.name)
    expect(trash).toContain(initialRow[4])  // oldest after round 1
    expect(trash).toContain(initialRow[3])  // next oldest after round 2

    const rowAfter = game.zones.byId('common.imperiumRow').cardlist()
    expect(rowAfter.length).toBe(5)
    // The very oldest cards from initial row are gone
    expect(rowAfter.some(c => c.name === initialRow[4])).toBe(false)
    expect(rowAfter.some(c => c.name === initialRow[3])).toBe(false)
  })

  test('row stays at 5 even after round end', () => {
    const game = t.fixture({ imperiumRowRefresh: 'shift' })
    game.run()
    revealAllAndPass(game)
    revealAllAndPass(game)
    t.testBoard(game, { round: 3 })
    expect(game.zones.byId('common.imperiumRow').cardlist().length).toBe(5)
  })

})
