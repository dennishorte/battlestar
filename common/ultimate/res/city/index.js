const cardData = [
  require('./Athens.js'),
  require('./MohenjoDaro.js'),
  require('./Thebes.js'),
  require('./Troy.js'),
  require('./Damascus.js'),
  require('./Yin.js'),
  require('./Hattusa.js'),
  require('./Babylon.js'),
  require('./Memphis.js'),
  require('./Linzi.js'),
  require('./Atlantis.js'),
  require('./Ephesus.js'),
  require('./ChangAn.js'),
  require('./Uruk.js'),
  require('./Jerusalem.js'),
  require('./Tikal.js'),
  require('./Nanjing.js'),
  require('./Nineveh.js'),
  require('./Rome.js'),
  require('./Marseille.js'),
  require('./Teotihuacan.js'),
  require('./Alexandria.js'),
  require('./Carthage.js'),
  require('./Luoyang.js'),
  require('./Sparta.js'),
  require('./Delhi.js'),
  require('./Venice.js'),
  require('./Baghdad.js'),
  require('./Jakarta.js'),
  require('./Barcelona.js'),
  require('./Mecca.js'),
  require('./Hangzhou.js'),
  require('./Cordoba.js'),
  require('./Constantinople.js'),
  require('./Kaifeng.js'),
  require('./Milan.js'),
  require('./Tenochtitlan.js'),
  require('./Florence.js'),
  require('./Beijing.js'),
  require('./Seville.js'),
  require('./Manila.js'),
  require('./Madrid.js'),
  require('./Calicut.js'),
  require('./Frankfurk.js'),
  require('./Lisbon.js'),
  require('./Tokyo.js'),
  require('./Naples.js'),
  require('./Amsterdam.js'),
  require('./Osaka.js'),
  require('./Boston.js'),
  require('./Stockholm.js'),
  require('./Zurich.js'),
  require('./HoiAn.js'),
  require('./Gdansk.js'),
  require('./Algiers.js'),
  require('./RioDeJaneiro.js'),
  require('./NewYorkCity.js'),
  require('./Dublin.js'),
  require('./Tehran.js'),
  require('./Vienna.js'),
  require('./Edinburgh.js'),
  require('./Berlin.js'),
  require('./Paris.js'),
  require('./Philadelphia.js'),
  require('./Bombay.js'),
  require('./Johannesburg.js'),
  require('./Lyon.js'),
  require('./Toronto.js'),
  require('./Montreal.js'),
  require('./Munich.js'),
  require('./London.js'),
  require('./Washington.js'),
  require('./StPetersburg.js'),
  require('./SanFrancisco.js'),
  require('./Melbourne.js'),
  require('./SaoPaulo.js'),
  require('./Kiev.js'),
  require('./Chicago.js'),
  require('./Shanghai.js'),
  require('./BuenosAires.js'),
  require('./Vancouver.js'),
  require('./KualaLumpur.js'),
  require('./Chongqing.js'),
  require('./LosAngeles.js'),
  require('./Hamburg.js'),
  require('./Guadalajara.js'),
  require('./Houston.js'),
  require('./HongKong.js'),
  require('./Moscow.js'),
  require('./Miami.js'),
  require('./Taipei.js'),
  require('./Santiago.js'),
  require('./Sydney.js'),
  require('./Perth.js'),
  require('./Dallas.js'),
  require('./Seoul.js'),
  require('./Bangkok.js'),
  require('./Copenhagen.js'),
  require('./Dubai.js'),
  require('./Brussels.js'),
  require('./Essen.js'),
  require('./Singapore.js'),
  require('./Bangalore.js'),
  require('./Atlanta.js'),
  require('./TelAviv.js')
]

const achievementData = [
  require('./achievements/Fame.js'),
  require('./achievements/Glory.js'),
  require('./achievements/Legend.js'),
  require('./achievements/Repute.js'),
  require('./achievements/Victory.js'),
]

function generateCardInstances() {
  const cards = cardData.map(f => new f())
  const achievements = achievementData.map(f => new f())

  const byName = {}
  for (const card of cards) {
    byName[card.name] = card
  }
  for (const card of achievements) {
    byName[card.name] = card
  }

  const byAge = {}
  for (const i of [1,2,3,4,5,6,7,8,9,10]) {
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
