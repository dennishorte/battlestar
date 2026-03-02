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
    description: 'When you receive this card, if you are not the owner, you must place it face-up in your play area and gain 1 Victory Point. If you activate a system that contains 1 or more of the owner\'s units, or if the owner is eliminated, lose 1 Victory Point and return this card to the owner.',
    timing: 'passive',
  },
  {
    id: 'ceasefire',
    name: 'Ceasefire',
    description: 'After the owner activates a system that contains 1 or more of your units: The owner cannot move units into the active system. Then, return this card to the owner.',
    timing: 'after-activation',
  },
  {
    id: 'trade-agreement',
    name: 'Trade Agreement',
    description: 'When the owner replenishes commodities: The owner gives you all of their commodities. Then, return this card to the owner.',
    timing: 'on-replenish',
  },
  {
    id: 'political-secret',
    name: 'Political Secret',
    description: 'When an agenda is revealed: The owner cannot vote, play action cards, or use faction abilities until after that agenda has been resolved. Then, return this card to the owner.',
    timing: 'during-agenda',
  },
]

// Alliance is initialized separately (Mahact Hubris exception) but needs to be
// resolvable via getPromissoryNote() for display purposes.
const allianceNote = {
  id: 'alliance',
  name: 'Alliance',
  description: 'When you receive this card, if you are not the owner, you must place it face up in your play area. While this card is in your play area, you can use the owner\'s commander ability, if it is unlocked. If you activate a system that contains 1 or more of the owner\'s units, return this card to the owner.',
  timing: 'passive',
}

const allNotes = [...genericPromissoryNotes, allianceNote]

function getGenericPromissoryNotes() {
  return [...genericPromissoryNotes]
}

function getPromissoryNote(id) {
  return allNotes.find(n => n.id === id)
}

module.exports = {
  getGenericPromissoryNotes,
  getPromissoryNote,
}
