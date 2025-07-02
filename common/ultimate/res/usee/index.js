const cardData = [
  require('./Assassination.js'),
  require('./Maze.js'),
  require('./Pilgrimage.js'),
  require('./Handshake.js'),
  require('./Tomb.js'),
  require('./Woodworking.js'),
  require('./Dance.js'),
  require('./Rumor.js'),
  require('./Silk.js'),
  require('./Espionage.js'),
  require('./Palmistry.js'),
  require('./Proverb.js'),
  require('./Myth.js'),
  require('./Polytheism.js'),
  require('./Symbology.js'),
  require('./Padlock.js'),
  require('./Password.js'),
  require('./Astrology.js'),
  require('./Fingerprints.js'),
  require('./Exile.js'),
  require('./Meteorology.js'),
  require('./Cipher.js'),
  require('./Counterfeiting.js'),
  require('./Steganography.js'),
  require('./Propaganda.js'),
  require('./KnightsTemplar.js'),
  require('./SecretPolice.js'),
  require('./SecretumSecretorum.js'),
  require('./Cliffhanger.js'),
  require('./RedEnvelope.js'),
  require('./Masquerade.js'),
  require('./Freemasons.js'),
  require('./Smuggling.js'),
  require('./Taqiyya.js'),
  require('./BrethrenofPurity.js'),
  require('./Ninja.js'),
  require('./Heirloom.js'),
  require('./TheProphecies.js'),
  require('./SpanishInquisition.js'),
  require('./Blackmail.js'),
  require('./Confession.js'),
  require('./AprilFoolsDay.js'),
  require('./ElDorado.js'),
  require('./Legend.js'),
  require('./Quackery.js'),
  require('./Gallery.js'),
  require('./Cabal.js'),
  require('./Probability.js'),
  require('./WitchTrial.js'),
  require('./BuriedTreasure.js'),
  require('./Pantheism.js'),
  require('./Chartreuse.js'),
  require('./SecretHistory.js'),
  require('./PenName.js'),
  require('./PopularScience.js'),
  require('./Sabotage.js'),
  require('./RedHerring.js'),
  require('./Reconnaissance.js'),
  require('./Sniping.js'),
  require('./Hiking.js'),
  require('./Illuminati.js'),
  require('./Attic.js'),
  require('./SwissBankAccount.js'),
  require('./Placebo.js'),
  require('./Triad.js'),
  require('./Camouflage.js'),
  require('./Subway.js'),
  require('./PrivateEye.js'),
  require('./SafeDepositBox.js'),
  require('./BlackMarket.js'),
  require('./FortuneCookie.js'),
  require('./Mafia.js'),
  require('./PlotVoucher.js'),
  require('./Counterintelligence.js'),
  require('./SlotMachine.js'),
  require('./Concealment.js'),
  require('./ShangriLa.js'),
  require('./Scouting.js'),
  require('./EnigmaMachine.js'),
  require('./Handbag.js'),
  require('./JoyBuzzer.js'),
  require('./Jackalope.js'),
  require('./Hitchhiking.js'),
  require('./Blacklight.js'),
  require('./OpusDei.js'),
  require('./Surveillance.js'),
  require('./IronCurtain.js'),
  require('./FermiParadox.js'),
  require('./McCarthyism.js'),
  require('./Area51.js'),
  require('./ClownCar.js'),
  require('./Magic8Ball.js'),
  require('./Teleprompter.js'),
  require('./Consulting.js'),
  require('./UrbanLegend.js'),
  require('./FightClub.js'),
  require('./Whatchamacallit.js'),
  require('./InhomogeneousCosmology.js'),
  require('./SecretSanta.js'),
  require('./Cryptocurrency.js'),
  require('./3DPrinting.js'),
  require('./RideHailing.js'),
  require('./DenverAirport.js'),
  require('./Hacking.js'),
  require('./OrderoftheOccultHand.js'),
  require('./Cloaking.js'),
  require('./FashionMask.js'),
  require('./QuantumComputers.js'),
  require('./DarkWeb.js'),
  require('./GreenHydrogen.js'),
  require('./Holography.js'),
  require('./EscapeRoom.js'),
  require('./MysteryBox.js'),
  require('./Astrobiology.js'),
  require('./Metaverse.js')
]

const achievementData = [
  require('./achievements/Anonymity.js'),
  require('./achievements/Confidence.js'),
  require('./achievements/Folklore.js'),
  require('./achievements/Mystery.js'),
  require('./achievements/Zen.js'),
]

const { UltimateCard } = require('../../UltimateCard.js')

function generateCardInstances() {
  const cards = cardData.map(data => new UltimateCard(data))
  const achievements = achievementData.map(f => new f())

  const byName = {}
  for (const card of cards) {
    byName[card.name] = card
  }
  for (const card of achievements) {
    byName[card.name] = card
  }

  const byAge = {}
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
