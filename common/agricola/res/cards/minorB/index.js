/**
 * Minor Improvements B for Agricola (Revised Edition)
 * 84 minor improvements
 */

const UpscaleLifestyle = require('./UpscaleLifestyle.js')
const MiniPasture = require('./MiniPasture.js')
const Moonshine = require('./Moonshine.js')
const WoodPile = require('./WoodPile.js')
const StoreOfExperience = require('./StoreOfExperience.js')
const ExcursionToTheQuarry = require('./ExcursionToTheQuarry.js')
const Wage = require('./Wage.js')
const MarketStall = require('./MarketStall.js')
const BeatingRod = require('./BeatingRod.js')
const Caravan = require('./Caravan.js')
const Feedyard = require('./Feedyard.js')
const Stockyard = require('./Stockyard.js')
const CarpentersParlor = require('./CarpentersParlor.js')
const Hawktower = require('./Hawktower.js')
const CarpentersBench = require('./CarpentersBench.js')
const MiningHammer = require('./MiningHammer.js')
const ForestPlow = require('./ForestPlow.js')
const GrasslandHarrow = require('./GrasslandHarrow.js')
const MoldboardPlow = require('./MoldboardPlow.js')
const ChainFloat = require('./ChainFloat.js')
const HayloftBarn = require('./HayloftBarn.js')
const WalkingBoots = require('./WalkingBoots.js')
const FinalScenario = require('./FinalScenario.js')
const Lasso = require('./Lasso.js')
const BreadPaddle = require('./BreadPaddle.js')
const AgrarianFences = require('./AgrarianFences.js')
const Toolbox = require('./Toolbox.js')
const ForestryStudies = require('./ForestryStudies.js')
const CookeryLesson = require('./CookeryLesson.js')
const WoodPalisades = require('./WoodPalisades.js')
const PotteryYard = require('./PotteryYard.js')
const Kettle = require('./Kettle.js')
const Mantlepiece = require('./Mantlepiece.js')
const SpecialFood = require('./SpecialFood.js')
const HookKnife = require('./HookKnife.js')
const Bottles = require('./Bottles.js')
const Grange = require('./Grange.js')
const FutureBuildingSite = require('./FutureBuildingSite.js')
const Loom = require('./Loom.js')
const BreweryPond = require('./BreweryPond.js')
const Hauberg = require('./Hauberg.js')
const ForestInn = require('./ForestInn.js')
const Chophouse = require('./Chophouse.js')
const ChickStable = require('./ChickStable.js')
const StrawberryPatch = require('./StrawberryPatch.js')
const ClubHouse = require('./ClubHouse.js')
const HerringPot = require('./HerringPot.js')
const ForestStone = require('./ForestStone.js')
const Scales = require('./Scales.js')
const ButterChurn = require('./ButterChurn.js')
const DiggingSpade = require('./DiggingSpade.js')
const GrowingFarm = require('./GrowingFarm.js')
const SculptureCourse = require('./SculptureCourse.js')
const Tumbrel = require('./Tumbrel.js')
const MaintenancePremium = require('./MaintenancePremium.js')
const Brook = require('./Brook.js')
const Scullery = require('./Scullery.js')
const CrackWeeder = require('./CrackWeeder.js')
const FoodChest = require('./FoodChest.js')
const BrewingWater = require('./BrewingWater.js')
const ThreeFieldRotation = require('./ThreeFieldRotation.js')
const Pitchfork = require('./Pitchfork.js')
const Tasting = require('./Tasting.js')
const MillWheel = require('./MillWheel.js')
const GrainDepot = require('./GrainDepot.js')
const SackCart = require('./SackCart.js')
const HandTruck = require('./HandTruck.js')
const Beanfield = require('./Beanfield.js')
const PottersMarket = require('./PottersMarket.js')
const NewPurchase = require('./NewPurchase.js')
const HarvestHouse = require('./HarvestHouse.js')
const LoveForAgriculture = require('./LoveForAgriculture.js')
const GiftBasket = require('./GiftBasket.js')
const ThickForest = require('./ThickForest.js')
const WoodWorkshop = require('./WoodWorkshop.js')
const Ceilings = require('./Ceilings.js')
const LoamPit = require('./LoamPit.js')
const ReedBelt = require('./ReedBelt.js')
const Corf = require('./Corf.js')
const HardPorcelain = require('./HardPorcelain.js')
const Handcart = require('./Handcart.js')
const ValueAssets = require('./ValueAssets.js')
const MuddyPuddles = require('./MuddyPuddles.js')
const AcornsBasket = require('./AcornsBasket.js')

const cardData = [
  UpscaleLifestyle,
  MiniPasture,
  Moonshine,
  WoodPile,
  StoreOfExperience,
  ExcursionToTheQuarry,
  Wage,
  MarketStall,
  BeatingRod,
  Caravan,
  Feedyard,
  Stockyard,
  CarpentersParlor,
  Hawktower,
  CarpentersBench,
  MiningHammer,
  ForestPlow,
  GrasslandHarrow,
  MoldboardPlow,
  ChainFloat,
  HayloftBarn,
  WalkingBoots,
  FinalScenario,
  Lasso,
  BreadPaddle,
  AgrarianFences,
  Toolbox,
  ForestryStudies,
  CookeryLesson,
  WoodPalisades,
  PotteryYard,
  Kettle,
  Mantlepiece,
  SpecialFood,
  HookKnife,
  Bottles,
  Grange,
  FutureBuildingSite,
  Loom,
  BreweryPond,
  Hauberg,
  ForestInn,
  Chophouse,
  ChickStable,
  StrawberryPatch,
  ClubHouse,
  HerringPot,
  ForestStone,
  Scales,
  ButterChurn,
  DiggingSpade,
  GrowingFarm,
  SculptureCourse,
  Tumbrel,
  MaintenancePremium,
  Brook,
  Scullery,
  CrackWeeder,
  FoodChest,
  BrewingWater,
  ThreeFieldRotation,
  Pitchfork,
  Tasting,
  MillWheel,
  GrainDepot,
  SackCart,
  HandTruck,
  Beanfield,
  PottersMarket,
  NewPurchase,
  HarvestHouse,
  LoveForAgriculture,
  GiftBasket,
  ThickForest,
  WoodWorkshop,
  Ceilings,
  LoamPit,
  ReedBelt,
  Corf,
  HardPorcelain,
  Handcart,
  ValueAssets,
  MuddyPuddles,
  AcornsBasket,
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
