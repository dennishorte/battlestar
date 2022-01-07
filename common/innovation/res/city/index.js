const cards = [
  require('./Athens.js')
].map(f => new f())

const achievements = [
].map(f => new f())

const byName = {}
for (const card of cards) {
  byName[card.name] = card
}
for (const card of achievements) {
  byName[card.name] = card
}

const byAge = {}
for (const i of [1,2,3,4,5,6,7,8,9,10]) {
  byAge[i] = []
}
for (const card of cards) {
  byAge[card.age].push(card)
}

module.exports = {
  achievements,
  cards,
  byName,
  byAge,
}
