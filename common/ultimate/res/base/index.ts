import type { AgeCardData } from '../../UltimateAgeCard.js'
import type { AchievementData } from '../../UltimateAchievement.js'

// Age 0
import Curing from './Curing.js'
import FirstAid from './FirstAid.js'
import Fire from './Fire.js'
import Fishing from './Fishing.js'
import Foraging from './Foraging.js'
import FreshWater from './FreshWater.js'
import Hunting from './Hunting.js'
import Knots from './Knots.js'
import Shelter from './Shelter.js'
import Skinning from './Skinning.js'
import SpeakWithBird from './SpeakWithBird.js'
import StoneKnives from './StoneKnives.js'
import Tanning from './Tanning.js'
import Tracking from './Tracking.js'
import Trapping from './Trapping.js'

import Archery from './Archery.js'
import Metalworking from './Metalworking.js'
import Oars from './Oars.js'
import Pottery from './Pottery.js'
import Tools from './Tools.js'
import Writing from './Writing.js'
import Clothing from './Clothing.js'
import Sailing from './Sailing.js'
import TheWheel from './TheWheel.js'
import CityStates from './CityStates.js'
import CodeofLaws from './CodeofLaws.js'
import Mysticism from './Mysticism.js'
import Agriculture from './Agriculture.js'
import Domestication from './Domestication.js'
import Masonry from './Masonry.js'
import RoadBuilding from './RoadBuilding.js'
import Construction from './Construction.js'
import Calendar from './Calendar.js'
import Mathematics from './Mathematics.js'
import Mapmaking from './Mapmaking.js'
import Currency from './Currency.js'
import Philosophy from './Philosophy.js'
import Monotheism from './Monotheism.js'
import Fermenting from './Fermenting.js'
import CanalBuilding from './CanalBuilding.js'
import Optics from './Optics.js'
import Engineering from './Engineering.js'
import Translation from './Translation.js'
import Alchemy from './Alchemy.js'
import Paper from './Paper.js'
import Compass from './Compass.js'
import Education from './Education.js'
import Feudalism from './Feudalism.js'
import Machinery from './Machinery.js'
import Medicine from './Medicine.js'
import Gunpowder from './Gunpowder.js'
import Colonialism from './Colonialism.js'
import PrintingPress from './PrintingPress.js'
import Experimentation from './Experimentation.js'
import Invention from './Invention.js'
import Navigation from './Navigation.js'
import Perspective from './Perspective.js'
import Anatomy from './Anatomy.js'
import Reformation from './Reformation.js'
import Enterprise from './Enterprise.js'
import Coal from './Coal.js'
import ThePirateCode from './ThePirateCode.js'
import SteamEngine from './SteamEngine.js'
import Statistics from './Statistics.js'
import Physics from './Physics.js'
import Chemistry from './Chemistry.js'
import Measurement from './Measurement.js'
import Banking from './Banking.js'
import Astronomy from './Astronomy.js'
import Societies from './Societies.js'
import Encyclopedia from './Encyclopedia.js'
import AtomicTheory from './AtomicTheory.js'
import Industrialization from './Industrialization.js'
import MachineTools from './MachineTools.js'
import Canning from './Canning.js'
import Vaccination from './Vaccination.js'
import Classification from './Classification.js'
import MetricSystem from './MetricSystem.js'
import Democracy from './Democracy.js'
import Emancipation from './Emancipation.js'
import Combustion from './Combustion.js'
import Explosives from './Explosives.js'
import Railroad from './Railroad.js'
import Lighting from './Lighting.js'
import Sanitation from './Sanitation.js'
import Refrigeration from './Refrigeration.js'
import Evolution from './Evolution.js'
import Publications from './Publications.js'
import Electricity from './Electricity.js'
import Bicycle from './Bicycle.js'
import Corporations from './Corporations.js'
import Skyscrapers from './Skyscrapers.js'
import Antibiotics from './Antibiotics.js'
import Flight from './Flight.js'
import Mobility from './Mobility.js'
import Rocketry from './Rocketry.js'
import QuantumTheory from './QuantumTheory.js'
import Empiricism from './Empiricism.js'
import MassMedia from './MassMedia.js'
import Socialism from './Socialism.js'
import Composites from './Composites.js'
import Fission from './Fission.js'
import Services from './Services.js'
import Specialization from './Specialization.js'
import Satellites from './Satellites.js'
import Collaboration from './Collaboration.js'
import Suburbia from './Suburbia.js'
import Ecology from './Ecology.js'
import Genetics from './Genetics.js'
import Computers from './Computers.js'
import Robotics from './Robotics.js'
import Miniaturization from './Miniaturization.js'
import AI from './AI.js'
import TheInternet from './TheInternet.js'
import StemCells from './StemCells.js'
import Globalization from './Globalization.js'
import Databases from './Databases.js'
import SelfService from './SelfService.js'
import Software from './Software.js'
import Bioengineering from './Bioengineering.js'
import Whataboutism from './Whataboutism.js'
import Escapism from './Escapism.js'
import Reclamation from './Reclamation.js'
import Astrogeology from './Astrogeology.js'
import Fusion from './Fusion.js'
import NearFieldComm from './NearFieldComm.js'
import SolarSailing from './SolarSailing.js'
import Climatology from './Climatology.js'
import Hypersonics from './Hypersonics.js'
import SpaceTraffic from './SpaceTraffic.js'

// Achievements
import AchievementEmpire from './achievements/Empire.js'
import AchievementMonument from './achievements/Monument.js'
import AchievementWorld from './achievements/World.js'
import AchievementWonder from './achievements/Wonder.js'
import AchievementUniverse from './achievements/Universe.js'

const cardData: AgeCardData[] = [
  // Age 0
  Curing,
  FirstAid,
  Fire,
  Fishing,
  Foraging,
  FreshWater,
  Hunting,
  Knots,
  Shelter,
  Skinning,
  SpeakWithBird,
  StoneKnives,
  Tanning,
  Tracking,
  Trapping,

  Archery,
  Metalworking,
  Oars,
  Pottery,
  Tools,
  Writing,
  Clothing,
  Sailing,
  TheWheel,
  CityStates,
  CodeofLaws,
  Mysticism,
  Agriculture,
  Domestication,
  Masonry,
  RoadBuilding,
  Construction,
  Calendar,
  Mathematics,
  Mapmaking,
  Currency,
  Philosophy,
  Monotheism,
  Fermenting,
  CanalBuilding,
  Optics,
  Engineering,
  Translation,
  Alchemy,
  Paper,
  Compass,
  Education,
  Feudalism,
  Machinery,
  Medicine,
  Gunpowder,
  Colonialism,
  PrintingPress,
  Experimentation,
  Invention,
  Navigation,
  Perspective,
  Anatomy,
  Reformation,
  Enterprise,
  Coal,
  ThePirateCode,
  SteamEngine,
  Statistics,
  Physics,
  Chemistry,
  Measurement,
  Banking,
  Astronomy,
  Societies,
  Encyclopedia,
  AtomicTheory,
  Industrialization,
  MachineTools,
  Canning,
  Vaccination,
  Classification,
  MetricSystem,
  Democracy,
  Emancipation,
  Combustion,
  Explosives,
  Railroad,
  Lighting,
  Sanitation,
  Refrigeration,
  Evolution,
  Publications,
  Electricity,
  Bicycle,
  Corporations,
  Skyscrapers,
  Antibiotics,
  Flight,
  Mobility,
  Rocketry,
  QuantumTheory,
  Empiricism,
  MassMedia,
  Socialism,
  Composites,
  Fission,
  Services,
  Specialization,
  Satellites,
  Collaboration,
  Suburbia,
  Ecology,
  Genetics,
  Computers,
  Robotics,
  Miniaturization,
  AI,
  TheInternet,
  StemCells,
  Globalization,
  Databases,
  SelfService,
  Software,
  Bioengineering,
  Whataboutism,
  Escapism,
  Reclamation,
  Astrogeology,
  Fusion,
  NearFieldComm,
  SolarSailing,
  Climatology,
  Hypersonics,
  SpaceTraffic,
]

const achievementData: AchievementData[] = [
  AchievementEmpire,
  AchievementMonument,
  AchievementWorld,
  AchievementWonder,
  AchievementUniverse,
]

export { cardData, achievementData }

export default { cardData, achievementData }
