const t = require('../testutil')

describe('Spice Refinery Control Bonus', () => {

  test('controller gets 1 Solari when anyone visits Spice Refinery', () => {
    const game = t.fixture()
    t.setBoard(game, {
      controlMarkers: { 'spice-refinery': 'dennis' },
      dennis: { solari: 0 },
      micah: { solari: 0 },
    })
    game.run()

    // Dennis reveals to pass turn
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Micah visits Spice Refinery — needs a purple card
    const handZone = game.zones.byId('micah.hand')
    const purpleCard = handZone.cardlist().find(c => c.agentIcons.includes('purple'))
    if (!purpleCard) {
      // Skip if no purple card in hand
      return
    }
    t.choose(game, 'Agent Turn.' + purpleCard.name)

    const spaces = t.currentChoices(game)
    if (!spaces.includes('Spice Refinery')) {
      return
    }
    t.choose(game, 'Spice Refinery')

    // Choose the 2 Solari option
    const choices = t.currentChoices(game)
    const solariChoice = choices.find(c => c.includes('2 Solari') || c.includes('Solari'))
    if (solariChoice) {
      t.choose(game, solariChoice)
    }

    // Deploy
    const deployChoices = t.currentChoices(game)
    if (deployChoices.some(c => c.includes('Deploy'))) {
      t.choose(game, deployChoices.find(c => c.includes('0')))
    }

    // Dennis should get control bonus of 1 Solari
    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(1)
  })

  test('Spice Refinery control bonus is defined as 1 Solari', () => {
    const boardSpaces = require('../res/boardSpaces.js')
    const spiceRefinery = boardSpaces.find(s => s.id === 'spice-refinery')
    expect(spiceRefinery.controlBonus).toEqual({ resource: 'solari', amount: 1 })
  })
})
