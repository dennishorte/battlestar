const cards = [
  {0}
].map(f => new f())


const achievementData = [
]

function generateCardInstances() {
  const cards = cardData.map(f => new f())
  const achievements = achievementData.map(f => new f())

  const byName = {{}}
  for (const card of cards) {
    byName[card.name] = card
  }
  for (const card of achievements) {
    byName[card.name] = card
  }

  const byAge = {{}}
  for (const i of [1,2,3,4,5,6,7,8,9,10,11]) {
    byAge[i] = []
  }
  for (const card of cards) {
    byAge[card.age].push(card)
  }

  return {
    achievements,
    cards,
    byName,
    byAge,
  }
}

module.exports = {
  cardData,
  achievementData,
  generateCardInstances
}
