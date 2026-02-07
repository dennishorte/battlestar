/**
 * Occupations D for Agricola (Revised Edition)
 * 84 occupations
 */

const Reader = require('./Reader.js')
const SheepAgent = require('./SheepAgent.js')
const MasterBuilder = require('./MasterBuilder.js')
const Millwright = require('./Millwright.js')
const Stablehand = require('./Stablehand.js')
const PlowMaker = require('./PlowMaker.js')
const Plowman = require('./Plowman.js')
const ChildOmbudsman = require('./ChildOmbudsman.js')
const SheepInspector = require('./SheepInspector.js')
const HenpeckedHusband = require('./HenpeckedHusband.js')
const SiteManager = require('./SiteManager.js')
const Furnisher = require('./Furnisher.js')
const BeggingStudent = require('./BeggingStudent.js')
const Transactor = require('./Transactor.js')
const EarthenwarePotter = require('./EarthenwarePotter.js')
const LordOfTheManor = require('./LordOfTheManor.js')
const SugarBaker = require('./SugarBaker.js')
const SampleStableMaker = require('./SampleStableMaker.js')
const CanalBoatman = require('./CanalBoatman.js')
const Cultivator = require('./Cultivator.js')
const Sculptor = require('./Sculptor.js')
const WhiskyDistiller = require('./WhiskyDistiller.js')
const Bellfounder = require('./Bellfounder.js')
const StoneCarver = require('./StoneCarver.js')
const SowingMaster = require('./SowingMaster.js')
const FishFarmer = require('./FishFarmer.js')
const InteriorDecorator = require('./InteriorDecorator.js')
const YoungFarmer = require('./YoungFarmer.js')
const FoodMerchant = require('./FoodMerchant.js')
const SeedTrader = require('./SeedTrader.js')
const FodderPlanter = require('./FodderPlanter.js')
const TreeInspector = require('./TreeInspector.js')
const WoodExpert = require('./WoodExpert.js')
const Bonehead = require('./Bonehead.js')
const WoodBarterer = require('./WoodBarterer.js')
const ClayDeliveryman = require('./ClayDeliveryman.js')
const ClayPlasterer = require('./ClayPlasterer.js')
const ClayCarrier = require('./ClayCarrier.js')
const RenovationPreparer = require('./RenovationPreparer.js')
const Emissary = require('./Emissary.js')
const ForestTrader = require('./ForestTrader.js')
const FieldCultivator = require('./FieldCultivator.js')
const HardworkingMan = require('./HardworkingMan.js')
const BuildingTycoon = require('./BuildingTycoon.js')
const LumberVirtuoso = require('./LumberVirtuoso.js')
const RecreationalCarpenter = require('./RecreationalCarpenter.js')
const CraftsmanshipPromoter = require('./CraftsmanshipPromoter.js')
const HideFarmer = require('./HideFarmer.js')
const BeerTentOperator = require('./BeerTentOperator.js')
const OysterEater = require('./OysterEater.js')
const GardeningHeadOfficial = require('./GardeningHeadOfficial.js')
const AnimalActivist = require('./AnimalActivist.js')
const TradeTeacher = require('./TradeTeacher.js')
const PetLover = require('./PetLover.js')
const Chairman = require('./Chairman.js')
const Loudmouth = require('./Loudmouth.js')
const SeedSeller = require('./SeedSeller.js')
const PotatoPlanter = require('./PotatoPlanter.js')
const TreeCutter = require('./TreeCutter.js')
const WaterWorker = require('./WaterWorker.js')
const RoofExaminer = require('./RoofExaminer.js')
const Porter = require('./Porter.js')
const TrapBuilder = require('./TrapBuilder.js')
const DomesticianExpert = require('./DomesticianExpert.js')
const CasualWorker = require('./CasualWorker.js')
const GodlySpouse = require('./GodlySpouse.js')
const SpinDoctor = require('./SpinDoctor.js')
const Patron = require('./Patron.js')
const WealthyMan = require('./WealthyMan.js')
const ChimneySweep = require('./ChimneySweep.js')
const Ebonist = require('./Ebonist.js')
const RetailDealer = require('./RetailDealer.js')
const PartyOrganizer = require('./PartyOrganizer.js')
const BeanCounter = require('./BeanCounter.js')
const ReedSeller = require('./ReedSeller.js')
const Midwife = require('./Midwife.js')
const CabbageBuyer = require('./CabbageBuyer.js')
const ClayFirer = require('./ClayFirer.js')
const JourneymanBricklayer = require('./JourneymanBricklayer.js')
const PetGrower = require('./PetGrower.js')
const PigStalker = require('./PigStalker.js')
const StableMilker = require('./StableMilker.js')
const PureBreeder = require('./PureBreeder.js')
const Stockman = require('./Stockman.js')

const cardData = [
  Reader,
  SheepAgent,
  MasterBuilder,
  Millwright,
  Stablehand,
  PlowMaker,
  Plowman,
  ChildOmbudsman,
  SheepInspector,
  HenpeckedHusband,
  SiteManager,
  Furnisher,
  BeggingStudent,
  Transactor,
  EarthenwarePotter,
  LordOfTheManor,
  SugarBaker,
  SampleStableMaker,
  CanalBoatman,
  Cultivator,
  Sculptor,
  WhiskyDistiller,
  Bellfounder,
  StoneCarver,
  SowingMaster,
  FishFarmer,
  InteriorDecorator,
  YoungFarmer,
  FoodMerchant,
  SeedTrader,
  FodderPlanter,
  TreeInspector,
  WoodExpert,
  Bonehead,
  WoodBarterer,
  ClayDeliveryman,
  ClayPlasterer,
  ClayCarrier,
  RenovationPreparer,
  Emissary,
  ForestTrader,
  FieldCultivator,
  HardworkingMan,
  BuildingTycoon,
  LumberVirtuoso,
  RecreationalCarpenter,
  CraftsmanshipPromoter,
  HideFarmer,
  BeerTentOperator,
  OysterEater,
  GardeningHeadOfficial,
  AnimalActivist,
  TradeTeacher,
  PetLover,
  Chairman,
  Loudmouth,
  SeedSeller,
  PotatoPlanter,
  TreeCutter,
  WaterWorker,
  RoofExaminer,
  Porter,
  TrapBuilder,
  DomesticianExpert,
  CasualWorker,
  GodlySpouse,
  SpinDoctor,
  Patron,
  WealthyMan,
  ChimneySweep,
  Ebonist,
  RetailDealer,
  PartyOrganizer,
  BeanCounter,
  ReedSeller,
  Midwife,
  CabbageBuyer,
  ClayFirer,
  JourneymanBricklayer,
  PetGrower,
  PigStalker,
  StableMilker,
  PureBreeder,
  Stockman,
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
