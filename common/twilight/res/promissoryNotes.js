// Generic promissory notes for Twilight Imperium 4th Edition
//
// Every player starts with one copy of each generic promissory note plus
// their faction-specific promissory note. Notes can be traded during transactions.
//
// Promissory note attributes:
//   id          - Unique identifier
//   name        - Display name
//   description - Rules text
//   timing      - When the note can be played

const genericPromissoryNotes = [
  {
    id: 'support-for-the-throne',
    name: 'Support for the Throne',
    description: 'The player who has this card gains 1 victory point. If you activate a system that contains units belonging to the player who gave you this card, return this card to that player.',
    timing: 'passive',
  },
  {
    id: 'ceasefire',
    name: 'Ceasefire',
    description: 'At the start of your turn during the action phase: Return this card to the player who gave it to you. Then, during this game round, that player cannot activate a system that contains your units.',
    timing: 'start-of-turn',
  },
  {
    id: 'trade-agreement',
    name: 'Trade Agreement',
    description: 'At the start of the strategy phase: Return this card to the player who gave it to you. Then, that player gives you a number of trade goods equal to their commodity value.',
    timing: 'start-of-strategy',
  },
  {
    id: 'political-favor',
    name: 'Political Favor',
    description: 'When an agenda is being voted on: Return this card to the player who gave it to you. Then, exhaust any number of planets you control and cast an equal number of additional votes on this agenda.',
    timing: 'during-agenda',
  },
]

function getGenericPromissoryNotes() {
  return [...genericPromissoryNotes]
}

function getPromissoryNote(id) {
  return genericPromissoryNotes.find(n => n.id === id)
}

module.exports = {
  getGenericPromissoryNotes,
  getPromissoryNote,
}
