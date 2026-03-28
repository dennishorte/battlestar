'use strict'

// Sardaukar Commander skill cards. Recruited via the Emperor faction.
// Each has a count of 2 in the bank.
const sardaukarCards = [
  { id: 'sardaukar-canny', name: 'Canny', compatibility: 'Base', count: 2, effect: 'If you have an Agent on a green board space: +2 Swords.' },
  { id: 'sardaukar-driven', name: 'Driven', compatibility: 'Base', count: 2, effect: 'Reveal turn: +1 Spice.' },
  { id: 'sardaukar-loyal', name: 'Loyal', compatibility: 'Base', count: 2, effect: 'If you have 3+ Influence with the Emperor: +2 Swords.' },
  { id: 'sardaukar-charismatic', name: 'Charismatic', compatibility: 'Base', count: 2, effect: 'Reveal turn: +1 Persuasion' },
  { id: 'sardaukar-desperate', name: 'Desperate', compatibility: 'Base', count: 2, effect: 'Reveal turn: Trash this -> +3 Swords' },
  { id: 'sardaukar-fierce', name: 'Fierce', compatibility: 'Uprising', count: 2, effect: '+1 Sword. If any opponent has a sandworm in the Conflict: +1 Sword.' },
]

module.exports = sardaukarCards
