/**
 * Occupations A for Agricola (Revised Edition)
 * 84 occupations
 */

const Homekeeper = require('./Homekeeper.js')
const AnimalTamer = require('./AnimalTamer.js')
const Conservator = require('./Conservator.js')
const HedgeKeeper = require('./HedgeKeeper.js')
const StablePlanner = require('./StablePlanner.js')
const PlowDriver = require('./PlowDriver.js')
const ShiftingCultivator = require('./ShiftingCultivator.js')
const AdoptiveParents = require('./AdoptiveParents.js')
const BedMaker = require('./BedMaker.js')
const LazySowman = require('./LazySowman.js')
const Angler = require('./Angler.js')
const TaskArtisan = require('./TaskArtisan.js')
const Freshman = require('./Freshman.js')
const StableArchitect = require('./StableArchitect.js')
const FellowGrazer = require('./FellowGrazer.js')
const Curator = require('./Curator.js')
const CookeryOutfitter = require('./CookeryOutfitter.js')
const Grocer = require('./Grocer.js')
const Portmonger = require('./Portmonger.js')
const WoodHarvester = require('./WoodHarvester.js')
const BarrowPusher = require('./BarrowPusher.js')
const SlurrySpreader = require('./SlurrySpreader.js')
const Catcher = require('./Catcher.js')
const MushroomCollector = require('./MushroomCollector.js')
const SmallTrader = require('./SmallTrader.js')
const Roughcaster = require('./Roughcaster.js')
const WallBuilder = require('./WallBuilder.js')
const ScytheWorker = require('./ScytheWorker.js')
const HeresyTeacher = require('./HeresyTeacher.js')
const SeasonalWorker = require('./SeasonalWorker.js')
const ChiefForester = require('./ChiefForester.js')
const WoodCutter = require('./WoodCutter.js')
const WoodCarrier = require('./WoodCarrier.js')
const Treegardener = require('./Treegardener.js')
const FirewoodCollector = require('./FirewoodCollector.js')
const ClayHutBuilder = require('./ClayHutBuilder.js')
const ClayPuncher = require('./ClayPuncher.js')
const PanBaker = require('./PanBaker.js')
const FrameBuilder = require('./FrameBuilder.js')
const Knapper = require('./Knapper.js')
const Priest = require('./Priest.js')
const MasterWorkman = require('./MasterWorkman.js')
const Lodger = require('./Lodger.js')
const RiparianBuilder = require('./RiparianBuilder.js')
const Swagman = require('./Swagman.js')
const MummysBoy = require('./MummysBoy.js')
const CraftTeacher = require('./CraftTeacher.js')
const Publican = require('./Publican.js')
const Braggart = require('./Braggart.js')
const FullFarmer = require('./FullFarmer.js')
const AnimalReeve = require('./AnimalReeve.js')
const DrudgeryReeve = require('./DrudgeryReeve.js')
const RiverineShepherd = require('./RiverineShepherd.js')
const Harpooner = require('./Harpooner.js')
const HollowWarden = require('./HollowWarden.js')
const ShovelBearer = require('./ShovelBearer.js')
const TurnipFarmer = require('./TurnipFarmer.js')
const Cordmaker = require('./Cordmaker.js')
const Stonecutter = require('./Stonecutter.js')
const Sequestrator = require('./Sequestrator.js')
const Ropemaker = require('./Ropemaker.js')
const StorehouseSteward = require('./StorehouseSteward.js')
const AnimalDealer = require('./AnimalDealer.js')
const Woolgrower = require('./Woolgrower.js')
const HouseArtist = require('./HouseArtist.js')
const Stagehand = require('./Stagehand.js')
const Minstrel = require('./Minstrel.js')
const NightSchoolStudent = require('./NightSchoolStudent.js')
const PigOwner = require('./PigOwner.js')
const Paymaster = require('./Paymaster.js')
const Conjurer = require('./Conjurer.js')
const Buyer = require('./Buyer.js')
const Bohemian = require('./Bohemian.js')
const CulinaryArtist = require('./CulinaryArtist.js')
const JoinerOfTheSea = require('./JoinerOfTheSea.js')
const Lutenist = require('./Lutenist.js')
const PatchCaretaker = require('./PatchCaretaker.js')
const ForestTallyman = require('./ForestTallyman.js')
const BuildingExpert = require('./BuildingExpert.js')
const WoodWorker = require('./WoodWorker.js')
const PigBreeder = require('./PigBreeder.js')
const Haydryer = require('./Haydryer.js')
const BreederBuyer = require('./BreederBuyer.js')
const AnimalTeacher = require('./AnimalTeacher.js')

const cardData = [
  Homekeeper,
  AnimalTamer,
  Conservator,
  HedgeKeeper,
  StablePlanner,
  PlowDriver,
  ShiftingCultivator,
  AdoptiveParents,
  BedMaker,
  LazySowman,
  Angler,
  TaskArtisan,
  Freshman,
  StableArchitect,
  FellowGrazer,
  Curator,
  CookeryOutfitter,
  Grocer,
  Portmonger,
  WoodHarvester,
  BarrowPusher,
  SlurrySpreader,
  Catcher,
  MushroomCollector,
  SmallTrader,
  Roughcaster,
  WallBuilder,
  ScytheWorker,
  HeresyTeacher,
  SeasonalWorker,
  ChiefForester,
  WoodCutter,
  WoodCarrier,
  Treegardener,
  FirewoodCollector,
  ClayHutBuilder,
  ClayPuncher,
  PanBaker,
  FrameBuilder,
  Knapper,
  Priest,
  MasterWorkman,
  Lodger,
  RiparianBuilder,
  Swagman,
  MummysBoy,
  CraftTeacher,
  Publican,
  Braggart,
  FullFarmer,
  AnimalReeve,
  DrudgeryReeve,
  RiverineShepherd,
  Harpooner,
  HollowWarden,
  ShovelBearer,
  TurnipFarmer,
  Cordmaker,
  Stonecutter,
  Sequestrator,
  Ropemaker,
  StorehouseSteward,
  AnimalDealer,
  Woolgrower,
  HouseArtist,
  Stagehand,
  Minstrel,
  NightSchoolStudent,
  PigOwner,
  Paymaster,
  Conjurer,
  Buyer,
  Bohemian,
  CulinaryArtist,
  JoinerOfTheSea,
  Lutenist,
  PatchCaretaker,
  ForestTallyman,
  BuildingExpert,
  WoodWorker,
  PigBreeder,
  Haydryer,
  BreederBuyer,
  AnimalTeacher,
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
