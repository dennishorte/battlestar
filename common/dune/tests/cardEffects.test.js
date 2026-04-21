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

  test('parses "If you have N+ Influence" conditionals', () => {
    const result = parseAgentAbility('If you have 2+ Influence with the Emperor: +1 Troop')
    expect(result).toEqual([{
      type: 'conditional',
      condition: { type: 'influence', amount: 2, faction: 'emperor' },
      effects: [{ type: 'troop', amount: 1 }],
    }])
  })

  test('parses "If you have another Faction card in play" conditionals', () => {
    const result = parseAgentAbility('If you have another Bene Gesserit card in play: Draw 1 card')
    expect(result).not.toBeNull()
    expect(result[0].type).toBe('conditional')
    expect(result[0].condition.type).toBe('faction-card-in-play')
    expect(result[0].condition.faction).toBe('bene gesserit')
  })

  test('parses "With N Influence with Faction" conditionals', () => {
    const result = parseAgentAbility('With 2 Influence with Emperor: +2 Spice')
    expect(result).toEqual([{
      type: 'conditional',
      condition: { type: 'influence', amount: 2, faction: 'emperor' },
      effects: [{ type: 'gain', resource: 'spice', amount: 2 }],
    }])
  })

  test('parses "If you completed a contract this turn" conditional', () => {
    const result = parseAgentAbility('If you completed a contract this turn: +1 Intrigue card')
    expect(result).not.toBeNull()
    expect(result[0].condition.type).toBe('completed-contract-this-turn')
    expect(result[0].effects).toEqual([{ type: 'intrigue', amount: 1 }])
  })

  test('parses chained "If" conditionals', () => {
    const result = parseAgentAbility('If you have completed 2+ contracts: Draw a card. If you have completed 4+ contracts: Draw a card.')
    expect(result).not.toBeNull()
    expect(result.length).toBe(2)
    expect(result[0].condition).toEqual({ type: 'completed-contracts', amount: 2 })
    expect(result[1].condition).toEqual({ type: 'completed-contracts', amount: 4 })
  })

  test('parses "If you gained N+ Spice this turn" conditional', () => {
    const result = parseAgentAbility('If you gained 2+ Spice this turn: +1 Troop and Draw a card')
    expect(result).not.toBeNull()
    expect(result[0].condition).toEqual({ type: 'gained-spice', amount: 2 })
    expect(result[0].effects.length).toBe(2)
  })

  test('returns null for truly unparseable patterns', () => {
    expect(parseAgentAbility('Signet Ring')).toBeNull()
    expect(parseAgentAbility('Send one of your agents from anywhere to any board space')).toBeNull()
  })

  test('parses opponent effects', () => {
    const result = parseAgentAbility('Each opponent loses 1 Garrisoned Troop')
    expect(result).toEqual([{ type: 'opponent-lose-troop', amount: 1 }])
  })

  test('parses Having Alliance conditionals', () => {
    const result = parseAgentAbility('Having Emperor Alliance: +4 Persuation')
    expect(result).not.toBeNull()
    expect(result[0].type).toBe('conditional')
    expect(result[0].condition.type).toBe('has-specific-alliance')
    expect(result[0].condition.faction).toBe('emperor')
    expect(result[0].effects).toEqual([{ type: 'gain', resource: 'persuasion', amount: 4 }])
  })

  test('parses deploy to conflict', () => {
    expect(parseAgentAbility('Deploy up to 3 troops from Garrison to Conflict')).toEqual(
      [{ type: 'deploy-to-conflict', amount: 3 }]
    )
  })

  test('parses VP purchase patterns', () => {
    const result = parseAgentAbility('Pay 6 Solari -> +1 Victory Point')
    expect(result).not.toBeNull()
    expect(result[0].type).toBe('choice')
    expect(result[0].choices[0].cost).toEqual({ solari: 6 })
    expect(result[0].choices[0].effects).toEqual([{ type: 'vp', amount: 1 }])
  })

  test('returns null for null/empty input', () => {
    expect(parseAgentAbility(null)).toBeNull()
    expect(parseAgentAbility('')).toBeNull()
  })
})
