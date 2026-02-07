/**
 * Occupations C for Agricola (Revised Edition)
 * 84 occupations
 */

const DenBuilder = require('./DenBuilder.js')
const LivestockFeeder = require('./LivestockFeeder.js')
const Mason = require('./Mason.js')
const CarpentersApprentice = require('./CarpentersApprentice.js')
const StableMaster = require('./StableMaster.js')
const FieldWatchman = require('./FieldWatchman.js')
const PlowHero = require('./PlowHero.js')
const AutumnMother = require('./AutumnMother.js')
const InnerDistrictsDirector = require('./InnerDistrictsDirector.js')
const StableCleaner = require('./StableCleaner.js')
const BasketWeaver = require('./BasketWeaver.js')
const Merchant = require('./Merchant.js')
const SeedResearcher = require('./SeedResearcher.js')
const CubeCutter = require('./CubeCutter.js')
const GardenDesigner = require('./GardenDesigner.js')
const Butler = require('./Butler.js')
const StallHolder = require('./StallHolder.js')
const TreeGuard = require('./TreeGuard.js')
const GreenGrocer = require('./GreenGrocer.js')
const Collector = require('./Collector.js')
const BasketCarrier = require('./BasketCarrier.js')
const PotatoHarvester = require('./PotatoHarvester.js')
const Baker = require('./Baker.js')
const Layabout = require('./Layabout.js')
const SchnappsDistiller = require('./SchnappsDistiller.js')
const HomeBrewer = require('./HomeBrewer.js')
const SmallAnimalBreeder = require('./SmallAnimalBreeder.js')
const Thresher = require('./Thresher.js')
const WinterCaretaker = require('./WinterCaretaker.js')
const SoilScientist = require('./SoilScientist.js')
const Sower = require('./Sower.js')
const FurnitureMaker = require('./FurnitureMaker.js')
const Legworker = require('./Legworker.js')
const WoodCollector = require('./WoodCollector.js')
const SkillfulRenovator = require('./SkillfulRenovator.js')
const AgriculturalLabourer = require('./AgriculturalLabourer.js')
const ClayKneader = require('./ClayKneader.js')
const Bricklayer = require('./Bricklayer.js')
const Freemason = require('./Freemason.js')
const StoneImporter = require('./StoneImporter.js')
const Nightworker = require('./Nightworker.js')
const Excavator = require('./Excavator.js')
const Lover = require('./Lover.js')
const WoodenHutExtender = require('./WoodenHutExtender.js')
const SecondSpouse = require('./SecondSpouse.js')
const OutskirtsDirector = require('./OutskirtsDirector.js')
const PrivateTeacher = require('./PrivateTeacher.js')
const TimberShingleMaker = require('./TimberShingleMaker.js')
const Soldier = require('./Soldier.js')
const CowPrince = require('./CowPrince.js')
const Constable = require('./Constable.js')
const RanchProvost = require('./RanchProvost.js')
const CharcoalBurner = require('./CharcoalBurner.js')
const AnimalFeeder = require('./AnimalFeeder.js')
const BasketmakersWife = require('./BasketmakersWife.js')
const PackagingArtist = require('./PackagingArtist.js')
const SheepProvider = require('./SheepProvider.js')
const MarketCrier = require('./MarketCrier.js')
const StoneBuyer = require('./StoneBuyer.js')
const ReedRoofRenovator = require('./ReedRoofRenovator.js')
const ForestReviewer = require('./ForestReviewer.js')
const WorkshopAssistant = require('./WorkshopAssistant.js')
const Cowherd = require('./Cowherd.js')
const MudWallower = require('./MudWallower.js')
const ResourceRecycler = require('./ResourceRecycler.js')
const ParrotBreeder = require('./ParrotBreeder.js')
const SowingDirector = require('./SowingDirector.js')
const Puppeteer = require('./Puppeteer.js')
const PatternMaker = require('./PatternMaker.js')
const TwinResearcher = require('./TwinResearcher.js')
const FoodDistributor = require('./FoodDistributor.js')
const HoofCaregiver = require('./HoofCaregiver.js')
const ResourceAnalyzer = require('./ResourceAnalyzer.js')
const ForestCampaigner = require('./ForestCampaigner.js')
const FishermansFriend = require('./FishermansFriend.js')
const Outrider = require('./Outrider.js')
const PotatoDigger = require('./PotatoDigger.js')
const ForestOwner = require('./ForestOwner.js')
const MaterialDeliveryman = require('./MaterialDeliveryman.js')
const GermanHeathKeeper = require('./GermanHeathKeeper.js')
const GameCatcher = require('./GameCatcher.js')
const CattleWhisperer = require('./CattleWhisperer.js')
const CattleBuyer = require('./CattleBuyer.js')
const AnimalCatcher = require('./AnimalCatcher.js')

const cardData = [
  DenBuilder,
  LivestockFeeder,
  Mason,
  CarpentersApprentice,
  StableMaster,
  FieldWatchman,
  PlowHero,
  AutumnMother,
  InnerDistrictsDirector,
  StableCleaner,
  BasketWeaver,
  Merchant,
  SeedResearcher,
  CubeCutter,
  GardenDesigner,
  Butler,
  StallHolder,
  TreeGuard,
  GreenGrocer,
  Collector,
  BasketCarrier,
  PotatoHarvester,
  Baker,
  Layabout,
  SchnappsDistiller,
  HomeBrewer,
  SmallAnimalBreeder,
  Thresher,
  WinterCaretaker,
  SoilScientist,
  Sower,
  FurnitureMaker,
  Legworker,
  WoodCollector,
  SkillfulRenovator,
  AgriculturalLabourer,
  ClayKneader,
  Bricklayer,
  Freemason,
  StoneImporter,
  Nightworker,
  Excavator,
  Lover,
  WoodenHutExtender,
  SecondSpouse,
  OutskirtsDirector,
  PrivateTeacher,
  TimberShingleMaker,
  Soldier,
  CowPrince,
  Constable,
  RanchProvost,
  CharcoalBurner,
  AnimalFeeder,
  BasketmakersWife,
  PackagingArtist,
  SheepProvider,
  MarketCrier,
  StoneBuyer,
  ReedRoofRenovator,
  ForestReviewer,
  WorkshopAssistant,
  Cowherd,
  MudWallower,
  ResourceRecycler,
  ParrotBreeder,
  SowingDirector,
  Puppeteer,
  PatternMaker,
  TwinResearcher,
  FoodDistributor,
  HoofCaregiver,
  ResourceAnalyzer,
  ForestCampaigner,
  FishermansFriend,
  Outrider,
  PotatoDigger,
  ForestOwner,
  MaterialDeliveryman,
  GermanHeathKeeper,
  GameCatcher,
  CattleWhisperer,
  CattleBuyer,
  AnimalCatcher,
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
