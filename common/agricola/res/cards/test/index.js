// Test-only cards with no effects. Used to satisfy prereqs (e.g. "occupations: 2")
// without introducing side effects from real cards. Not available in real games.

const cardData = []

for (let i = 1; i <= 8; i++) {
  cardData.push({
    id: `test-occupation-${i}`,
    name: `Test Occupation ${i}`,
    deck: 'test',
    type: 'occupation',
    players: '1+',
    text: 'This card has no effect.',
  })
}

for (let i = 1; i <= 8; i++) {
  cardData.push({
    id: `test-minor-${i}`,
    name: `Test Minor ${i}`,
    deck: 'test',
    type: 'minor',
    text: 'This card has no effect.',
  })
}

function getCardById(id) {
  return cardData.find(c => c.id === id)
}

function getCardByName(name) {
  return cardData.find(c => c.name === name)
}

function getMinorImprovements() {
  return cardData.filter(c => c.type === 'minor')
}

function getOccupations() {
  return cardData.filter(c => c.type === 'occupation')
}

function getAllCards() {
  return [...cardData]
}

function getCardsByPlayerCount() {
  return getAllCards()
}

module.exports = {
  cardData,
  getCardById,
  getCardByName,
  getMinorImprovements,
  getOccupations,
  getAllCards,
  getCardsByPlayerCount,
}
