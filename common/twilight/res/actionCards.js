// Action cards for Twilight Imperium 4th Edition + PoK
//
// Action cards are drawn during status phase and via some abilities.
// They can be played during various game phases for their effects.

const actionCards = [
  // Tactical advantages
  {
    id: 'sabotage',
    name: 'Sabotage',
    timing: 'when-action-card-played',
    effect: 'When another player plays an action card: Cancel that action card.',
    count: 4,
  },
  {
    id: 'direct-hit',
    name: 'Direct Hit',
    timing: 'after-combat-round',
    effect: 'After another player\'s ship uses SUSTAIN DAMAGE to cancel a hit produced by your units or abilities: Destroy that ship.',
    count: 4,
  },
  {
    id: 'skilled-retreat',
    name: 'Skilled Retreat',
    timing: 'start-of-combat-round',
    effect: 'At the start of a combat round: Move all of your ships from the active system into an adjacent system.',
    count: 2,
  },
  {
    id: 'flank-speed',
    name: 'Flank Speed',
    timing: 'after-activation',
    effect: 'After you activate a system: Apply +1 to the move value of each of your ships during this tactical action.',
    count: 4,
  },
  {
    id: 'fire-team',
    name: 'Fire Team',
    timing: 'after-combat-round',
    effect: 'After a round of ground combat: Apply +1 to the result of each of your ground forces\' combat rolls during this round of ground combat.',
    count: 2,
  },

  // Diplomacy / Politics
  {
    id: 'diplomacy-rider',
    name: 'Diplomacy Rider',
    timing: 'during-agenda',
    effect: 'After an agenda is revealed: You cast 1 additional vote on this agenda for each planet you control.',
    count: 1,
  },
  {
    id: 'leadership-rider',
    name: 'Leadership Rider',
    timing: 'during-agenda',
    effect: 'After an agenda is revealed: You cast 5 additional votes on this agenda.',
    count: 1,
  },
  {
    id: 'politics-rider',
    name: 'Politics Rider',
    timing: 'during-agenda',
    effect: 'After an agenda is revealed: You become the speaker.',
    count: 1,
  },
  {
    id: 'trade-rider',
    name: 'Trade Rider',
    timing: 'during-agenda',
    effect: 'After an agenda is revealed: Gain 3 trade goods if the elected outcome is resolved.',
    count: 1,
  },
  {
    id: 'bribery',
    name: 'Bribery',
    timing: 'after-speaker-votes',
    effect: 'After the speaker votes on an agenda: Spend any number of trade goods. For each trade good spent, cast 1 additional vote for the outcome on which you voted.',
    count: 1,
  },
  {
    id: 'veto',
    name: 'Veto',
    timing: 'when-agenda-revealed',
    effect: 'When an agenda is revealed: Discard that agenda and reveal 1 agenda from the top of the deck. Players vote on this agenda instead.',
    count: 1,
  },

  // Economic
  {
    id: 'focused-research',
    name: 'Focused Research',
    timing: 'action',
    effect: 'ACTION: Spend 4 trade goods to research 1 technology.',
    count: 2,
  },
  {
    id: 'mining-initiative',
    name: 'Mining Initiative',
    timing: 'action',
    effect: 'ACTION: Gain trade goods equal to the resource value of 1 planet you control.',
    count: 2,
  },
  {
    id: 'industrial-initiative',
    name: 'Industrial Initiative',
    timing: 'action',
    effect: 'ACTION: Gain 1 trade good for each planet you control that has an industrial trait.',
    count: 2,
  },

  // Military
  {
    id: 'unexpected-action',
    name: 'Unexpected Action',
    timing: 'action',
    effect: 'ACTION: Remove 1 of your command tokens from a system on the game board and return it to your reinforcements.',
    count: 2,
  },
  {
    id: 'tactical-bombardment',
    name: 'Tactical Bombardment',
    timing: 'after-activation',
    effect: 'After you activate a system: Each of your non-fighter ships in that system may use their BOMBARDMENT ability against each planet controlled by another player in that system.',
    count: 2,
  },
  {
    id: 'war-machine',
    name: 'War Machine',
    timing: 'after-activation',
    effect: 'After you activate a system that contains 1 or more of your space docks: You may produce up to 2 additional units in that system.',
    count: 2,
  },
  {
    id: 'unstable-planet',
    name: 'Unstable Planet',
    timing: 'action',
    effect: 'ACTION: Choose 1 hazardous planet. Exhaust that planet and destroy up to 3 infantry on it.',
    count: 2,
  },

  // Utility
  {
    id: 'ghost-ship',
    name: 'Ghost Ship',
    timing: 'action',
    effect: 'ACTION: Place 1 destroyer from your reinforcements in a system that contains a wormhole and does not contain other players\' ships.',
    count: 2,
  },
  {
    id: 'signal-jamming',
    name: 'Signal Jamming',
    timing: 'after-activation',
    effect: 'After you activate a system: Place a command token from another player\'s reinforcements in any system.',
    count: 2,
  },
  {
    id: 'plague',
    name: 'Plague',
    timing: 'action',
    effect: 'ACTION: Choose 1 planet that contains infantry. Roll 1 die for each infantry on that planet. On a 6+, destroy that infantry.',
    count: 2,
  },
  {
    id: 'uprising',
    name: 'Uprising',
    timing: 'action',
    effect: 'ACTION: Exhaust 1 non-home planet controlled by another player. Then gain trade goods equal to its resource value.',
    count: 2,
  },
]

// Build the full deck (respecting count per card)
function buildActionDeck() {
  const deck = []
  for (const card of actionCards) {
    for (let i = 0; i < card.count; i++) {
      deck.push({ ...card, deckIndex: i })
    }
  }
  return deck
}

function getActionCard(id) {
  return actionCards.find(c => c.id === id)
}

function getActionCardByName(name) {
  return actionCards.find(c => c.name === name)
}

function getAllActionCards() {
  return [...actionCards]
}

module.exports = {
  buildActionDeck,
  getActionCard,
  getActionCardByName,
  getAllActionCards,
}
