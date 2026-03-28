const { parseAgentAbility } = require('../systems/cardEffects')

describe('Card Agent Ability Parser', () => {

  test('parses simple troop gain', () => {
    expect(parseAgentAbility('+1 Troop')).toEqual([{ type: 'troop', amount: 1 }])
    expect(parseAgentAbility('+2 Troops')).toEqual([{ type: 'troop', amount: 2 }])
  })

  test('parses resource gains', () => {
    expect(parseAgentAbility('+1 Solari')).toEqual([{ type: 'gain', resource: 'solari', amount: 1 }])
    expect(parseAgentAbility('+3 Solari')).toEqual([{ type: 'gain', resource: 'solari', amount: 3 }])
    expect(parseAgentAbility('+2 Spice')).toEqual([{ type: 'gain', resource: 'spice', amount: 2 }])
    expect(parseAgentAbility('+1 Water')).toEqual([{ type: 'gain', resource: 'water', amount: 1 }])
  })

  test('parses draw cards', () => {
    expect(parseAgentAbility('Draw 1 card')).toEqual([{ type: 'draw', amount: 1 }])
    expect(parseAgentAbility('Draw 2 cards')).toEqual([{ type: 'draw', amount: 2 }])
  })

  test('parses intrigue cards', () => {
    expect(parseAgentAbility('+1 Intrigue card')).toEqual([{ type: 'intrigue', amount: 1 }])
    expect(parseAgentAbility('+1 Intrigue')).toEqual([{ type: 'intrigue', amount: 1 }])
  })

  test('parses trash this card', () => {
    expect(parseAgentAbility('Trash this card')).toEqual([{ type: 'trash-self' }])
  })

  test('parses trash a card', () => {
    expect(parseAgentAbility('Trash a card')).toEqual([{ type: 'trash-card' }])
    expect(parseAgentAbility('Trash 1 card')).toEqual([{ type: 'trash-card' }])
  })

  test('parses spy placement', () => {
    expect(parseAgentAbility('+1 Spy')).toEqual([{ type: 'spy' }])
  })

  test('parses influence choice', () => {
    expect(parseAgentAbility('+1 Influence with a Faction')).toEqual([{ type: 'influence-choice', amount: 1 }])
    expect(parseAgentAbility('+1 Influence with any Faction')).toEqual([{ type: 'influence-choice', amount: 1 }])
  })

  test('parses compound abilities', () => {
    const result = parseAgentAbility('+1 Troop, Trash a card')
    expect(result).toEqual([
      { type: 'troop', amount: 1 },
      { type: 'trash-card' },
    ])
  })

  test('parses compound with "and"', () => {
    const result = parseAgentAbility('+2 Troops and Draw 1 card')
    expect(result).toEqual([
      { type: 'troop', amount: 2 },
      { type: 'draw', amount: 1 },
    ])
  })

  test('parses recall an agent', () => {
    const result = parseAgentAbility('Draw a Card, Recall an Agent')
    expect(result).toEqual([
      { type: 'draw', amount: 1 },
      { type: 'recall-agent' },
    ])
  })

  test('parses cost-effect pattern', () => {
    const result = parseAgentAbility('Pay 2 Spice: +3 Troops')
    expect(result).toEqual([{
      type: 'choice',
      choices: [
        { label: 'Pay 2 Spice: +3 Troops', cost: { spice: 2 }, effects: [{ type: 'troop', amount: 3 }] },
        { label: 'Decline', effects: [] },
      ],
    }])
  })

  test('parses OR choice', () => {
    const result = parseAgentAbility('+1 Spacing Guild Influence OR +2 Spice')
    expect(result).toEqual([{
      type: 'choice',
      choices: [
        { label: '+1 Spacing Guild Influence', effects: [{ type: 'influence', faction: 'guild', amount: 1 }] },
        { label: '+2 Spice', effects: [{ type: 'gain', resource: 'spice', amount: 2 }] },
      ],
    }])
  })

  test('returns null for complex conditional abilities', () => {
    expect(parseAgentAbility('Signet Ring')).toBeNull()
    expect(parseAgentAbility('If you have another Bene Gesserit card in play: Draw 1 card')).toBeNull()
    expect(parseAgentAbility('With 2 Emperor Influence: +2 Spice')).toBeNull()
    expect(parseAgentAbility('Each opponent loses 1 Garrisoned Troop')).toBeNull()
  })

  test('returns null for null/empty input', () => {
    expect(parseAgentAbility(null)).toBeNull()
    expect(parseAgentAbility('')).toBeNull()
  })
})
