/**
 * Minor Improvements E for Agricola (Revised Edition)
 * 84 minor improvements
 */

const PoleBarns = require('./PoleBarns.js')
const RenovationMaterials = require('./RenovationMaterials.js')
const TeaTime = require('./TeaTime.js')
const Thunderbolt = require('./Thunderbolt.js')
const NightLoot = require('./NightLoot.js')
const Recount = require('./Recount.js')
const Pumpernickel = require('./Pumpernickel.js')
const FarmersMarket = require('./FarmersMarket.js')
const BarteringHut = require('./BarteringHut.js')
const StrawHat = require('./StrawHat.js')
const PettingZoo = require('./PettingZoo.js')
const AnimalBedding = require('./AnimalBedding.js')
const StoneHouseReconstruction = require('./StoneHouseReconstruction.js')
const WoodSaw = require('./WoodSaw.js')
const NailBasket = require('./NailBasket.js')
const BriarHedge = require('./BriarHedge.js')
const SkimmerPlow = require('./SkimmerPlow.js')
const SeedAlmanac = require('./SeedAlmanac.js')
const OxGoad = require('./OxGoad.js')
const IronHoe = require('./IronHoe.js')
const SheepRug = require('./SheepRug.js')
const GuestRoom = require('./GuestRoom.js')
const Apiary = require('./Apiary.js')
const Ambition = require('./Ambition.js')
const BumperCrop = require('./BumperCrop.js')
const Sundial = require('./Sundial.js')
const PiggyBank = require('./PiggyBank.js')
const Bookmark = require('./Bookmark.js')
const Heirloom = require('./Heirloom.js')
const ChildsToy = require('./ChildsToy.js')
const Upholstery = require('./Upholstery.js')
const Nave = require('./Nave.js')
const BeaverColony = require('./BeaverColony.js')
const LandRegister = require('./LandRegister.js')
const Misanthropy = require('./Misanthropy.js')
const HerbalGarden = require('./HerbalGarden.js')
const OxSkull = require('./OxSkull.js')
const RodCollection = require('./RodCollection.js')
const Paintbrush = require('./Paintbrush.js')
const BeeStatue = require('./BeeStatue.js')
const MuddyWaters = require('./MuddyWaters.js')
const WaterGully = require('./WaterGully.js')
const BarnCats = require('./BarnCats.js')
const FodderBeets = require('./FodderBeets.js')
const FruitLadder = require('./FruitLadder.js')
const WaterlilyPond = require('./WaterlilyPond.js')
const SyrupTap = require('./SyrupTap.js')
const TownHall = require('./TownHall.js')
const Twibil = require('./Twibil.js')
const WildGreens = require('./WildGreens.js')
const WhaleOil = require('./WhaleOil.js')
const Cubbyhole = require('./Cubbyhole.js')
const BoarSpear = require('./BoarSpear.js')
const Contraband = require('./Contraband.js')
const StoneWeir = require('./StoneWeir.js')
const RomanPot = require('./RomanPot.js')
const CheeseFondue = require('./CheeseFondue.js')
const LunchtimeBeer = require('./LunchtimeBeer.js')
const CombAndCutter = require('./CombAndCutter.js')
const WorkingGloves = require('./WorkingGloves.js')
const RaisedBed = require('./RaisedBed.js')
const SourDough = require('./SourDough.js')
const IronOven = require('./IronOven.js')
const SimpleOven = require('./SimpleOven.js')
const Almsbag = require('./Almsbag.js')
const BarnShed = require('./BarnShed.js')
const GrainBag = require('./GrainBag.js')
const CherryOrchard = require('./CherryOrchard.js')
const MelonPatch = require('./MelonPatch.js')
const CropRotationField = require('./CropRotationField.js')
const CowPatty = require('./CowPatty.js')
const ArtichokeField = require('./ArtichokeField.js')
const Scythe = require('./Scythe.js')
const AshTrees = require('./AshTrees.js')
const StoneAxe = require('./StoneAxe.js')
const LumberPile = require('./LumberPile.js')
const Mattock = require('./Mattock.js')
const SleightOfHand = require('./SleightOfHand.js')
const FieldSpade = require('./FieldSpade.js')
const RockGarden = require('./RockGarden.js')
const AlchemistsLab = require('./AlchemistsLab.js')
const Profiteering = require('./Profiteering.js')
const ShepherdsWhistle = require('./ShepherdsWhistle.js')
const DollysMother = require('./DollysMother.js')

const cardData = [
  PoleBarns,
  RenovationMaterials,
  TeaTime,
  Thunderbolt,
  NightLoot,
  Recount,
  Pumpernickel,
  FarmersMarket,
  BarteringHut,
  StrawHat,
  PettingZoo,
  AnimalBedding,
  StoneHouseReconstruction,
  WoodSaw,
  NailBasket,
  BriarHedge,
  SkimmerPlow,
  SeedAlmanac,
  OxGoad,
  IronHoe,
  SheepRug,
  GuestRoom,
  Apiary,
  Ambition,
  BumperCrop,
  Sundial,
  PiggyBank,
  Bookmark,
  Heirloom,
  ChildsToy,
  Upholstery,
  Nave,
  BeaverColony,
  LandRegister,
  Misanthropy,
  HerbalGarden,
  OxSkull,
  RodCollection,
  Paintbrush,
  BeeStatue,
  MuddyWaters,
  WaterGully,
  BarnCats,
  FodderBeets,
  FruitLadder,
  WaterlilyPond,
  SyrupTap,
  TownHall,
  Twibil,
  WildGreens,
  WhaleOil,
  Cubbyhole,
  BoarSpear,
  Contraband,
  StoneWeir,
  RomanPot,
  CheeseFondue,
  LunchtimeBeer,
  CombAndCutter,
  WorkingGloves,
  RaisedBed,
  SourDough,
  IronOven,
  SimpleOven,
  Almsbag,
  BarnShed,
  GrainBag,
  CherryOrchard,
  MelonPatch,
  CropRotationField,
  CowPatty,
  ArtichokeField,
  Scythe,
  AshTrees,
  StoneAxe,
  LumberPile,
  Mattock,
  SleightOfHand,
  FieldSpade,
  RockGarden,
  AlchemistsLab,
  Profiteering,
  ShepherdsWhistle,
  DollysMother,
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
