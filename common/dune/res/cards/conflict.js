'use strict'

// Setup builds a 10-card deck: shuffle tier III (all 4), place face down.
// Shuffle tier II (9), deal 5 on top. Shuffle tier I (3), deal 1 on top.
// Unused cards returned to box without looking.

const conflictCards = [
  // Conflict I — Base (4 cards, compatibility: Base)
  { id: 'conflict-skirmish-1', name: 'Skirmish', source: 'Base', compatibility: 'Base', tier: 1, vpsAvailable: 0, battleIcon: null, rewards: { first: '+1 Influence and +1 Spice', second: '+2 Spice', third: '+1 Spice' } },
  { id: 'conflict-skirmish-2', name: 'Skirmish', source: 'Base', compatibility: 'Base', tier: 1, vpsAvailable: 1, battleIcon: null, rewards: { first: '+1 Victory point', second: '+1 Intrigue card and +2 Solari', third: '+2 Solari' } },
  { id: 'conflict-skirmish-3', name: 'Skirmish', source: 'Base', compatibility: 'Base', tier: 1, vpsAvailable: 0, battleIcon: null, rewards: { first: '+1 Influence and +2 Solari', second: '+3 Solari', third: '+2 Solari' } },
  { id: 'conflict-skirmish-4', name: 'Skirmish', source: 'Base', compatibility: 'Base', tier: 1, vpsAvailable: 1, battleIcon: null, rewards: { first: '+1 Victory point', second: '+1 Water', third: '+1 Spice' } },

  // Conflict I — Uprising (3 cards, compatibility: Uprising)
  { id: 'conflict-skirmish-crysknife', name: 'Skirmish', source: 'Uprising', compatibility: 'Uprising', tier: 1, vpsAvailable: 0, battleIcon: 'crysknife', rewards: { first: '+1 Influence', second: '+1 Intrigue card and +1 Spice', third: '+1 Spice' } },
  { id: 'conflict-skirmish-ornithopter', name: 'Skirmish', source: 'Uprising', compatibility: 'Uprising', tier: 1, vpsAvailable: 0, battleIcon: 'ornithopter', rewards: { first: '+1 Intrigue card and +1 Solari', second: '+1 Intrigue card and +2 Solari', third: '+1 Intrigue card' } },
  { id: 'conflict-skirmish-desert-mouse', name: 'Skirmish', source: 'Uprising', compatibility: 'Uprising', tier: 1, vpsAvailable: 0, battleIcon: 'desert-mouse', rewards: { first: '+2 Solari', second: '+3 Solari', third: '+2 Solari' } },

  // Conflict I — Bloodlines (1 card, compatibility: All)
  { id: 'conflict-skirmish-5', name: 'Skirmish', source: 'Bloodlines', compatibility: 'All', tier: 1, vpsAvailable: 0, battleIcon: 'wild', rewards: { first: 'Trash a card', second: '+1 Water and +1 Solari', third: '+2 Solari' } },

  // Conflict II — Base (9 cards, compatibility: Base)
  { id: 'conflict-cloak-and-dagger', name: 'Cloak and Dagger', source: 'Base', compatibility: 'Base', tier: 2, vpsAvailable: 0, battleIcon: null, rewards: { first: '+1 Influence and +2 Intrigue cards', second: '+1 Intrigue card and +1 Spice', third: '+1 Intrigue card OR +1 Spice' } },
  { id: 'conflict-desert-power', name: 'Desert Power', source: 'Base', compatibility: 'Base', tier: 2, vpsAvailable: 1, battleIcon: null, rewards: { first: '+1 Victory point and +1 Water', second: '+1 Water and +1 Spice', third: '+1 Spice' } },
  { id: 'conflict-guild-bank-raid', name: 'Guild Bank Raid', source: 'Base', compatibility: 'Base', tier: 2, vpsAvailable: 0, battleIcon: null, rewards: { first: '+6 Solari', second: '+4 Solari', third: '+2 Solari' } },
  { id: 'conflict-machinations', name: 'Machinations', source: 'Base', compatibility: 'Base', tier: 2, vpsAvailable: 0, battleIcon: null, rewards: { first: 'Choose two of the 4 Factions. Gain +1 Influence in each.', second: '+1 Water and +2 Solari', third: '+1 Water' } },
  { id: 'conflict-raid-stockpiles', name: 'Raid Stockpiles', source: 'Base', compatibility: 'Base', tier: 2, vpsAvailable: 0, battleIcon: null, rewards: { first: '+1 Intrigue card and +3 Spice', second: '+2 Spice', third: '+1 Spice' } },
  { id: 'conflict-secure-imperial-basin', name: 'Secure Imperial Basin', source: 'Base', compatibility: 'Base', tier: 2, vpsAvailable: 1, battleIcon: null, location: 'imperial-basin', rewards: { first: '+1 Victory point and Imperial Basin Control', second: '+2 Water', third: '+1 Water' } },
  { id: 'conflict-siege-of-arrakeen', name: 'Siege of Arrakeen', source: 'Base', compatibility: 'Base', tier: 2, vpsAvailable: 1, battleIcon: null, location: 'arrakeen', rewards: { first: '+1 Victory point and Arrakeen Control', second: '+4 Solari', third: '+2 Solari' } },
  { id: 'conflict-siege-of-carthag', name: 'Siege of Carthag', source: 'Base', compatibility: 'Base', tier: 2, vpsAvailable: 1, battleIcon: null, location: 'carthag', rewards: { first: '+1 Victory point and Carthag Control', second: '+1 Intrigue card and +1 Spice', third: '+1 Spice' } },
  { id: 'conflict-sort-through-the-chaos', name: 'Sort Through the Chaos', source: 'Base', compatibility: 'Base', tier: 2, vpsAvailable: 0, battleIcon: null, rewards: { first: 'Mentat and +1 Intrigue and +1 Solari', second: '+1 Intrigue card and +2 Solari', third: '+2 Solari' } },
  { id: 'conflict-terrible-purpose', name: 'Terrible Purpose', source: 'Base', compatibility: 'Base', tier: 2, vpsAvailable: 1, battleIcon: null, rewards: { first: '+1 Victory point and Trash a card', second: '+1 Water and +1 Spice', third: '+1 Spice' } },

  // Conflict II — Uprising (8 cards, compatibility: Uprising)
  { id: 'conflict-choam-security', name: 'CHOAM Security', source: 'Uprising', compatibility: 'Uprising', tier: 2, vpsAvailable: 0, battleIcon: 'crysknife', rewards: { first: '+1 Spacing Guild Influence and +1 Contract and +1 Troop', second: '+1 Water and +2 Troops and +2 Solari', third: '+1 Intrigue card and +1 Troop' } },
  { id: 'conflict-protect-the-sietches', name: 'Protect the Sietches', source: 'Uprising', compatibility: 'Uprising', tier: 2, vpsAvailable: 0, battleIcon: 'desert-mouse', rewards: { first: '+1 Fremen Influence and +1 Water and +1 Troop', second: '+3 Spice and +1 Troop', third: '+2 Spice' } },
  { id: 'conflict-secure-imperial-basin-uprising', name: 'Secure Imperial Basin', source: 'Uprising', compatibility: 'Uprising', tier: 2, vpsAvailable: 0, battleIcon: 'desert-mouse', location: 'imperial-basin', behindShieldWall: true, rewards: { first: '+2 Spice and +1 Troop and Imperial Basin Control', second: '+2 Water and +1 Troop', third: '+1 Water and +1 Troop' } },
  { id: 'conflict-seize-spice-refinery', name: 'Seize Spice Refinery', source: 'Uprising', compatibility: 'Uprising', tier: 2, vpsAvailable: 0, battleIcon: 'crysknife', location: 'spice-refinery', behindShieldWall: true, rewards: { first: '+1 Spy and +2 Spice and Spice Refinery Control', second: '+1 Intrigue card and +1 Spice and +1 Troop', third: '+2 Spice' } },
  { id: 'conflict-shadow-contest', name: 'Shadow Contest', source: 'Uprising', compatibility: 'Uprising', tier: 2, vpsAvailable: 0, battleIcon: 'ornithopter', rewards: { first: '+1 Bene Gesserit Influence and +1 Intrigue card', second: '+1 Intrigue card and +1 Spice and +1 Troop', third: '+1 Spice and +1 Troop' } },
  { id: 'conflict-siege-of-arrakeen-uprising', name: 'Siege of Arrakeen', source: 'Uprising', compatibility: 'Uprising', tier: 2, vpsAvailable: 0, battleIcon: 'ornithopter', location: 'arrakeen', behindShieldWall: true, rewards: { first: '+2 Solari and +2 Troops and Arrakeen Control', second: '+4 Solari and +1 Troop', third: '+3 Solari' } },
  { id: 'conflict-spice-freighters', name: 'Spice Freighters', source: 'Uprising', compatibility: 'Uprising', tier: 2, vpsAvailable: 0, battleIcon: 'crysknife', rewards: { first: '+1 Influence and Pay 3 Spice for +1 Victory point', second: '+1 Water and +1 Troop and +1 Spice', third: '+1 Spice and +1 Troop' } },
  { id: 'conflict-test-of-loyalty', name: 'Test of Loyalty', source: 'Uprising', compatibility: 'Uprising', tier: 2, vpsAvailable: 0, battleIcon: 'ornithopter', rewards: { first: '+1 Emperor Influence and +1 Spy and +2 Solari', second: '+4 Solari and +1 Troop', third: '+3 Solari' } },
  { id: 'conflict-trade-dispute', name: 'Trade Dispute', source: 'Uprising', compatibility: 'Uprising', tier: 2, vpsAvailable: 0, battleIcon: 'desert-mouse', rewards: { first: '+1 Contract and +1 Water and Trash a card', second: '+1 Water and +1 Spice and Trash a card', third: '+1 Water and +1 Troop' } },

  // Conflict II — Bloodlines (1 card, compatibility: Uprising)
  { id: 'conflict-storms-in-the-south', name: 'Storms in the South', source: 'Bloodlines', compatibility: 'Uprising', tier: 2, vpsAvailable: 0, battleIcon: 'wild', rewards: { first: '+1 Spy with Deep Cover and +2 Spice', second: '+2 Intrigue cards and +2 Solari', third: '+1 Intrigue and +2 Solari' } },

  // Conflict III — Base (4 cards, compatibility: Base)
  { id: 'conflict-battle-for-arrakeen', name: 'Battle for Arrakeen', source: 'Base', compatibility: 'Base', tier: 3, vpsAvailable: 2, battleIcon: null, location: 'arrakeen', rewards: { first: '+2 Victory points and Arrakeen Control', second: '+1 Intrigue card and +2 Spice and +3 Solari', third: '+1 Intrigue card and +2 Solari' } },
  { id: 'conflict-battle-for-carthag', name: 'Battle for Carthag', source: 'Base', compatibility: 'Base', tier: 3, vpsAvailable: 2, battleIcon: null, location: 'carthag', rewards: { first: '+2 Victory points and Carthag Control', second: '+1 Intrigue card and +3 Spice', third: '+3 Spice' } },
  { id: 'conflict-battle-for-imperial-basin', name: 'Battle for Imperial Basin', source: 'Base', compatibility: 'Base', tier: 3, vpsAvailable: 2, battleIcon: null, location: 'imperial-basin', rewards: { first: '+2 Victory points and Imperial Basin Control', second: '+5 Spice', third: '+3 Spice' } },
  { id: 'conflict-grand-vision', name: 'Grand Vision', source: 'Base', compatibility: 'Base', tier: 3, vpsAvailable: 2, battleIcon: null, rewards: { first: '+2 Influence and +1 Intrigue card', second: '+1 Intrigue card and +3 Spice', third: '+3 Spice' } },

  // Conflict III — Uprising (4 cards, compatibility: Uprising)
  { id: 'conflict-battle-for-arrakeen-uprising', name: 'Battle for Arrakeen', source: 'Uprising', compatibility: 'Uprising', tier: 3, vpsAvailable: 1, battleIcon: 'crysknife', location: 'arrakeen', behindShieldWall: true, rewards: { first: '+1 Victory point and Arrakeen Control and Return 2 Spies for +1 Victory point', second: '+1 Intrigue card and +1 Spice and +3 Solari', third: '+2 Spice and +2 Solari' } },
  { id: 'conflict-battle-for-imperial-basin-uprising', name: 'Battle for Imperial Basin', source: 'Uprising', compatibility: 'Uprising', tier: 3, vpsAvailable: 1, battleIcon: 'ornithopter', location: 'imperial-basin', behindShieldWall: true, rewards: { first: '+1 Victory point and Imperial Basin Control and Pay 4 Spice for +1 Victory point', second: '+5 Spice', third: '+3 Spice' } },
  { id: 'conflict-battle-for-spice-refinery', name: 'Battle for Spice Refinery', source: 'Uprising', compatibility: 'Uprising', tier: 3, vpsAvailable: 1, battleIcon: 'desert-mouse', location: 'spice-refinery', behindShieldWall: true, rewards: { first: '+1 Victory point and Spice Refinery Control and Pay 6 Solari for +1 Victory point', second: '+1 Intrigue card and +3 Spice', third: '+3 Spice' } },
  { id: 'conflict-propaganda', name: 'Propaganda', source: 'Uprising', compatibility: 'Uprising', tier: 3, vpsAvailable: 0, battleIcon: 'wild', rewards: { first: 'Choose two of the 4 Factions. Gain +1 Influence in each.', second: '+1 Intrigue card and +3 Spice', third: '+3 Spice' } },
]

module.exports = conflictCards
