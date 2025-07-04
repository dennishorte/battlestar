const cardData = [
  require('./Athens.js'),
  require('./ChangAn.js'),
  require('./Thebes.js'),
  require('./Damascus.js'),
  require('./Linzi.js'),
  require('./Uruk.js'),
  require('./Babylon.js'),
  require('./Jerusalem.js'),
  require('./Memphis.js'),
  require('./Atlantis.js'),
  require('./Troy.js'),
  require('./Yin.js'),
  require('./Ephesus.js'),
  require('./Hattusa.js'),
  require('./MohenjoDaro.js'),
  require('./Sparta.js'),
  require('./Tikal.js'),
  require('./Nineveh.js'),
  require('./Teotihuacan.js'),
  require('./Marseille.js'),
  require('./Nanjing.js'),
  require('./Alexandria.js'),
  require('./Carthage.js'),
  require('./Luoyang.js'),
  require('./Rome.js'),
  require('./Barcelona.js'),
  require('./Delhi.js'),
  require('./Jakarta.js'),
  require('./Kaifeng.js'),
  require('./Baghdad.js'),
  require('./Venice.js'),
  require('./Cordoba.js'),
  require('./Hangzhou.js'),
  require('./Constantinople.js'),
  require('./Mecca.js'),
  require('./Milan.js'),
  require('./Tenochtitlan.js'),
  require('./Beijing.js'),
  require('./Lisbon.js'),
  require('./Calicut.js'),
  require('./Manila.js'),
  require('./Frankfurk.js'),
  require('./Madrid.js'),
  require('./Florence.js'),
  require('./Seville.js'),
  require('./Algiers.js'),
  require('./Zurich.js'),
  require('./HoiAn.js'),
  require('./Osaka.js'),
  require('./Amsterdam.js'),
  require('./Stockholm.js'),
  require('./Boston.js'),
  require('./Naples.js'),
  require('./Gdansk.js'),
  require('./Tokyo.js'),
  require('./Philadelphia.js'),
  require('./Tehran.js'),
  require('./Dublin.js'),
  require('./Paris.js'),
  require('./Bombay.js'),
  require('./RioDeJaneiro.js'),
  require('./Berlin.js'),
  require('./Edinburgh.js'),
  require('./NewYorkCity.js'),
  require('./Vienna.js'),
  require('./Lyon.js'),
  require('./Montreal.js'),
  require('./Melbourne.js'),
  require('./StPetersburg.js'),
  require('./London.js'),
  require('./Toronto.js'),
  require('./Johannesburg.js'),
  require('./Munich.js'),
  require('./SanFrancisco.js'),
  require('./Washington.js'),
  require('./KualaLumpur.js'),
  require('./LosAngeles.js'),
  require('./Chicago.js'),
  require('./Shanghai.js'),
  require('./Hamburg.js'),
  require('./SaoPaulo.js'),
  require('./Chongqing.js'),
  require('./Kiev.js'),
  require('./BuenosAires.js'),
  require('./Vancouver.js'),
  require('./Dallas.js'),
  require('./Perth.js'),
  require('./Guadalajara.js'),
  require('./Miami.js'),
  require('./Santiago.js'),
  require('./Sydney.js'),
  require('./Houston.js'),
  require('./Taipei.js'),
  require('./HongKong.js'),
  require('./Moscow.js'),
  require('./Seoul.js'),
  require('./Singapore.js'),
  require('./Copenhagen.js'),
  require('./Dubai.js'),
  require('./Bangkok.js'),
  require('./TelAviv.js'),
  require('./Atlanta.js'),
  require('./Bangalore.js'),
  require('./Brussels.js'),
  require('./Essen.js'),
  require('./Guangzhou.js'),
  require('./Warsaw.js'),
  require('./Nairobi.js'),
  require('./Shenzhen.js'),
  require('./Beirut.js'),
  require('./Riyadh.js'),
  require('./Prague.js'),
  require('./Seattle.js'),
  require('./Brisbane.js'),
  require('./Lima.js')
]

const achievementData = [
  require('./achievements/Fame.js'),
  require('./achievements/Glory.js'),
  require('./achievements/Tradition.js'),
  require('./achievements/Repute.js'),
  require('./achievements/Victory.js'),
]

const { UltimateCard } = require('../../UltimateCard.js')

function generateCardInstances() {
  const cards = cardData.map(data => new UltimateCard(data))
  const achievements = achievementData.map(f => new f())

  const byName = {}
  for (const card of cards) {
    byName[card.name] = card
  }
  for (const card of achievements) {
    byName[card.name] = card
  }

  const byAge = {}
  for (const i of [1,2,3,4,5,6,7,8,9,10,11]) {
    byAge[i] = []
  }
  for (const card of cards) {
    byAge[card.age].push(card)
  }

  return {
    achievements,
    cards,
    byName,
    byAge,
  }
}

module.exports = {
  cardData,
  achievementData,
  generateCardInstances
}
