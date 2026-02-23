const handlers = {
  // Base Game
  'federation-of-sol': require('./federation-of-sol.js'),
  'barony-of-letnev': require('./barony-of-letnev.js'),
  'naalu-collective': require('./naalu-collective.js'),
  'emirates-of-hacan': require('./emirates-of-hacan.js'),
  'mentak-coalition': require('./mentak-coalition.js'),
  'yssaril-tribes': require('./yssaril-tribes.js'),
  'universities-of-jol-nar': require('./universities-of-jol-nar.js'),
  'sardakk-norr': require('./sardakk-norr.js'),
  'arborec': require('./arborec.js'),
  'clan-of-saar': require('./clan-of-saar.js'),
  'embers-of-muaat': require('./embers-of-muaat.js'),
  'yin-brotherhood': require('./yin-brotherhood.js'),
  'l1z1x-mindnet': require('./l1z1x-mindnet.js'),
  'winnu': require('./winnu.js'),
  'xxcha-kingdom': require('./xxcha-kingdom.js'),
  'ghosts-of-creuss': require('./ghosts-of-creuss.js'),
  'nekro-virus': require('./nekro-virus.js'),

  // Prophecy of Kings
  'argent-flight': require('./argent-flight.js'),
  'empyrean': require('./empyrean.js'),
  'mahact-gene-sorcerers': require('./mahact-gene-sorcerers.js'),
  'naaz-rokha-alliance': require('./naaz-rokha-alliance.js'),
  'nomad': require('./nomad.js'),
  'titans-of-ul': require('./titans-of-ul.js'),
  'vuil-raith-cabal': require('./vuil-raith-cabal.js'),

  // Codex
  'council-keleres': require('./council-keleres.js'),
}

function getHandler(factionId) {
  return handlers[factionId] || null
}

module.exports = { handlers, getHandler }
