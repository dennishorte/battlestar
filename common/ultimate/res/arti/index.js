const cardData = [
  require('./HolmegaardBows.js'),
  require('./PapyrusofAni.js'),
  require('./PavlovianTusk.js'),
  require('./DancingGirl.js'),
  require('./LurganCanoe.js'),
  require('./XianrendongShards.js'),
  require('./PriestKing.js'),
  require('./ElectrumStaterofEfesos.js'),
  require('./JiskairumokoNecklace.js'),
  require('./TreatyofKadesh.js'),
  require('./SibiduNeedle.js'),
  require('./BasurHoyukTokens.js'),
  require('./MaskofWarka.js'),
  require('./ArkoftheCovenant.js'),
  require('./TaleoftheShipwreckedSailor.js'),
  require('./ChronicleofZuo.js'),
  require('./BabylonianChronicles.js'),
  require('./HolyGrail.js'),
  require('./TerracottaArmy.js'),
  require('./HolyLance.js'),
  require('./BaghdadBattery.js'),
  require('./SeikilosEpitaph.js'),
  require('./RosettaStone.js'),
  require('./DeadSeaScrolls.js'),
  require('./CyrusCylinder.js'),
  require('./Excalibur.js'),
  require('./MjolnirAmulet.js'),
  require('./MoyloughBeltShrine.js'),
  require('./AlongtheRiverduringtheQingmingFestival.js'),
  require('./PhilosophersStone.js'),
  require('./BeauvaisCathedralClock.js'),
  require('./DunhuangStarChart.js'),
  require('./CharterofLiberties.js'),
  require('./Necronomicon.js'),
  require('./ShroudofTurin.js'),
  require('./EastIndiaCompanyCharter.js'),
  require('./TortugasGalleon.js'),
  require('./Moses.js'),
  require('./MonaLisa.js'),
  require('./MolassesReefCaravel.js'),
  require('./HuntLennoxGlobe.js'),
  require('./PetitionofRights.js'),
  require('./DelftPocketTelescope.js'),
  require('./CrossofCoronado.js'),
  require('./AbellGalleryHarpsichord.js'),
  require('./BillofRights.js'),
  require('./ShipoftheLineSussex.js'),
  require('./GujinTushuJinsheng.js'),
  require('./TheDailyCourant.js'),
  require('./BaroqueLonguelaBelle.js'),
  require('./HudsonsBayCompanyArchives.js'),
  require('./BoerhavveSilverMicroscope.js'),
  require('./Principa.js'),
  require('./SandhamRoomCricketBat.js'),
  require('./AlmiraQueenoftheCastle.js'),
  require('./FrigateConstitution.js'),
  require('./USDeclarationofIndependence.js'),
  require('./StampAct.js'),
  require('./PrideandPrejudice.js'),
  require('./TheWealthofNations.js'),
  require('./ButtonwoodAgreement.js'),
  require('./KilogramoftheArchives.js'),
  require('./PuffingBilly.js'),
  require('./MoonlightSonata.js'),
  require('./MarchaReal.js'),
  require('./SubmarineHLHunley.js'),
  require('./JedliksElectromagneticSelfRotor.js'),
  require('./ColtPatersonRevolver.js'),
  require('./SingleModel27.js'),
  require('./InternationalPrototypeMetreBar.js'),
  require('./HansenWritingBall.js'),
  require('./PeriodicTable.js'),
  require('./CorvetteChallenger.js'),
  require('./RoundhayGardenScene.js'),
  require('./TheCommunistManifesto.js'),
  require('./BattleshipBismark.js'),
  require('./BattleshipYamato.js'),
  require('./PlushBeweglichRodBear.js'),
  require('./Time.js'),
  require('./OceanLinerTitanic.js'),
  require('./MejiMuraStampVendingMachine.js'),
  require('./ParnellPitchDrop.js'),
  require('./EarhartsLockheedElectra10E.js'),
  require('./GarlandsRubySlippers.js'),
  require('./30WorldCupFinalBall.js'),
  require('./UnitedNationsCharter.js'),
  require('./VelcroShoes.js'),
  require('./RockAroundtheClock.js'),
  require('./MagnavoxOdyssey.js'),
  require('./PhilipsCompactCassette.js'),
  require('./Syncom3.js'),
  require('./YeagersBellX1A.js'),
  require('./Luna3.js'),
  require('./TheBigBang.js'),
  require('./MarilynDiptych.js'),
  require('./ExxonValdez.js'),
  require('./Maldives.js'),
  require('./DollytheSheep.js'),
  require('./WheresWaldo.js'),
  require('./MaastrichtTreaty.js'),
  require('./SeikanTunnel.js'),
  require('./RoverCuriosity.js'),
  require('./HiggsBoson.js'),
  require('./DeLoreanDMC12.js'),
  require('./Twister.js')
]

const achievementData = [
  require('./achievements/Timbuktu.js'),
  require('./achievements/ComplexNumbers.js'),
  require('./achievements/NewtonWickinsTelescope.js'),
  require('./achievements/ChingShih.js'),
  require('./achievements/SafetyPin.js'),
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
