/**
 * Minor Improvements D for Agricola (Revised Edition)
 * 84 minor improvements
 */

const ZigzagHarrow = require('./ZigzagHarrow.js')
const DwellingPlan = require('./DwellingPlan.js')
const Furrows = require('./Furrows.js')
const CrossCutWood = require('./CrossCutWood.js')
const FieldClay = require('./FieldClay.js')
const PetrifiedWood = require('./PetrifiedWood.js')
const Trident = require('./Trident.js')
const FernSeeds = require('./FernSeeds.js')
const GameTrade = require('./GameTrade.js')
const StorksNest = require('./StorksNest.js')
const LawnFertilizer = require('./LawnFertilizer.js')
const MilkingPlace = require('./MilkingPlace.js')
const Trowel = require('./Trowel.js')
const HammerCrusher = require('./HammerCrusher.js')
const ClaySupports = require('./ClaySupports.js')
const WoodenWheyBucket = require('./WoodenWheyBucket.js')
const DrillHarrow = require('./DrillHarrow.js')
const SteamPlow = require('./SteamPlow.js')
const PulverizerPlow = require('./PulverizerPlow.js')
const TurnwrestPlow = require('./TurnwrestPlow.js')
const Recruitment = require('./Recruitment.js')
const WorkPermit = require('./WorkPermit.js')
const PioneeringSpirit = require('./PioneeringSpirit.js')
const BrotherlyLove = require('./BrotherlyLove.js')
const WitchesDanceFloor = require('./WitchesDanceFloor.js')
const CarpentersYard = require('./CarpentersYard.js')
const Retraining = require('./Retraining.js')
const WritingDesk = require('./WritingDesk.js')
const MuckRake = require('./MuckRake.js')
const ArtisanDistrict = require('./ArtisanDistrict.js')
const Storeroom = require('./Storeroom.js')
const WoodRake = require('./WoodRake.js')
const SummerHouse = require('./SummerHouse.js')
const LuxuriousHostel = require('./LuxuriousHostel.js')
const FodderChamber = require('./FodderChamber.js')
const BreedRegistry = require('./BreedRegistry.js')
const Sculpture = require('./Sculpture.js')
const MilkingStool = require('./MilkingStool.js')
const TruffleSlicer = require('./TruffleSlicer.js')
const Cesspit = require('./Cesspit.js')
const HorseDrawnBoat = require('./HorseDrawnBoat.js')
const EducationBonus = require('./EducationBonus.js')
const Hutch = require('./Hutch.js')
const ForestWell = require('./ForestWell.js')
const SheepWell = require('./SheepWell.js')
const PelletPress = require('./PelletPress.js')
const Churchyard = require('./Churchyard.js')
const CivicFacade = require('./CivicFacade.js')
const Bookshelf = require('./Bookshelf.js')
const ForeignAid = require('./ForeignAid.js')
const Archway = require('./Archway.js')
const RollingPin = require('./RollingPin.js')
const TeaHouse = require('./TeaHouse.js')
const TroutPool = require('./TroutPool.js')
const NewMarket = require('./NewMarket.js')
const FatstockStretcher = require('./FatstockStretcher.js')
const WholesaleMarket = require('./WholesaleMarket.js')
const Gritter = require('./Gritter.js')
const EarthOven = require('./EarthOven.js')
const LargePottery = require('./LargePottery.js')
const BaleOfStraw = require('./BaleOfStraw.js')
const BeerTap = require('./BeerTap.js')
const Lynchet = require('./Lynchet.js')
const BakingCourse = require('./BakingCourse.js')
const GrainSieve = require('./GrainSieve.js')
const PotterCeramics = require('./PotterCeramics.js')
const ReapHook = require('./ReapHook.js')
const SmallBasket = require('./SmallBasket.js')
const SmallGreenhouse = require('./SmallGreenhouse.js')
const StrawManure = require('./StrawManure.js')
const Changeover = require('./Changeover.js')
const StableManure = require('./StableManure.js')
const SupplyBoat = require('./SupplyBoat.js')
const RoyalWood = require('./RoyalWood.js')
const WoodField = require('./WoodField.js')
const SocialBenefits = require('./SocialBenefits.js')
const RecycledBrick = require('./RecycledBrick.js')
const ReedPond = require('./ReedPond.js')
const CarrotMuseum = require('./CarrotMuseum.js')
const BrickHammer = require('./BrickHammer.js')
const RoofLadder = require('./RoofLadder.js')
const HuntingTrophy = require('./HuntingTrophy.js')
const Pigswill = require('./Pigswill.js')
const FeedPellets = require('./FeedPellets.js')

const cardData = [
  ZigzagHarrow,
  DwellingPlan,
  Furrows,
  CrossCutWood,
  FieldClay,
  PetrifiedWood,
  Trident,
  FernSeeds,
  GameTrade,
  StorksNest,
  LawnFertilizer,
  MilkingPlace,
  Trowel,
  HammerCrusher,
  ClaySupports,
  WoodenWheyBucket,
  DrillHarrow,
  SteamPlow,
  PulverizerPlow,
  TurnwrestPlow,
  Recruitment,
  WorkPermit,
  PioneeringSpirit,
  BrotherlyLove,
  WitchesDanceFloor,
  CarpentersYard,
  Retraining,
  WritingDesk,
  MuckRake,
  ArtisanDistrict,
  Storeroom,
  WoodRake,
  SummerHouse,
  LuxuriousHostel,
  FodderChamber,
  BreedRegistry,
  Sculpture,
  MilkingStool,
  TruffleSlicer,
  Cesspit,
  HorseDrawnBoat,
  EducationBonus,
  Hutch,
  ForestWell,
  SheepWell,
  PelletPress,
  Churchyard,
  CivicFacade,
  Bookshelf,
  ForeignAid,
  Archway,
  RollingPin,
  TeaHouse,
  TroutPool,
  NewMarket,
  FatstockStretcher,
  WholesaleMarket,
  Gritter,
  EarthOven,
  LargePottery,
  BaleOfStraw,
  BeerTap,
  Lynchet,
  BakingCourse,
  GrainSieve,
  PotterCeramics,
  ReapHook,
  SmallBasket,
  SmallGreenhouse,
  StrawManure,
  Changeover,
  StableManure,
  SupplyBoat,
  RoyalWood,
  WoodField,
  SocialBenefits,
  RecycledBrick,
  ReedPond,
  CarrotMuseum,
  BrickHammer,
  RoofLadder,
  HuntingTrophy,
  Pigswill,
  FeedPellets,
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
