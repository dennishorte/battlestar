'use strict'

// Objective cards — each player draws one at random during setup.
// The player whose objective shows the First Player marker takes that marker.
const objectiveCards = [
  { id: 'obj-desert-mouse-1', name: 'Desert Mouse', compatibility: 'All', battleIcon: 'desert-mouse', isFirstPlayer: false, playerCount: 'all' },
  { id: 'obj-desert-mouse-2', name: 'Desert Mouse (First Player)', compatibility: 'All', battleIcon: 'desert-mouse', isFirstPlayer: true, playerCount: 'all' },
  { id: 'obj-crysknife-1', name: 'Crysknife', compatibility: 'All', battleIcon: 'crysknife', isFirstPlayer: false, playerCount: 'all' },
  { id: 'obj-crysknife-2', name: 'Crysknife', compatibility: 'All', battleIcon: 'crysknife', isFirstPlayer: false, playerCount: 'all' },
  { id: 'obj-ornithopter-1', name: 'Ornithopter', compatibility: 'All', battleIcon: 'ornithopter', isFirstPlayer: false, playerCount: '1-3' },
]

module.exports = objectiveCards
