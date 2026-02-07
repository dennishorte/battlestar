/**
 * Occupations B for Agricola (Revised Edition)
 * 84 occupations
 */

const FarmHand = require('./FarmHand.js')
const TruffleSearcher = require('./TruffleSearcher.js')
const Cottager = require('./Cottager.js')
const EstablishedPerson = require('./EstablishedPerson.js')
const Groom = require('./Groom.js')
const CooperativePlower = require('./CooperativePlower.js')
const AssistantTiller = require('./AssistantTiller.js')
const LittleStickKnitter = require('./LittleStickKnitter.js')
const Confidant = require('./Confidant.js')
const StockProtector = require('./StockProtector.js')
const MasterBricklayer = require('./MasterBricklayer.js')
const TreeFarmJoiner = require('./TreeFarmJoiner.js')
const Scholar = require('./Scholar.js')
const OrganicFarmer = require('./OrganicFarmer.js')
const Tutor = require('./Tutor.js')
const Clutterer = require('./Clutterer.js')
const FurnitureCarpenter = require('./FurnitureCarpenter.js')
const Consultant = require('./Consultant.js')
const FieldMerchant = require('./FieldMerchant.js')
const SheepWalker = require('./SheepWalker.js')
const CaseBuilder = require('./CaseBuilder.js')
const MoralCrusader = require('./MoralCrusader.js')
const Manservant = require('./Manservant.js')
const OvenFiringBoy = require('./OvenFiringBoy.js')
const PaperMaker = require('./PaperMaker.js')
const Pavior = require('./Pavior.js')
const Rustic = require('./Rustic.js')
const Silokeeper = require('./Silokeeper.js')
const PatchCaregiver = require('./PatchCaregiver.js')
const Childless = require('./Childless.js')
const TinsmithMaster = require('./TinsmithMaster.js')
const Shoreforester = require('./Shoreforester.js')
const Informant = require('./Informant.js')
const SmallScaleFarmer = require('./SmallScaleFarmer.js')
const Lumberjack = require('./Lumberjack.js')
const Sweep = require('./Sweep.js')
const Geologist = require('./Geologist.js')
const Mineralogist = require('./Mineralogist.js')
const RoofBallaster = require('./RoofBallaster.js')
const Trimmer = require('./Trimmer.js')
const EstateWorker = require('./EstateWorker.js')
const Carpenter = require('./Carpenter.js')
const Seducer = require('./Seducer.js')
const Plumber = require('./Plumber.js')
const Seatmate = require('./Seatmate.js')
const FullPeasant = require('./FullPeasant.js')
const Equipper = require('./Equipper.js')
const EstateMaster = require('./EstateMaster.js')
const VillagePeasant = require('./VillagePeasant.js')
const HousebookMaster = require('./HousebookMaster.js')
const NutritionExpert = require('./NutritionExpert.js')
const HouseSteward = require('./HouseSteward.js')
const Wholesaler = require('./Wholesaler.js')
const ForestGuardian = require('./ForestGuardian.js')
const ForestScientist = require('./ForestScientist.js')
const FarmyardWorker = require('./FarmyardWorker.js')
const FieldCaretaker = require('./FieldCaretaker.js')
const Greengrocer = require('./Greengrocer.js')
const ClayWarden = require('./ClayWarden.js')
const Collier = require('./Collier.js')
const BrushwoodCollector = require('./BrushwoodCollector.js')
const Illusionist = require('./Illusionist.js')
const Huntsman = require('./Huntsman.js')
const PetBroker = require('./PetBroker.js')
const OpenAirFarmer = require('./OpenAirFarmer.js')
const LargeScaleFarmer = require('./LargeScaleFarmer.js')
const LittlePeasant = require('./LittlePeasant.js')
const JuniorArtist = require('./JuniorArtist.js')
const Housemaster = require('./Housemaster.js')
const SheepKeeper = require('./SheepKeeper.js')
const ArtTeacher = require('./ArtTeacher.js')
const StorehouseKeeper = require('./StorehouseKeeper.js')
const Salter = require('./Salter.js')
const DistrictManager = require('./DistrictManager.js')
const LieutenantGeneral = require('./LieutenantGeneral.js')
const PubOwner = require('./PubOwner.js')
const Weakling = require('./Weakling.js')
const ForestClearer = require('./ForestClearer.js')
const Pastor = require('./Pastor.js')
const SheepWhisperer = require('./SheepWhisperer.js')
const GameProvider = require('./GameProvider.js')
const CattleFeeder = require('./CattleFeeder.js')
const StableSergeant = require('./StableSergeant.js')
const PastureMaster = require('./PastureMaster.js')

const cardData = [
  FarmHand,
  TruffleSearcher,
  Cottager,
  EstablishedPerson,
  Groom,
  CooperativePlower,
  AssistantTiller,
  LittleStickKnitter,
  Confidant,
  StockProtector,
  MasterBricklayer,
  TreeFarmJoiner,
  Scholar,
  OrganicFarmer,
  Tutor,
  Clutterer,
  FurnitureCarpenter,
  Consultant,
  FieldMerchant,
  SheepWalker,
  CaseBuilder,
  MoralCrusader,
  Manservant,
  OvenFiringBoy,
  PaperMaker,
  Pavior,
  Rustic,
  Silokeeper,
  PatchCaregiver,
  Childless,
  TinsmithMaster,
  Shoreforester,
  Informant,
  SmallScaleFarmer,
  Lumberjack,
  Sweep,
  Geologist,
  Mineralogist,
  RoofBallaster,
  Trimmer,
  EstateWorker,
  Carpenter,
  Seducer,
  Plumber,
  Seatmate,
  FullPeasant,
  Equipper,
  EstateMaster,
  VillagePeasant,
  HousebookMaster,
  NutritionExpert,
  HouseSteward,
  Wholesaler,
  ForestGuardian,
  ForestScientist,
  FarmyardWorker,
  FieldCaretaker,
  Greengrocer,
  ClayWarden,
  Collier,
  BrushwoodCollector,
  Illusionist,
  Huntsman,
  PetBroker,
  OpenAirFarmer,
  LargeScaleFarmer,
  LittlePeasant,
  JuniorArtist,
  Housemaster,
  SheepKeeper,
  ArtTeacher,
  StorehouseKeeper,
  Salter,
  DistrictManager,
  LieutenantGeneral,
  PubOwner,
  Weakling,
  ForestClearer,
  Pastor,
  SheepWhisperer,
  GameProvider,
  CattleFeeder,
  StableSergeant,
  PastureMaster,
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
