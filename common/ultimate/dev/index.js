const cards = [
  require('./Plumbing.js'),
  require('./Ruler.js'),
  require('./Umbrella.js'),
  require('./Bangle.js'),
  require('./Chopsticks.js'),
  require('./Perfume.js'),
  require('./Flute.js'),
  require('./IceSkates.js'),
  require('./Puppet.js'),
  require('./Soap.js'),
  require('./Candles.js'),
  require('./Comb.js'),
  require('./Noodles.js'),
  require('./Bell.js'),
  require('./Dice.js')
].map(f => new f())

const byName = {}
for (const card of cards) {
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
  cards,
  byName,
  byAge,
}
