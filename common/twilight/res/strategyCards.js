// Strategy Cards for Twilight Imperium 4th Edition
//
// Each strategy card has:
//   id        - Unique identifier
//   name      - Display name
//   number    - Initiative number (determines turn order in action phase)
//   primary   - Primary ability description (array of bullet points)
//   secondary - Secondary ability description (array of bullet points)

const strategyCards = [
  {
    id: 'leadership',
    name: 'Leadership',
    number: 1,
    primary: [
      'Gain 3 command tokens.',
      'Spend any amount of influence to gain 1 command token for every 3 influence spent.',
    ],
    secondary: [
      'Spend any amount of influence to gain 1 command token for every 3 influence spent.',
    ],
  },
  {
    id: 'diplomacy',
    name: 'Diplomacy',
    number: 2,
    primary: [
      'Choose 1 system other than the Mecatol Rex system that contains a planet you control; each other player places a command token from their reinforcements in that system. Then, ready up to 2 exhausted planets you control.',
    ],
    secondary: [
      'Spend 1 token from your strategy pool to ready up to 2 exhausted planets you control.',
    ],
  },
  {
    id: 'politics',
    name: 'Politics',
    number: 3,
    primary: [
      'Choose a player other than the speaker. That player gains the speaker token.',
      'Draw 2 action cards.',
      'Look at the top 2 cards of the agenda deck. Place each card on the top or bottom of the deck in any order.',
    ],
    secondary: [
      'Spend 1 token from your strategy pool to draw 2 action cards.',
    ],
  },
  {
    id: 'construction',
    name: 'Construction',
    number: 4,
    primary: [
      'Either place 1 structure on a planet you control or use the PRODUCTION ability of 1 of your space docks.',
      'Place 1 structure on a planet you control.',
    ],
    secondary: [
      'Spend 1 token from your strategy pool to place 1 structure on a planet you control.',
    ],
  },
  {
    id: 'trade',
    name: 'Trade',
    number: 5,
    primary: [
      'Gain 3 trade goods.',
      'Replenish commodities.',
      'Choose any number of other players. Those players use the secondary ability of this strategy card without spending a command token.',
    ],
    secondary: [
      'Spend 1 token from your strategy pool to replenish commodities.',
    ],
  },
  {
    id: 'warfare',
    name: 'Warfare',
    number: 6,
    primary: [
      'Perform a tactical action in any system without placing a command token, even if the system already has your command token in it; that system still counts as being activated. You may redistribute your command tokens before and after this action.',
    ],
    secondary: [
      'Spend 1 token from your strategy pool to use the PRODUCTION abilities of the units in your home system.',
    ],
  },
  {
    id: 'technology',
    name: 'Technology',
    number: 7,
    primary: [
      'Research 1 technology.',
      'Spend 6 resources to research 1 technology.',
    ],
    secondary: [
      'Spend 1 token from your strategy pool and 4 resources to research 1 technology.',
    ],
  },
  {
    id: 'imperial',
    name: 'Imperial',
    number: 8,
    primary: [
      'Immediately score 1 public objective if you fulfill its requirements.',
      'Gain 1 victory point if you control Mecatol Rex; otherwise, draw 1 secret objective.',
    ],
    secondary: [
      'Spend 1 token from your strategy pool to draw 1 secret objective.',
    ],
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
