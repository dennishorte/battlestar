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
  require('./Dice.js'),
  require('./Crossbow.js'),
  require('./Watermill.js'),
  require('./Toothbrush.js'),
  require('./Linguistics.js'),
  require('./Chaturanga.js'),
  require('./Scissors.js'),
  require('./Lever.js'),
  require('./Horseshoes.js'),
  require('./Pagoda.js'),
  require('./Glassblowing.js'),
  require('./Novel.js'),
  require('./Sunglasses.js'),
  require('./CharitableTrust.js'),
  require('./HomingPigeons.js'),
  require('./LiquidFire.js'),
  require('./Deodorant.js'),
  require('./Almanac.js'),
  require('./Katana.js'),
  require('./MagnifyingGlass.js'),
  require('./Sandpaper.js'),
  require('./Chintz.js'),
  require('./Globe.js'),
  require('./Clock.js'),
  require('./Shuriken.js'),
  require('./Barometer.js'),
  require('./Toilet.js'),
  require('./Telescope.js'),
  require('./SlideRule.js'),
  require('./Pencil.js'),
  require('./Kobukson.js'),
  require('./Thermometer.js'),
  require('./Coke.js'),
  require('./Palampore.js'),
  require('./Stove.js'),
  require('./LightningRod.js'),
  require('./TuningFork.js'),
  require('./PressureCooker.js'),
  require('./Piano.js'),
  require('./Octant.js'),
  require('./SeedDrill.js')
].map(f => new f())

const achievements = [
  require('./achievements/Destiny.js'),
  require('./achievements/Heritage.js'),
  require('./achievements/History.js'),
  require('./achievements/Supremacy.js'),
  require('./achievements/Wealth.js'),
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
