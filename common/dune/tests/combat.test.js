const { parseRewardText } = require('../phases/combat')

describe('Combat Reward Parsing', () => {

  test('parses victory points', () => {
    const effects = parseRewardText('+1 Victory point')
    expect(effects).toEqual([{ type: 'vp', amount: 1 }])
  })

  test('parses multiple victory points', () => {
    const effects = parseRewardText('+2 Victory points')
    expect(effects).toEqual([{ type: 'vp', amount: 2 }])
  })

  test('parses resource gains', () => {
    expect(parseRewardText('+2 Spice')).toEqual([{ type: 'gain', resource: 'spice', amount: 2 }])
    expect(parseRewardText('+4 Solari')).toEqual([{ type: 'gain', resource: 'solari', amount: 4 }])
    expect(parseRewardText('+1 Water')).toEqual([{ type: 'gain', resource: 'water', amount: 1 }])
  })

  test('parses intrigue cards', () => {
    expect(parseRewardText('+1 Intrigue card')).toEqual([{ type: 'intrigue', amount: 1 }])
    expect(parseRewardText('+2 Intrigue cards')).toEqual([{ type: 'intrigue', amount: 2 }])
  })

  test('parses influence', () => {
    expect(parseRewardText('+1 Influence')).toEqual([{ type: 'influence-choice', amount: 1 }])
  })

  test('parses location control', () => {
    expect(parseRewardText('Arrakeen Control')).toEqual([{ type: 'control', location: 'arrakeen' }])
    expect(parseRewardText('Imperial Basin Control')).toEqual([{ type: 'control', location: 'imperial-basin' }])
  })

  test('parses trash a card', () => {
    expect(parseRewardText('Trash a card')).toEqual([{ type: 'trash-card' }])
  })

  test('parses compound rewards with "and"', () => {
    const effects = parseRewardText('+1 Victory point and Arrakeen Control')
    expect(effects).toEqual([
      { type: 'vp', amount: 1 },
      { type: 'control', location: 'arrakeen' },
    ])
  })

  test('parses compound rewards with multiple "and"', () => {
    const effects = parseRewardText('+1 Intrigue card and +2 Spice and +3 Solari')
    expect(effects).toEqual([
      { type: 'intrigue', amount: 1 },
      { type: 'gain', resource: 'spice', amount: 2 },
      { type: 'gain', resource: 'solari', amount: 3 },
    ])
  })

  test('parses OR choices', () => {
    const effects = parseRewardText('+1 Intrigue card OR +1 Spice')
    expect(effects.length).toBe(1)
    expect(effects[0].type).toBe('choice')
    expect(effects[0].choices.length).toBe(2)
    expect(effects[0].choices[0].effects).toEqual([{ type: 'intrigue', amount: 1 }])
    expect(effects[0].choices[1].effects).toEqual([{ type: 'gain', resource: 'spice', amount: 1 }])
  })

  test('parses influence and spice compound', () => {
    const effects = parseRewardText('+1 Influence and +1 Spice')
    expect(effects).toEqual([
      { type: 'influence-choice', amount: 1 },
      { type: 'gain', resource: 'spice', amount: 1 },
    ])
  })

  test('returns empty array for null/empty', () => {
    expect(parseRewardText(null)).toEqual([])
    expect(parseRewardText('')).toEqual([])
  })
})
