const cards = [
  require('./Plumbing.js')
].map(f => new f())

const achievements = [
  require('./achievements/Destiny'),
  require('./achievements/Heritage'),
  require('./achievements/History'),
  require('./achievements/Supremacy'),
  require('./achievements/Wealth'),
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
