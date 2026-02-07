/**
 * Minor Improvements C for Agricola (Revised Edition)
 * 84 minor improvements
 */

const Overhaul = require('./Overhaul.js')
const Stable = require('./Stable.js')
const CarriageTrip = require('./CarriageTrip.js')
const WritingBoards = require('./WritingBoards.js')
const Remodeling = require('./Remodeling.js')
const StoneClearing = require('./StoneClearing.js')
const BladeShears = require('./BladeShears.js')
const PlantFertilizer = require('./PlantFertilizer.js')
const AutomaticWaterTrough = require('./AutomaticWaterTrough.js')
const BunkBeds = require('./BunkBeds.js')
const WildlifeReserve = require('./WildlifeReserve.js')
const CattleFarm = require('./CattleFarm.js')
const WoodSlideHammer = require('./WoodSlideHammer.js')
const StrawThatchedRoof = require('./StrawThatchedRoof.js')
const Trellis = require('./Trellis.js')
const FieldFences = require('./FieldFences.js')
const NewlyPlowedField = require('./NewlyPlowedField.js')
const RollOverPlow = require('./RollOverPlow.js')
const SwingPlow = require('./SwingPlow.js')
const MolePlow = require('./MolePlow.js')
const HeartOfStone = require('./HeartOfStone.js')
const BasketChair = require('./BasketChair.js')
const JobContract = require('./JobContract.js')
const BedInTheGrainField = require('./BedInTheGrainField.js')
const SteamMachine = require('./SteamMachine.js')
const Flail = require('./Flail.js')
const Blueprint = require('./Blueprint.js')
const TeachersDesk = require('./TeachersDesk.js')
const BeerTable = require('./BeerTable.js')
const HalfTimberedHouse = require('./HalfTimberedHouse.js')
const WritingChamber = require('./WritingChamber.js')
const AbortOriel = require('./AbortOriel.js')
const GreeningPlan = require('./GreeningPlan.js')
const ElephantgrassPlant = require('./ElephantgrassPlant.js')
const LanternHouse = require('./LanternHouse.js')
const ClayDeposit = require('./ClayDeposit.js')
const DwellingMound = require('./DwellingMound.js')
const Christianity = require('./Christianity.js')
const StudioBoat = require('./StudioBoat.js')
const CanvasSack = require('./CanvasSack.js')
const FarmStore = require('./FarmStore.js')
const RavenousHunger = require('./RavenousHunger.js')
const FarmBuilding = require('./FarmBuilding.js')
const ChickenCoop = require('./ChickenCoop.js')
const Stew = require('./Stew.js')
const Mandoline = require('./Mandoline.js')
const GardenClaw = require('./GardenClaw.js')
const Farmstead = require('./Farmstead.js')
const BeerStall = require('./BeerStall.js')
const StableYard = require('./StableYard.js')
const FishingNet = require('./FishingNet.js')
const HuntsmansHat = require('./HuntsmansHat.js')
const GypsysCrock = require('./GypsysCrock.js')
const MarketStall = require('./MarketStall.js')
const Studio = require('./Studio.js')
const FeedFence = require('./FeedFence.js')
const Crudit = require('./Crudit.js')
const Woodcraft = require('./Woodcraft.js')
const SchnappsDistillery = require('./SchnappsDistillery.js')
const SmallPottersOven = require('./SmallPottersOven.js')
const BeerStein = require('./BeerStein.js')
const CookingHearthExtension = require('./CookingHearthExtension.js')
const CraftBrewery = require('./CraftBrewery.js')
const CornSchnappsDistillery = require('./CornSchnappsDistillery.js')
const Granary = require('./Granary.js')
const EternalRyeCultivation = require('./EternalRyeCultivation.js')
const MineralFeeder = require('./MineralFeeder.js')
const Bookcase = require('./Bookcase.js')
const LandConsolidation = require('./LandConsolidation.js')
const LettucePatch = require('./LettucePatch.js')
const Slurry = require('./Slurry.js')
const HarvestFestivalPlanning = require('./HarvestFestivalPlanning.js')
const SeaweedFertilizer = require('./SeaweedFertilizer.js')
const PrivateForest = require('./PrivateForest.js')
const Firewood = require('./Firewood.js')
const WoodCart = require('./WoodCart.js')
const ClaySupply = require('./ClaySupply.js')
const ReedHattedToad = require('./ReedHattedToad.js')
const StoneCart = require('./StoneCart.js')
const RockyTerrain = require('./RockyTerrain.js')
const MaterialHub = require('./MaterialHub.js')
const HardwareStore = require('./HardwareStore.js')
const EarlyCattle = require('./EarlyCattle.js')
const PerennialRye = require('./PerennialRye.js')

const cardData = [
  Overhaul,
  Stable,
  CarriageTrip,
  WritingBoards,
  Remodeling,
  StoneClearing,
  BladeShears,
  PlantFertilizer,
  AutomaticWaterTrough,
  BunkBeds,
  WildlifeReserve,
  CattleFarm,
  WoodSlideHammer,
  StrawThatchedRoof,
  Trellis,
  FieldFences,
  NewlyPlowedField,
  RollOverPlow,
  SwingPlow,
  MolePlow,
  HeartOfStone,
  BasketChair,
  JobContract,
  BedInTheGrainField,
  SteamMachine,
  Flail,
  Blueprint,
  TeachersDesk,
  BeerTable,
  HalfTimberedHouse,
  WritingChamber,
  AbortOriel,
  GreeningPlan,
  ElephantgrassPlant,
  LanternHouse,
  ClayDeposit,
  DwellingMound,
  Christianity,
  StudioBoat,
  CanvasSack,
  FarmStore,
  RavenousHunger,
  FarmBuilding,
  ChickenCoop,
  Stew,
  Mandoline,
  GardenClaw,
  Farmstead,
  BeerStall,
  StableYard,
  FishingNet,
  HuntsmansHat,
  GypsysCrock,
  MarketStall,
  Studio,
  FeedFence,
  Crudit,
  Woodcraft,
  SchnappsDistillery,
  SmallPottersOven,
  BeerStein,
  CookingHearthExtension,
  CraftBrewery,
  CornSchnappsDistillery,
  Granary,
  EternalRyeCultivation,
  MineralFeeder,
  Bookcase,
  LandConsolidation,
  LettucePatch,
  Slurry,
  HarvestFestivalPlanning,
  SeaweedFertilizer,
  PrivateForest,
  Firewood,
  WoodCart,
  ClaySupply,
  ReedHattedToad,
  StoneCart,
  RockyTerrain,
  MaterialHub,
  HardwareStore,
  EarlyCattle,
  PerennialRye,
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
