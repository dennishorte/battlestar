// Agenda Cards for Twilight Imperium 4th Edition
//
// Types:
//   law       - Remains in play when "For" or "Elect" outcome is resolved
//   directive - Resolved once and discarded
//
// Outcome types:
//   for-against  - Players vote "For" or "Against"
//   elect-player - Players vote for a player
//   elect-planet - Players vote for a planet (not yet implemented)

const agendaCards = [
  // --- Laws ---
  {
    id: 'minister-of-commerce',
    name: 'Minister of Commerce',
    type: 'law',
    outcomeType: 'elect-player',
    description: 'Elect a player. The elected player gains 1 trade good at the start of each strategy phase.',
  },
  {
    id: 'minister-of-war',
    name: 'Minister of War',
    type: 'law',
    outcomeType: 'elect-player',
    description: 'Elect a player. The elected player may, as a component action, remove 1 of their command tokens from the game board and return it to their reinforcements.',
  },
  {
    id: 'enforced-travel-ban',
    name: 'Enforced Travel Ban',
    type: 'law',
    outcomeType: 'for-against',
    forEffect: 'Alpha and beta wormholes have no effect during movement.',
    againstEffect: 'No effect.',
  },
  {
    id: 'research-team-biotic',
    name: 'Research Team: Biotic',
    type: 'law',
    outcomeType: 'for-against',
    forEffect: 'Attach this card to a planet with a green technology specialty. The planet\'s owner may exhaust this card and that planet to ignore 1 green technology prerequisite.',
    againstEffect: 'No effect.',
  },
  {
    id: 'committee-formation',
    name: 'Committee Formation',
    type: 'law',
    outcomeType: 'elect-player',
    description: 'Elect a player. The elected player gains the speaker token.',
  },

  // --- Directives ---
  {
    id: 'mutiny',
    name: 'Mutiny',
    type: 'directive',
    outcomeType: 'for-against',
    forEffect: 'Each player who voted "For" gains 1 victory point.',
    againstEffect: 'Each player who voted "Against" gains 1 victory point.',
  },
  {
    id: 'seed-of-an-empire',
    name: 'Seed of an Empire',
    type: 'directive',
    outcomeType: 'for-against',
    forEffect: 'The player with the most victory points gains 1 victory point.',
    againstEffect: 'The player with the fewest victory points gains 1 victory point.',
  },
  {
    id: 'compensated-disarmament',
    name: 'Compensated Disarmament',
    type: 'directive',
    outcomeType: 'elect-planet',
    description: 'Elect a planet. Destroy each unit on that planet. The planet\'s controller gains trade goods equal to the combined cost of those units.',
  },
  {
    id: 'economic-equality',
    name: 'Economic Equality',
    type: 'directive',
    outcomeType: 'for-against',
    forEffect: 'Each player returns all of their trade goods to the supply. Then, each player gains 5 trade goods.',
    againstEffect: 'No effect.',
  },
  {
    id: 'public-execution',
    name: 'Public Execution',
    type: 'directive',
    outcomeType: 'elect-player',
    description: 'Elect a player. The elected player discards all of their action cards. If the elected player has the speaker token, they give it to the player on their left. The elected player cannot vote on any agenda during this agenda phase.',
  },
]

function getAgendaCard(id) {
  return agendaCards.find(c => c.id === id)
}

function getAllAgendaCards() {
  return [...agendaCards]
}

function getAgendaCardsByType(type) {
  return agendaCards.filter(c => c.type === type)
}

module.exports = {
  agendaCards,
  getAgendaCard,
  getAllAgendaCards,
  getAgendaCardsByType,
}
