import type { AgeCardData } from '../../UltimateAgeCard.js'
import type { AchievementData } from '../../UltimateAchievement.js'

import Athens from './Athens.js'
import ChangAn from './ChangAn.js'
import Thebes from './Thebes.js'
import Damascus from './Damascus.js'
import Linzi from './Linzi.js'
import Uruk from './Uruk.js'
import Babylon from './Babylon.js'
import Jerusalem from './Jerusalem.js'
import Memphis from './Memphis.js'
import Atlantis from './Atlantis.js'
import Troy from './Troy.js'
import Yin from './Yin.js'
import Ephesus from './Ephesus.js'
import Hattusa from './Hattusa.js'
import MohenjoDaro from './MohenjoDaro.js'
import Sparta from './Sparta.js'
import Tikal from './Tikal.js'
import Nineveh from './Nineveh.js'
import Teotihuacan from './Teotihuacan.js'
import Marseille from './Marseille.js'
import Nanjing from './Nanjing.js'
import Alexandria from './Alexandria.js'
import Carthage from './Carthage.js'
import Luoyang from './Luoyang.js'
import Rome from './Rome.js'
import Barcelona from './Barcelona.js'
import Delhi from './Delhi.js'
import Jakarta from './Jakarta.js'
import Kaifeng from './Kaifeng.js'
import Baghdad from './Baghdad.js'
import Venice from './Venice.js'
import Cordoba from './Cordoba.js'
import Hangzhou from './Hangzhou.js'
import Constantinople from './Constantinople.js'
import Mecca from './Mecca.js'
import Milan from './Milan.js'
import Tenochtitlan from './Tenochtitlan.js'
import Beijing from './Beijing.js'
import Lisbon from './Lisbon.js'
import Calicut from './Calicut.js'
import Manila from './Manila.js'
import Frankfurk from './Frankfurk.js'
import Madrid from './Madrid.js'
import Florence from './Florence.js'
import Seville from './Seville.js'
import Algiers from './Algiers.js'
import Zurich from './Zurich.js'
import HoiAn from './HoiAn.js'
import Osaka from './Osaka.js'
import Amsterdam from './Amsterdam.js'
import Stockholm from './Stockholm.js'
import Boston from './Boston.js'
import Naples from './Naples.js'
import Gdansk from './Gdansk.js'
import Tokyo from './Tokyo.js'
import Philadelphia from './Philadelphia.js'
import Tehran from './Tehran.js'
import Dublin from './Dublin.js'
import Paris from './Paris.js'
import Bombay from './Bombay.js'
import RioDeJaneiro from './RioDeJaneiro.js'
import Berlin from './Berlin.js'
import Edinburgh from './Edinburgh.js'
import NewYorkCity from './NewYorkCity.js'
import Vienna from './Vienna.js'
import Lyon from './Lyon.js'
import Montreal from './Montreal.js'
import Melbourne from './Melbourne.js'
import StPetersburg from './StPetersburg.js'
import London from './London.js'
import Toronto from './Toronto.js'
import Johannesburg from './Johannesburg.js'
import Munich from './Munich.js'
import SanFrancisco from './SanFrancisco.js'
import Washington from './Washington.js'
import KualaLumpur from './KualaLumpur.js'
import LosAngeles from './LosAngeles.js'
import Chicago from './Chicago.js'
import Shanghai from './Shanghai.js'
import Hamburg from './Hamburg.js'
import SaoPaulo from './SaoPaulo.js'
import Chongqing from './Chongqing.js'
import Kiev from './Kiev.js'
import BuenosAires from './BuenosAires.js'
import Vancouver from './Vancouver.js'
import Dallas from './Dallas.js'
import Perth from './Perth.js'
import Guadalajara from './Guadalajara.js'
import Miami from './Miami.js'
import Santiago from './Santiago.js'
import Sydney from './Sydney.js'
import Houston from './Houston.js'
import Taipei from './Taipei.js'
import HongKong from './HongKong.js'
import Moscow from './Moscow.js'
import Seoul from './Seoul.js'
import Singapore from './Singapore.js'
import Copenhagen from './Copenhagen.js'
import Dubai from './Dubai.js'
import Bangkok from './Bangkok.js'
import TelAviv from './TelAviv.js'
import Atlanta from './Atlanta.js'
import Bangalore from './Bangalore.js'
import Brussels from './Brussels.js'
import Essen from './Essen.js'
import Guangzhou from './Guangzhou.js'
import Warsaw from './Warsaw.js'
import Nairobi from './Nairobi.js'
import Shenzhen from './Shenzhen.js'
import Beirut from './Beirut.js'
import Riyadh from './Riyadh.js'
import Prague from './Prague.js'
import Seattle from './Seattle.js'
import Brisbane from './Brisbane.js'
import Lima from './Lima.js'

// Achievements
import AchievementFame from './achievements/Fame.js'
import AchievementGlory from './achievements/Glory.js'
import AchievementTradition from './achievements/Tradition.js'
import AchievementRepute from './achievements/Repute.js'
import AchievementVictory from './achievements/Victory.js'

const cardData: AgeCardData[] = [
  Athens,
  ChangAn,
  Thebes,
  Damascus,
  Linzi,
  Uruk,
  Babylon,
  Jerusalem,
  Memphis,
  Atlantis,
  Troy,
  Yin,
  Ephesus,
  Hattusa,
  MohenjoDaro,
  Sparta,
  Tikal,
  Nineveh,
  Teotihuacan,
  Marseille,
  Nanjing,
  Alexandria,
  Carthage,
  Luoyang,
  Rome,
  Barcelona,
  Delhi,
  Jakarta,
  Kaifeng,
  Baghdad,
  Venice,
  Cordoba,
  Hangzhou,
  Constantinople,
  Mecca,
  Milan,
  Tenochtitlan,
  Beijing,
  Lisbon,
  Calicut,
  Manila,
  Frankfurk,
  Madrid,
  Florence,
  Seville,
  Algiers,
  Zurich,
  HoiAn,
  Osaka,
  Amsterdam,
  Stockholm,
  Boston,
  Naples,
  Gdansk,
  Tokyo,
  Philadelphia,
  Tehran,
  Dublin,
  Paris,
  Bombay,
  RioDeJaneiro,
  Berlin,
  Edinburgh,
  NewYorkCity,
  Vienna,
  Lyon,
  Montreal,
  Melbourne,
  StPetersburg,
  London,
  Toronto,
  Johannesburg,
  Munich,
  SanFrancisco,
  Washington,
  KualaLumpur,
  LosAngeles,
  Chicago,
  Shanghai,
  Hamburg,
  SaoPaulo,
  Chongqing,
  Kiev,
  BuenosAires,
  Vancouver,
  Dallas,
  Perth,
  Guadalajara,
  Miami,
  Santiago,
  Sydney,
  Houston,
  Taipei,
  HongKong,
  Moscow,
  Seoul,
  Singapore,
  Copenhagen,
  Dubai,
  Bangkok,
  TelAviv,
  Atlanta,
  Bangalore,
  Brussels,
  Essen,
  Guangzhou,
  Warsaw,
  Nairobi,
  Shenzhen,
  Beirut,
  Riyadh,
  Prague,
  Seattle,
  Brisbane,
  Lima,
]

const achievementData: AchievementData[] = [
  AchievementFame,
  AchievementGlory,
  AchievementTradition,
  AchievementRepute,
  AchievementVictory,
]

export { cardData, achievementData }

export default { cardData, achievementData }
