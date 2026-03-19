// Relics for Twilight Imperium: Prophecy of Kings
//
// Players gain relics by purging 3 relic fragments of the same type
// (or using unknown fragments as wildcards). Some faction abilities
// also grant relics directly.
//
// Relic types:
//   action   - Has an "ACTION:" ability (component action)
//   passive  - Ongoing effect while in play area
//   trigger  - Ability triggers at a specific timing

const relics = [
  // --- Prophecy of Kings (10 relics) ---

  {
    id: 'dominus-orb',
    name: 'Dominus Orb',
    expansion: 'pok',
    type: 'trigger',
    timing: 'beforeMovement',
    purge: true,
    effect: 'Before you move units during a tactical action, you may purge this card to move and transport units that are in systems that contain 1 of your command tokens.',
  },
  {
    id: 'maw-of-worlds',
    name: 'Maw of Worlds',
    expansion: 'pok',
    type: 'trigger',
    timing: 'startOfAgendaPhase',
    purge: true,
    effect: 'At the start of the agenda phase, you may purge this card and exhaust all of your planets to gain any 1 technology.',
  },
  {
    id: 'scepter-of-emelpar',
    name: 'Scepter of Emelpar',
    expansion: 'pok',
    type: 'trigger',
    timing: 'onSpendStrategyToken',
    exhaust: true,
    effect: 'When you would spend a token from your strategy pool, you may exhaust this card to spend a token from your reinforcements instead.',
  },
  {
    id: 'shard-of-the-throne',
    name: 'Shard of the Throne',
    expansion: 'pok',
    type: 'passive',
    victoryPoints: 1,
    effect: 'When you gain this card, gain 1 victory point. When you lose this card, lose 1 victory point. When a player gains control of a legendary planet you control, or a planet you control in your home system, that player gains this card.',
  },
  {
    id: 'stellar-converter',
    name: 'Stellar Converter',
    expansion: 'pok',
    type: 'action',
    purge: true,
    effect: 'ACTION: Choose 1 non-home, non-legendary planet other than Mecatol Rex in a system that is adjacent to 1 or more of your units that have BOMBARDMENT; destroy all units on that planet and purge its attachments and its planet card. Then, place the destroyed planet token on that planet and purge this card.',
  },
  {
    id: 'the-codex',
    name: 'The Codex',
    expansion: 'pok',
    type: 'action',
    purge: true,
    effect: 'ACTION: Purge this card to take up to 3 action cards of your choice from the action card discard pile.',
  },
  {
    id: 'the-crown-of-emphidia',
    name: 'The Crown of Emphidia',
    expansion: 'pok',
    type: 'trigger',
    timing: 'afterTacticalAction',
    exhaust: true,
    effect: 'After you perform a tactical action, you may exhaust this card to explore 1 planet you control. At the end of the status phase, if you control the Tomb of Emphidia, you may purge this card to gain 1 victory point.',
  },
  {
    id: 'the-crown-of-thalnos',
    name: 'The Crown of Thalnos',
    expansion: 'pok',
    type: 'passive',
    effect: 'During each combat round, this card\'s owner may reroll any number of their dice, applying +1 to the results; any units that reroll dice but do not produce at least 1 hit are destroyed.',
  },
  {
    id: 'the-obsidian',
    name: 'The Obsidian',
    expansion: 'pok',
    type: 'passive',
    onGain: 'drawSecretObjective',
    effect: 'When you gain this card, draw 1 secret objective. You can have 1 additional scored or unscored secret objective.',
  },
  {
    id: 'the-prophets-tears',
    name: 'The Prophet\'s Tears',
    expansion: 'pok',
    type: 'trigger',
    timing: 'onResearchTechnology',
    exhaust: true,
    effect: 'When you research a technology, you may exhaust this card to ignore 1 prerequisite or draw 1 action card.',
  },

  // --- Codex Volume II: Affinity (3 relics) ---

  {
    id: 'dynamis-core',
    name: 'Dynamis Core',
    expansion: 'codex-ii',
    type: 'action',
    commodityBonus: 2,
    effect: 'While this card is in your play area, your commodity value is increased by 2. ACTION: Gain trade goods equal to your commodity value then purge this card.',
    purge: true,
  },
  {
    id: 'jr-xs455-o',
    name: 'JR-XS455-O',
    expansion: 'codex-ii',
    type: 'action',
    exhaust: true,
    effect: 'ACTION: Exhaust this agent and choose a player; that player may spend 3 resources to place a structure on a planet they control. If they do not, they gain 1 trade good.',
  },
  {
    id: 'nano-forge',
    name: 'Nano-Forge',
    expansion: 'codex-ii',
    type: 'action',
    attach: true,
    effect: 'ACTION: Attach this card to a non-legendary, non-home planet you control; its resource and influence values are increased by 2 and it is a legendary planet. This action cannot be performed once attached.',
    attachment: { resources: 2, influence: 2, legendary: true },
  },

  // --- Codex Volume IV: Liberation (3 relics) ---

  {
    id: 'circlet-of-the-void',
    name: 'Circlet of the Void',
    expansion: 'codex-iv',
    type: 'action',
    exhaust: true,
    effect: 'Your units do not roll for gravity rifts, and you ignore the movement effects of other anomalies. ACTION: Exhaust this card to explore a frontier token in a system that does not contain any other players\' ships.',
  },
  {
    id: 'book-of-latvinia',
    name: 'Book of Latvinia',
    expansion: 'codex-iv',
    type: 'action',
    onGain: 'researchTwoNoPrereq',
    purge: true,
    effect: 'When you gain this card, research up to 2 technologies that have no prerequisites. ACTION: Purge this card; if you control planets that have all 4 types of technology specialties, gain 1 victory point. Otherwise, gain the speaker token.',
  },
  {
    id: 'neuraloop',
    name: 'Neuraloop',
    expansion: 'codex-iv',
    type: 'trigger',
    timing: 'onPublicObjectiveRevealed',
    effect: 'When a public objective is revealed, you may purge one of your relics to discard that objective and replace it with a random objective from any objective deck; that objective is a public objective, even if it is a secret objective.',
  },
]

function getRelic(id) {
  return relics.find(r => r.id === id)
}

function getAllRelics() {
  return [...relics]
}

module.exports = {
  getRelic,
  getAllRelics,
}
