/**
 * Occupations E for Agricola (Revised Edition)
 * 84 occupations
 */

const MasterTanner = require('./MasterTanner.js')
const PenBuilder = require('./PenBuilder.js')
const MasterRenovator = require('./MasterRenovator.js')
const MasterFencer = require('./MasterFencer.js')
const Stallwright = require('./Stallwright.js')
const DungCollector = require('./DungCollector.js')
const PlowBuilder = require('./PlowBuilder.js')
const FieldDoctor = require('./FieldDoctor.js')
const Motivator = require('./Motivator.js')
const Prophet = require('./Prophet.js')
const Miller = require('./Miller.js')
const Elder = require('./Elder.js')
const Beneficiary = require('./Beneficiary.js')
const Prodigy = require('./Prodigy.js')
const UncaringParents = require('./UncaringParents.js')
const MuseumCaretaker = require('./MuseumCaretaker.js')
const Blighter = require('./Blighter.js')
const Acquirer = require('./Acquirer.js')
const Wolf = require('./Wolf.js')
const SpiceTrader = require('./SpiceTrader.js')
const Pioneer = require('./Pioneer.js')
const EmergencySeller = require('./EmergencySeller.js')
const LandSurveyor = require('./LandSurveyor.js')
const BlackberryFarmer = require('./BlackberryFarmer.js')
const BraidMaker = require('./BraidMaker.js')
const Dentist = require('./Dentist.js')
const Recluse = require('./Recluse.js')
const GrainThief = require('./GrainThief.js')
const Godmother = require('./Godmother.js')
const ShedBuilder = require('./ShedBuilder.js')
const SeedServant = require('./SeedServant.js')
const FirCutter = require('./FirCutter.js')
const PipeSmoker = require('./PipeSmoker.js')
const KindlingGatherer = require('./KindlingGatherer.js')
const LandHeir = require('./LandHeir.js')
const ScrapCollector = require('./ScrapCollector.js')
const HillCultivator = require('./HillCultivator.js')
const Cottar = require('./Cottar.js')
const ResourceHoarder = require('./ResourceHoarder.js')
const MayorCandidate = require('./MayorCandidate.js')
const DelayedWayfarer = require('./DelayedWayfarer.js')
const TaxCollector = require('./TaxCollector.js')
const DiligentFarmer = require('./DiligentFarmer.js')
const Saddler = require('./Saddler.js')
const Imitator = require('./Imitator.js')
const Overachiever = require('./Overachiever.js')
const MarketMaster = require('./MarketMaster.js')
const VeggieLover = require('./VeggieLover.js')
const ChampionBreeder = require('./ChampionBreeder.js')
const Omnifarmer = require('./Omnifarmer.js')
const Pickler = require('./Pickler.js')
const AnimalHusbandryWorker = require('./AnimalHusbandryWorker.js')
const FlaxFarmer = require('./FlaxFarmer.js')
const LivestockExpert = require('./LivestockExpert.js')
const BunnyBreeder = require('./BunnyBreeder.js')
const Carter = require('./Carter.js')
const VegetableVendor = require('./VegetableVendor.js')
const Smuggler = require('./Smuggler.js')
const Hewer = require('./Hewer.js')
const WaresSalesman = require('./WaresSalesman.js')
const Parvenu = require('./Parvenu.js')
const Reseller = require('./Reseller.js')
const AnimalDriver = require('./AnimalDriver.js')
const Lazybones = require('./Lazybones.js')
const MidnightFencer = require('./MidnightFencer.js')
const RockBeater = require('./RockBeater.js')
const DeliveryNurse = require('./DeliveryNurse.js')
const BargainHunter = require('./BargainHunter.js')
const StoneSculptor = require('./StoneSculptor.js')
const Margrave = require('./Margrave.js')
const Visionary = require('./Visionary.js')
const ClaypitOwner = require('./ClaypitOwner.js')
const Usufructuary = require('./Usufructuary.js')
const StoneCustodian = require('./StoneCustodian.js')
const OldMiser = require('./OldMiser.js')
const KelpGatherer = require('./KelpGatherer.js')
const ElderBaker = require('./ElderBaker.js')
const Entrepreneur = require('./Entrepreneur.js')
const Patroness = require('./Patroness.js')
const MountainPlowman = require('./MountainPlowman.js')
const MasterHuntsman = require('./MasterHuntsman.js')
const Roastmaster = require('./Roastmaster.js')
const DairyCrier = require('./DairyCrier.js')
const AnimalTamersApprentice = require('./AnimalTamersApprentice.js')

const cardData = [
  MasterTanner,
  PenBuilder,
  MasterRenovator,
  MasterFencer,
  Stallwright,
  DungCollector,
  PlowBuilder,
  FieldDoctor,
  Motivator,
  Prophet,
  Miller,
  Elder,
  Beneficiary,
  Prodigy,
  UncaringParents,
  MuseumCaretaker,
  Blighter,
  Acquirer,
  Wolf,
  SpiceTrader,
  Pioneer,
  EmergencySeller,
  LandSurveyor,
  BlackberryFarmer,
  BraidMaker,
  Dentist,
  Recluse,
  GrainThief,
  Godmother,
  ShedBuilder,
  SeedServant,
  FirCutter,
  PipeSmoker,
  KindlingGatherer,
  LandHeir,
  ScrapCollector,
  HillCultivator,
  Cottar,
  ResourceHoarder,
  MayorCandidate,
  DelayedWayfarer,
  TaxCollector,
  DiligentFarmer,
  Saddler,
  Imitator,
  Overachiever,
  MarketMaster,
  VeggieLover,
  ChampionBreeder,
  Omnifarmer,
  Pickler,
  AnimalHusbandryWorker,
  FlaxFarmer,
  LivestockExpert,
  BunnyBreeder,
  Carter,
  VegetableVendor,
  Smuggler,
  Hewer,
  WaresSalesman,
  Parvenu,
  Reseller,
  AnimalDriver,
  Lazybones,
  MidnightFencer,
  RockBeater,
  DeliveryNurse,
  BargainHunter,
  StoneSculptor,
  Margrave,
  Visionary,
  ClaypitOwner,
  Usufructuary,
  StoneCustodian,
  OldMiser,
  KelpGatherer,
  ElderBaker,
  Entrepreneur,
  Patroness,
  MountainPlowman,
  MasterHuntsman,
  Roastmaster,
  DairyCrier,
  AnimalTamersApprentice,
]

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

function getCardsByPlayerCount(playerCount) {
  return getAllCards().filter(card => {
    if (!card.players) {
      return true
    }
    const minPlayers = parseInt(card.players)
    return playerCount >= minPlayers
  })
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
