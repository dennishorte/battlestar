// Strategy Cards for Twilight Imperium 4th Edition
//
// Each strategy card has:
//   id       - Unique identifier
//   name     - Display name
//   number   - Initiative number (determines turn order in action phase)
//   trade    - Trade goods placed on this card when not picked

const strategyCards = [
  {
    id: 'leadership',
    name: 'Leadership',
    number: 1,
  },
  {
    id: 'diplomacy',
    name: 'Diplomacy',
    number: 2,
  },
  {
    id: 'politics',
    name: 'Politics',
    number: 3,
  },
  {
    id: 'construction',
    name: 'Construction',
    number: 4,
  },
  {
    id: 'trade',
    name: 'Trade',
    number: 5,
  },
  {
    id: 'warfare',
    name: 'Warfare',
    number: 6,
  },
  {
    id: 'technology',
    name: 'Technology',
    number: 7,
  },
  {
    id: 'imperial',
    name: 'Imperial',
    number: 8,
  },
]

function getStrategyCard(id) {
  return strategyCards.find(c => c.id === id)
}

function getStrategyCardByNumber(number) {
  return strategyCards.find(c => c.number === number)
}

function getAllStrategyCards() {
  return [...strategyCards]
}

module.exports = {
  strategyCards,
  getStrategyCard,
  getStrategyCardByNumber,
  getAllStrategyCards,
}
