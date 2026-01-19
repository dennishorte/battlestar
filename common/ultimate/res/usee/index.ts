import type { AgeCardData } from '../../UltimateAgeCard.js'
import type { AchievementData } from '../../UltimateAchievement.js'

import Assassination from './Assassination.js'
import Maze from './Maze.js'
import Pilgrimage from './Pilgrimage.js'
import Handshake from './Handshake.js'
import Tomb from './Tomb.js'
import Woodworking from './Woodworking.js'
import Dance from './Dance.js'
import Rumor from './Rumor.js'
import Silk from './Silk.js'
import Espionage from './Espionage.js'
import Palmistry from './Palmistry.js'
import Proverb from './Proverb.js'
import Myth from './Myth.js'
import Polytheism from './Polytheism.js'
import Symbology from './Symbology.js'
import Padlock from './Padlock.js'
import Password from './Password.js'
import Astrology from './Astrology.js'
import Fingerprints from './Fingerprints.js'
import Exile from './Exile.js'
import Meteorology from './Meteorology.js'
import Cipher from './Cipher.js'
import Counterfeiting from './Counterfeiting.js'
import Steganography from './Steganography.js'
import Propaganda from './Propaganda.js'
import KnightsTemplar from './KnightsTemplar.js'
import SecretPolice from './SecretPolice.js'
import SecretumSecretorum from './SecretumSecretorum.js'
import Cliffhanger from './Cliffhanger.js'
import RedEnvelope from './RedEnvelope.js'
import Masquerade from './Masquerade.js'
import Freemasons from './Freemasons.js'
import Smuggling from './Smuggling.js'
import Taqiyya from './Taqiyya.js'
import BrethrenofPurity from './BrethrenofPurity.js'
import Ninja from './Ninja.js'
import Heirloom from './Heirloom.js'
import TheProphecies from './TheProphecies.js'
import SpanishInquisition from './SpanishInquisition.js'
import Blackmail from './Blackmail.js'
import Confession from './Confession.js'
import AprilFoolsDay from './AprilFoolsDay.js'
import ElDorado from './ElDorado.js'
import Legend from './Legend.js'
import Quackery from './Quackery.js'
import Gallery from './Gallery.js'
import Cabal from './Cabal.js'
import Probability from './Probability.js'
import WitchTrial from './WitchTrial.js'
import BuriedTreasure from './BuriedTreasure.js'
import Pantheism from './Pantheism.js'
import Chartreuse from './Chartreuse.js'
import SecretHistory from './SecretHistory.js'
import PenName from './PenName.js'
import PopularScience from './PopularScience.js'
import Sabotage from './Sabotage.js'
import RedHerring from './RedHerring.js'
import Reconnaissance from './Reconnaissance.js'
import Sniping from './Sniping.js'
import Hiking from './Hiking.js'
import Illuminati from './Illuminati.js'
import Attic from './Attic.js'
import SwissBankAccount from './SwissBankAccount.js'
import Placebo from './Placebo.js'
import Triad from './Triad.js'
import Camouflage from './Camouflage.js'
import Subway from './Subway.js'
import PrivateEye from './PrivateEye.js'
import SafeDepositBox from './SafeDepositBox.js'
import BlackMarket from './BlackMarket.js'
import FortuneCookie from './FortuneCookie.js'
import Mafia from './Mafia.js'
import PlotVoucher from './PlotVoucher.js'
import Counterintelligence from './Counterintelligence.js'
import SlotMachine from './SlotMachine.js'
import Concealment from './Concealment.js'
import ShangriLa from './ShangriLa.js'
import Scouting from './Scouting.js'
import EnigmaMachine from './EnigmaMachine.js'
import Handbag from './Handbag.js'
import JoyBuzzer from './JoyBuzzer.js'
import Jackalope from './Jackalope.js'
import Hitchhiking from './Hitchhiking.js'
import Blacklight from './Blacklight.js'
import OpusDei from './OpusDei.js'
import Surveillance from './Surveillance.js'
import IronCurtain from './IronCurtain.js'
import FermiParadox from './FermiParadox.js'
import McCarthyism from './McCarthyism.js'
import Area51 from './Area51.js'
import ClownCar from './ClownCar.js'
import Magic8Ball from './Magic8Ball.js'
import Teleprompter from './Teleprompter.js'
import Consulting from './Consulting.js'
import UrbanLegend from './UrbanLegend.js'
import FightClub from './FightClub.js'
import Whatchamacallit from './Whatchamacallit.js'
import InhomogeneousCosmology from './InhomogeneousCosmology.js'
import SecretSanta from './SecretSanta.js'
import Cryptocurrency from './Cryptocurrency.js'
import Printing3D from './3DPrinting.js'
import RideHailing from './RideHailing.js'
import DenverAirport from './DenverAirport.js'
import Hacking from './Hacking.js'
import OrderoftheOccultHand from './OrderoftheOccultHand.js'
import Cloaking from './Cloaking.js'
import FashionMask from './FashionMask.js'
import QuantumComputers from './QuantumComputers.js'
import DarkWeb from './DarkWeb.js'
import GreenHydrogen from './GreenHydrogen.js'
import Holography from './Holography.js'
import EscapeRoom from './EscapeRoom.js'
import MysteryBox from './MysteryBox.js'
import Astrobiology from './Astrobiology.js'
import Metaverse from './Metaverse.js'

// Achievements
import AchievementAnonymity from './achievements/Anonymity.js'
import AchievementConfidence from './achievements/Confidence.js'
import AchievementFolklore from './achievements/Folklore.js'
import AchievementMystery from './achievements/Mystery.js'
import AchievementZen from './achievements/Zen.js'

const cardData: AgeCardData[] = [
  Assassination,
  Maze,
  Pilgrimage,
  Handshake,
  Tomb,
  Woodworking,
  Dance,
  Rumor,
  Silk,
  Espionage,
  Palmistry,
  Proverb,
  Myth,
  Polytheism,
  Symbology,
  Padlock,
  Password,
  Astrology,
  Fingerprints,
  Exile,
  Meteorology,
  Cipher,
  Counterfeiting,
  Steganography,
  Propaganda,
  KnightsTemplar,
  SecretPolice,
  SecretumSecretorum,
  Cliffhanger,
  RedEnvelope,
  Masquerade,
  Freemasons,
  Smuggling,
  Taqiyya,
  BrethrenofPurity,
  Ninja,
  Heirloom,
  TheProphecies,
  SpanishInquisition,
  Blackmail,
  Confession,
  AprilFoolsDay,
  ElDorado,
  Legend,
  Quackery,
  Gallery,
  Cabal,
  Probability,
  WitchTrial,
  BuriedTreasure,
  Pantheism,
  Chartreuse,
  SecretHistory,
  PenName,
  PopularScience,
  Sabotage,
  RedHerring,
  Reconnaissance,
  Sniping,
  Hiking,
  Illuminati,
  Attic,
  SwissBankAccount,
  Placebo,
  Triad,
  Camouflage,
  Subway,
  PrivateEye,
  SafeDepositBox,
  BlackMarket,
  FortuneCookie,
  Mafia,
  PlotVoucher,
  Counterintelligence,
  SlotMachine,
  Concealment,
  ShangriLa,
  Scouting,
  EnigmaMachine,
  Handbag,
  JoyBuzzer,
  Jackalope,
  Hitchhiking,
  Blacklight,
  OpusDei,
  Surveillance,
  IronCurtain,
  FermiParadox,
  McCarthyism,
  Area51,
  ClownCar,
  Magic8Ball,
  Teleprompter,
  Consulting,
  UrbanLegend,
  FightClub,
  Whatchamacallit,
  InhomogeneousCosmology,
  SecretSanta,
  Cryptocurrency,
  Printing3D,
  RideHailing,
  DenverAirport,
  Hacking,
  OrderoftheOccultHand,
  Cloaking,
  FashionMask,
  QuantumComputers,
  DarkWeb,
  GreenHydrogen,
  Holography,
  EscapeRoom,
  MysteryBox,
  Astrobiology,
  Metaverse,
]

const achievementData: AchievementData[] = [
  AchievementAnonymity,
  AchievementConfidence,
  AchievementFolklore,
  AchievementMystery,
  AchievementZen,
]

export { cardData, achievementData }

export default { cardData, achievementData }
