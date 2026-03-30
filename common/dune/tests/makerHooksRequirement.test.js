describe('Maker Hooks Requirement', () => {

  test('sandworm choice at Hagga Basin requires maker hook', () => {
    const boardSpaces = require('../res/boardSpaces.js')
    const hagga = boardSpaces.find(s => s.id === 'hagga-basin')
    const sandwormChoice = hagga.effects[0].choices.find(c => c.label.includes('Sandworm'))
    expect(sandwormChoice.requires).toBe('maker-hook')
  })

  test('sandworm choice at Deep Desert requires maker hook', () => {
    const boardSpaces = require('../res/boardSpaces.js')
    const deep = boardSpaces.find(s => s.id === 'deep-desert')
    const sandwormChoice = deep.effects[0].choices.find(c => c.label.includes('Sandworm'))
    expect(sandwormChoice.requires).toBe('maker-hook')
  })

  test('Sietch Tabr grants maker hook token', () => {
    const boardSpaces = require('../res/boardSpaces.js')
    const sietch = boardSpaces.find(s => s.id === 'sietch-tabr')
    const hookChoice = sietch.effects[0].choices.find(c => c.label.includes('Maker'))
    const hookEffect = hookChoice.effects.find(e => e.type === 'maker-hook')
    expect(hookEffect).toBeDefined()
  })
})
