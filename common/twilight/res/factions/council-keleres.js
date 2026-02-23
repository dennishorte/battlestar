module.exports = {
  id: 'council-keleres',
  name: 'The Council Keleres',
  homeSystem: null,
  startingTechnologies: [],
  startingUnits: {
    space: ['carrier', 'carrier', 'cruiser', 'fighter', 'fighter'],
    planets: {},
  },
  commodities: 2,
  startingCommandTokens: { tactics: 3, strategy: 2, fleet: 3 },
  setupNotes: 'Choose a Keleres hero that corresponds to an unused faction; take that faction\'s home system, command tokens and control tokens. Choose 2 non-faction technologies owned by other players.',
  abilities: [
    {
      id: 'the-tribunii',
      name: 'The Tribunii',
      description: "During setup, choose a Keleres hero that corresponds to an unused faction; take that faction's home system, command tokens and control tokens. The unchosen Keleres heroes are not used.",
    },
    {
      id: 'council-patronage',
      name: 'Council Patronage',
      description: 'Replenish your commodities at the start of the strategy phase, then gain 1 trade good.',
    },
    {
      id: 'laws-order',
      name: "Law's Order",
      description: "You may spend 1 trade good or 1 commodity at the start of any player's turn to treat all laws as blank until the end of that turn.",
    },
  ],
  flagship: {
    name: 'Artemiris',
    cost: 8,
    combat: 7,
    move: 1,
    capacity: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'Other players must spend 2 influence to activate this system.',
  },
  mech: {
    name: 'Omniopiares',
    cost: 2,
    combat: 6,
    hits: 2,
    abilities: ['sustain-damage'],
    description: 'Other players must spend 1 influence to commit ground forces to the planet that contains this unit.',
  },
  leaders: {
    agent: {
      name: 'Xander Alexin Victori III',
      unlocked: true,
      description: 'At any time: You may exhaust this card to allow any player to spend commodities as if they were trade goods.',
    },
    commander: {
      name: 'Suffi An',
      unlockCondition: 'Spend 1 trade good after you play an action card that has a component action.',
      description: 'After you perform a component action: You may perform an additional action.',
    },
    heroOptions: {
      argent: {
        name: 'Kuuasi Aun Jalatai',
        unlockCondition: 'Have 3 scored objectives.',
        description: 'OVERWING ZETA — At the start of a round of space combat in a system that contains a planet you control: Place your flagship and any combination of up to 2 cruisers or destroyers from your reinforcements in the active system. Then, purge this card.',
      },
      xxcha: {
        name: 'Odlynn Myrr',
        unlockCondition: 'Have 3 scored objectives.',
        description: 'OPERATION ARCHON — After an agenda is revealed: You may cast up to 6 additional votes on this agenda. Predict aloud an outcome for this agenda. For each player that abstains or votes for another outcome, gain 1 trade good and 1 command token. Then, purge this card.',
      },
      mentak: {
        name: 'Harka Leeds',
        unlockCondition: 'Have 3 scored objectives.',
        description: "ERWAN'S COVENANT — ACTION: Reveal cards from the action card deck until you reveal 3 action cards that have component actions. Draw those cards and shuffle the rest back into the action card deck. Then, purge this card.",
      },
    },
  },
  promissoryNote: {
    id: 'keleres-rider',
    name: 'Keleres Rider',
    description: 'After an agenda is revealed: You cannot vote on this agenda. Predict aloud an outcome of this agenda. If your prediction is correct, draw 1 action card and gain 2 trade goods. Then, return this card to the Keleres player.',
  },
  factionTechnologies: [
    {
      id: 'executive-order',
      name: 'Executive Order',
      color: 'yellow',
      prerequisites: ['yellow'],
      unitUpgrade: null,
      description: 'ACTION: Exhaust this card and draw the top or bottom card of the agenda deck. Players immediately vote on this agenda as if you were the speaker; you can spend trade goods and resources on this agenda as if they were votes.',
    },
    {
      id: 'agency-supply-network',
      name: 'Agency Supply Network',
      color: 'yellow',
      prerequisites: ['yellow', 'yellow'],
      unitUpgrade: null,
      description: "Once per action, when you resolve a unit's PRODUCTION ability, you may resolve another of your unit's PRODUCTION abilities in any system.",
    },
    {
      id: 'iihq-modernization',
      name: 'I.I.H.Q. Modernization',
      color: null,
      prerequisites: ['yellow', 'green'],
      unitUpgrade: null,
      description: 'When you gain this card, gain the Custodia Vigilia planet card and its legendary planet ability card. You are neighbors with all players that have units or control planets in or adjacent to the Mecatol Rex system.',
    },
  ],
}
