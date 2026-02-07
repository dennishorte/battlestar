/**
 * Minor Improvements A for Agricola (Revised Edition)
 * 84 minor improvements
 */

const Shelter = require('./Shelter.js')
const ShiftingCultivation = require('./ShiftingCultivation.js')
const PaperKnife = require('./PaperKnife.js')
const Baseboards = require('./Baseboards.js')
const ClayEmbankment = require('./ClayEmbankment.js')
const StorageBarn = require('./StorageBarn.js')
const GardenersKnife = require('./GardenersKnife.js')
const FoodBasket = require('./FoodBasket.js')
const YoungAnimalMarket = require('./YoungAnimalMarket.js')
const WoodenShed = require('./WoodenShed.js')
const MudPatch = require('./MudPatch.js')
const DrinkingTrough = require('./DrinkingTrough.js')
const RenovationCompany = require('./RenovationCompany.js')
const CarpentersHammer = require('./CarpentersHammer.js')
const CarpentersAxe = require('./CarpentersAxe.js')
const RammedClay = require('./RammedClay.js')
const ReclamationPlow = require('./ReclamationPlow.js')
const WheelPlow = require('./WheelPlow.js')
const Handplow = require('./Handplow.js')
const DoubleTurnPlow = require('./DoubleTurnPlow.js')
const FamilyFriendlyHome = require('./FamilyFriendlyHome.js')
const Telegram = require('./Telegram.js')
const StoneCompany = require('./StoneCompany.js')
const ThreshingBoard = require('./ThreshingBoard.js')
const Bassinet = require('./Bassinet.js')
const SleepingCorner = require('./SleepingCorner.js')
const OvenSite = require('./OvenSite.js')
const ForestSchool = require('./ForestSchool.js')
const AleBenches = require('./AleBenches.js')
const BakingSheet = require('./BakingSheet.js')
const DebtSecurity = require('./DebtSecurity.js')
const Manger = require('./Manger.js')
const BigCountry = require('./BigCountry.js')
const Loppers = require('./Loppers.js')
const SwimmingClass = require('./SwimmingClass.js')
const FacadesCarving = require('./FacadesCarving.js')
const Bucksaw = require('./Bucksaw.js')
const WoolBlankets = require('./WoolBlankets.js')
const Chapel = require('./Chapel.js')
const PottersYard = require('./PottersYard.js')
const VegetableSlicer = require('./VegetableSlicer.js')
const ForestLakeHut = require('./ForestLakeHut.js')
const FarmyardManure = require('./FarmyardManure.js')
const PondHut = require('./PondHut.js')
const FireProtectionPond = require('./FireProtectionPond.js')
const ClawKnife = require('./ClawKnife.js')
const Trellises = require('./Trellises.js')
const ShavingHorse = require('./ShavingHorse.js')
const NestSite = require('./NestSite.js')
const MilkJug = require('./MilkJug.js')
const DriftNetBoat = require('./DriftNetBoat.js')
const ThrowingAxe = require('./ThrowingAxe.js')
const Claypipe = require('./Claypipe.js')
const Credit = require('./Credit.js')
const JunkRoom = require('./JunkRoom.js')
const Basket = require('./Basket.js')
const MilkingParlor = require('./MilkingParlor.js')
const AsparagusKnife = require('./AsparagusKnife.js')
const PotatoRidger = require('./PotatoRidger.js')
const OrientalFireplace = require('./OrientalFireplace.js')
const WinnowingFan = require('./WinnowingFan.js')
const BeerKeg = require('./BeerKeg.js')
const DutchWindmill = require('./DutchWindmill.js')
const BarleyMill = require('./BarleyMill.js')
const SeedPellets = require('./SeedPellets.js')
const FeedingDish = require('./FeedingDish.js')
const CornScoop = require('./CornScoop.js')
const AsparagusGift = require('./AsparagusGift.js')
const LargeGreenhouse = require('./LargeGreenhouse.js')
const LiftingMachine = require('./LiftingMachine.js')
const ClearingSpade = require('./ClearingSpade.js')
const CalciumFertilizers = require('./CalciumFertilizers.js')
const AgriculturalFertilizers = require('./AgriculturalFertilizers.js')
const StableTree = require('./StableTree.js')
const LumberMill = require('./LumberMill.js')
const Cob = require('./Cob.js')
const Hod = require('./Hod.js')
const Canoe = require('./Canoe.js')
const GardenHoe = require('./GardenHoe.js')
const StoneTongs = require('./StoneTongs.js')
const InterimStorage = require('./InterimStorage.js')
const WorkCertificate = require('./WorkCertificate.js')
const ShepherdsCrook = require('./ShepherdsCrook.js')
const Silage = require('./Silage.js')

const cardData = [
  Shelter,
  ShiftingCultivation,
  PaperKnife,
  Baseboards,
  ClayEmbankment,
  StorageBarn,
  GardenersKnife,
  FoodBasket,
  YoungAnimalMarket,
  WoodenShed,
  MudPatch,
  DrinkingTrough,
  RenovationCompany,
  CarpentersHammer,
  CarpentersAxe,
  RammedClay,
  ReclamationPlow,
  WheelPlow,
  Handplow,
  DoubleTurnPlow,
  FamilyFriendlyHome,
  Telegram,
  StoneCompany,
  ThreshingBoard,
  Bassinet,
  SleepingCorner,
  OvenSite,
  ForestSchool,
  AleBenches,
  BakingSheet,
  DebtSecurity,
  Manger,
  BigCountry,
  Loppers,
  SwimmingClass,
  FacadesCarving,
  Bucksaw,
  WoolBlankets,
  Chapel,
  PottersYard,
  VegetableSlicer,
  ForestLakeHut,
  FarmyardManure,
  PondHut,
  FireProtectionPond,
  ClawKnife,
  Trellises,
  ShavingHorse,
  NestSite,
  MilkJug,
  DriftNetBoat,
  ThrowingAxe,
  Claypipe,
  Credit,
  JunkRoom,
  Basket,
  MilkingParlor,
  AsparagusKnife,
  PotatoRidger,
  OrientalFireplace,
  WinnowingFan,
  BeerKeg,
  DutchWindmill,
  BarleyMill,
  SeedPellets,
  FeedingDish,
  CornScoop,
  AsparagusGift,
  LargeGreenhouse,
  LiftingMachine,
  ClearingSpade,
  CalciumFertilizers,
  AgriculturalFertilizers,
  StableTree,
  LumberMill,
  Cob,
  Hod,
  Canoe,
  GardenHoe,
  StoneTongs,
  InterimStorage,
  WorkCertificate,
  ShepherdsCrook,
  Silage,
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
