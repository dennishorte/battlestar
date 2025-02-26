const cardData = [
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
  require('./SeedDrill.js'),
  require('./Stethoscope.js'),
  require('./Dentures.js'),
  require('./HotAirBalloon.js'),
  require('./IndianClubs.js'),
  require('./Bifocals.js'),
  require('./Morphine.js'),
  require('./Steamboat.js'),
  require('./Kaleidoscope.js'),
  require('./Shrapnel.js'),
  require('./Loom.js'),
  require('./MachineGun.js'),
  require('./Typewriter.js'),
  require('./Telegraph.js'),
  require('./Elevator.js'),
  require('./Rubber.js'),
  require('./Saxophone.js'),
  require('./IceCream.js'),
  require('./Fertilizer.js'),
  require('./Photography.js'),
  require('./Jeans.js'),
  require('./Television.js'),
  require('./Bandage.js'),
  require('./Nylon.js'),
  require('./XRay.js'),
  require('./SlicedBread.js'),
  require('./AirConditioner.js'),
  require('./Crossword.js'),
  require('./Tractor.js'),
  require('./Parachute.js'),
  require('./RadioTelescope.js'),
  require('./Jet.js'),
  require('./Email.js'),
  require('./Calculator.js'),
  require('./Wristwatch.js'),
  require('./Karaoke.js'),
  require('./CreditCard.js'),
  require('./ATM.js'),
  require('./Rock.js'),
  require('./Helicopter.js'),
  require('./Laser.js'),
  require('./Sudoku.js'),
  require('./MP3.js'),
  require('./GPS.js'),
  require('./HumanGenome.js'),
  require('./FlashDrive.js'),
  require('./CellPhone.js'),
  require('./PuzzleCube.js'),
  require('./Camcorder.js'),
  require('./ArtificialHeart.js'),
  require('./SocialNetwork.js')
]

const achievementData = [
  require('./achievements/Destiny.js'),
  require('./achievements/Heritage.js'),
  require('./achievements/History.js'),
  require('./achievements/Supremacy.js'),
  require('./achievements/Wealth.js'),
]

function generateCardInstances() {
  const cards = cardData.map(f => new f())
  const achievements = achievementData.map(f => new f())

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
