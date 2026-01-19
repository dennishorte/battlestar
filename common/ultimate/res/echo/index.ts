import type { AgeCardData } from '../../UltimateAgeCard.js'
import type { AchievementData } from '../../UltimateAchievement.js'

import Plumbing from './Plumbing.js'
import Ruler from './Ruler.js'
import Umbrella from './Umbrella.js'
import Bangle from './Bangle.js'
import Chopsticks from './Chopsticks.js'
import Perfume from './Perfume.js'
import Flute from './Flute.js'
import IceSkates from './IceSkates.js'
import Puppet from './Puppet.js'
import Soap from './Soap.js'
import Candles from './Candles.js'
import Comb from './Comb.js'
import Noodles from './Noodles.js'
import Bell from './Bell.js'
import Dice from './Dice.js'
import Crossbow from './Crossbow.js'
import Watermill from './Watermill.js'
import Toothbrush from './Toothbrush.js'
import Linguistics from './Linguistics.js'
import Chaturanga from './Chaturanga.js'
import Scissors from './Scissors.js'
import Lever from './Lever.js'
import Horseshoes from './Horseshoes.js'
import Pagoda from './Pagoda.js'
import Glassblowing from './Glassblowing.js'
import Novel from './Novel.js'
import Sunglasses from './Sunglasses.js'
import CharitableTrust from './CharitableTrust.js'
import HomingPigeons from './HomingPigeons.js'
import LiquidFire from './LiquidFire.js'
import Deodorant from './Deodorant.js'
import Almanac from './Almanac.js'
import Katana from './Katana.js'
import MagnifyingGlass from './MagnifyingGlass.js'
import Sandpaper from './Sandpaper.js'
import Chintz from './Chintz.js'
import Globe from './Globe.js'
import Clock from './Clock.js'
import Shuriken from './Shuriken.js'
import Barometer from './Barometer.js'
import Toilet from './Toilet.js'
import Telescope from './Telescope.js'
import SlideRule from './SlideRule.js'
import Pencil from './Pencil.js'
import Kobukson from './Kobukson.js'
import Thermometer from './Thermometer.js'
import Coke from './Coke.js'
import Palampore from './Palampore.js'
import Stove from './Stove.js'
import LightningRod from './LightningRod.js'
import TuningFork from './TuningFork.js'
import PressureCooker from './PressureCooker.js'
import Piano from './Piano.js'
import Octant from './Octant.js'
import SeedDrill from './SeedDrill.js'
import Stethoscope from './Stethoscope.js'
import Dentures from './Dentures.js'
import HotAirBalloon from './HotAirBalloon.js'
import IndianClubs from './IndianClubs.js'
import Bifocals from './Bifocals.js'
import Morphine from './Morphine.js'
import Steamboat from './Steamboat.js'
import Kaleidoscope from './Kaleidoscope.js'
import Shrapnel from './Shrapnel.js'
import Loom from './Loom.js'
import MachineGun from './MachineGun.js'
import Typewriter from './Typewriter.js'
import Telegraph from './Telegraph.js'
import Elevator from './Elevator.js'
import Rubber from './Rubber.js'
import Saxophone from './Saxophone.js'
import IceCream from './IceCream.js'
import Fertilizer from './Fertilizer.js'
import Photography from './Photography.js'
import Jeans from './Jeans.js'
import Television from './Television.js'
import Bandage from './Bandage.js'
import Nylon from './Nylon.js'
import XRay from './XRay.js'
import SlicedBread from './SlicedBread.js'
import AirConditioner from './AirConditioner.js'
import Crossword from './Crossword.js'
import Tractor from './Tractor.js'
import Parachute from './Parachute.js'
import RadioTelescope from './RadioTelescope.js'
import Jet from './Jet.js'
import Email from './Email.js'
import Calculator from './Calculator.js'
import Wristwatch from './Wristwatch.js'
import Karaoke from './Karaoke.js'
import CreditCard from './CreditCard.js'
import ATM from './ATM.js'
import Rock from './Rock.js'
import Helicopter from './Helicopter.js'
import Laser from './Laser.js'
import Sudoku from './Sudoku.js'
import MP3 from './MP3.js'
import GPS from './GPS.js'
import HumanGenome from './HumanGenome.js'
import Barcode from './Barcode.js'
import CellPhone from './CellPhone.js'
import PuzzleCube from './PuzzleCube.js'
import Camcorder from './Camcorder.js'
import ArtificialHeart from './ArtificialHeart.js'
import SocialNetworking from './SocialNetworking.js'
import Drone from './Drone.js'
import Exoskeleton from './Exoskeleton.js'
import DigitalPet from './DigitalPet.js'
import Esports from './Esports.js'
import Algocracy from './Algocracy.js'
import Robocar from './Robocar.js'
import Streaming from './Streaming.js'
import Touchscreen from './Touchscreen.js'
import Deepfake from './Deepfake.js'
import Meritocracy from './Meritocracy.js'

// Achievements
import AchievementDestiny from './achievements/Destiny.js'
import AchievementHeritage from './achievements/Heritage.js'
import AchievementHistory from './achievements/History.js'
import AchievementSupremacy from './achievements/Supremacy.js'
import AchievementWealth from './achievements/Wealth.js'

const cardData: AgeCardData[] = [
  Plumbing,
  Ruler,
  Umbrella,
  Bangle,
  Chopsticks,
  Perfume,
  Flute,
  IceSkates,
  Puppet,
  Soap,
  Candles,
  Comb,
  Noodles,
  Bell,
  Dice,
  Crossbow,
  Watermill,
  Toothbrush,
  Linguistics,
  Chaturanga,
  Scissors,
  Lever,
  Horseshoes,
  Pagoda,
  Glassblowing,
  Novel,
  Sunglasses,
  CharitableTrust,
  HomingPigeons,
  LiquidFire,
  Deodorant,
  Almanac,
  Katana,
  MagnifyingGlass,
  Sandpaper,
  Chintz,
  Globe,
  Clock,
  Shuriken,
  Barometer,
  Toilet,
  Telescope,
  SlideRule,
  Pencil,
  Kobukson,
  Thermometer,
  Coke,
  Palampore,
  Stove,
  LightningRod,
  TuningFork,
  PressureCooker,
  Piano,
  Octant,
  SeedDrill,
  Stethoscope,
  Dentures,
  HotAirBalloon,
  IndianClubs,
  Bifocals,
  Morphine,
  Steamboat,
  Kaleidoscope,
  Shrapnel,
  Loom,
  MachineGun,
  Typewriter,
  Telegraph,
  Elevator,
  Rubber,
  Saxophone,
  IceCream,
  Fertilizer,
  Photography,
  Jeans,
  Television,
  Bandage,
  Nylon,
  XRay,
  SlicedBread,
  AirConditioner,
  Crossword,
  Tractor,
  Parachute,
  RadioTelescope,
  Jet,
  Email,
  Calculator,
  Wristwatch,
  Karaoke,
  CreditCard,
  ATM,
  Rock,
  Helicopter,
  Laser,
  Sudoku,
  MP3,
  GPS,
  HumanGenome,
  Barcode,
  CellPhone,
  PuzzleCube,
  Camcorder,
  ArtificialHeart,
  SocialNetworking,
  Drone,
  Exoskeleton,
  DigitalPet,
  Esports,
  Algocracy,
  Robocar,
  Streaming,
  Touchscreen,
  Deepfake,
  Meritocracy,
]

const achievementData: AchievementData[] = [
  AchievementDestiny,
  AchievementHeritage,
  AchievementHistory,
  AchievementSupremacy,
  AchievementWealth,
]

export { cardData, achievementData }

export default { cardData, achievementData }
