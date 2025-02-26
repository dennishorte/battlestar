const cardData = [
  require('./Archery.js'),
  require('./Metalworking.js'),
  require('./Oars.js'),
  require('./Pottery.js'),
  require('./Tools.js'),
  require('./Writing.js'),
  require('./Clothing.js'),
  require('./Sailing.js'),
  require('./TheWheel.js'),
  require('./CityStates.js'),
  require('./CodeofLaws.js'),
  require('./Mysticism.js'),
  require('./Agriculture.js'),
  require('./Domestication.js'),
  require('./Masonry.js'),
  require('./RoadBuilding.js'),
  require('./Construction.js'),
  require('./Calendar.js'),
  require('./Mathematics.js'),
  require('./Mapmaking.js'),
  require('./Currency.js'),
  require('./Philosophy.js'),
  require('./Monotheism.js'),
  require('./Fermenting.js'),
  require('./CanalBuilding.js'),
  require('./Optics.js'),
  require('./Engineering.js'),
  require('./Translation.js'),
  require('./Alchemy.js'),
  require('./Paper.js'),
  require('./Compass.js'),
  require('./Education.js'),
  require('./Feudalism.js'),
  require('./Machinery.js'),
  require('./Medicine.js'),
  require('./Gunpowder.js'),
  require('./Colonialism.js'),
  require('./PrintingPress.js'),
  require('./Experimentation.js'),
  require('./Invention.js'),
  require('./Navigation.js'),
  require('./Perspective.js'),
  require('./Anatomy.js'),
  require('./Reformation.js'),
  require('./Enterprise.js'),
  require('./Coal.js'),
  require('./ThePirateCode.js'),
  require('./SteamEngine.js'),
  require('./Statistics.js'),
  require('./Physics.js'),
  require('./Chemistry.js'),
  require('./Measurement.js'),
  require('./Banking.js'),
  require('./Astronomy.js'),
  require('./Societies.js'),
  require('./Encyclopedia.js'),
  require('./AtomicTheory.js'),
  require('./Industrialization.js'),
  require('./MachineTools.js'),
  require('./Canning.js'),
  require('./Vaccination.js'),
  require('./Classification.js'),
  require('./MetricSystem.js'),
  require('./Democracy.js'),
  require('./Emancipation.js'),
  require('./Combustion.js'),
  require('./Explosives.js'),
  require('./Railroad.js'),
  require('./Lighting.js'),
  require('./Sanitation.js'),
  require('./Refrigeration.js'),
  require('./Evolution.js'),
  require('./Publications.js'),
  require('./Electricity.js'),
  require('./Bicycle.js'),
  require('./Corporations.js'),
  require('./Skyscrapers.js'),
  require('./Antibiotics.js'),
  require('./Flight.js'),
  require('./Mobility.js'),
  require('./Rocketry.js'),
  require('./QuantumTheory.js'),
  require('./Empiricism.js'),
  require('./MassMedia.js'),
  require('./Socialism.js'),
  require('./Composites.js'),
  require('./Fission.js'),
  require('./Services.js'),
  require('./Specialization.js'),
  require('./Satellites.js'),
  require('./Collaboration.js'),
  require('./Suburbia.js'),
  require('./Ecology.js'),
  require('./Genetics.js'),
  require('./Computers.js'),
  require('./Robotics.js'),
  require('./Miniturization.js'),
  require('./AI.js'),
  require('./TheInternet.js'),
  require('./StemCells.js'),
  require('./Globalization.js'),
  require('./Databases.js'),
  require('./SelfService.js'),
  require('./Software.js'),
  require('./Bioengineering.js')
]

const achievementData = [
  require('./achievements/Empire.js'),
  require('./achievements/Monument.js'),
  require('./achievements/World.js'),
  require('./achievements/Wonder.js'),
  require('./achievements/Universe.js'),
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
