/*
   All actions are automatically wrapped in a session.
 */

const bsgutil = require('./util.js')
const util = require('../lib/util.js')


const Actions = {}

Actions.aActivateBasestarAttacks = function() {
  for (const letter of ['A', 'B']) {
    const zone = this.getZoneBasestarByLetter(letter)
    const { card, zoneName } = this.getCardByPredicate(c => c.name === `Basestar ${letter}`)
    const damagedWeapons = this.checkBasestarEffect(card, 'disabled weapons')

    // If the ship is not in space, then it isn't deployed and shouldn't attack
    if (!zoneName.startsWith('space')) {
      continue
    }

    // If the ship has damaged weapons, it can't shoot
    if (damagedWeapons) {
      this.mLog({ template: `Basestar ${letter} has damaged weapons and can't attack` })
      continue
    }

    this.aAttackGalactica(card)
  }
}

Actions.aActivateCenturions = function() {
  this.mLog({ template: 'Centurions advance' })

  for (let i = 3; i >= 0; i--) {
    const zone = this.getZoneCenturionsByIndex(i)
    while (zone.cards.length) {
      this.mMoveCard(zone, this.getZoneCenturionsByIndex(i + 1))
    }
  }

  // A centurion has moved into the final space of the centurion track.
  // The game is over, and the humans have lost.
  if (this.getZoneCenturionsByIndex(3).cards.length > 0) {
    this.mSetGameResult({
      winner: 'cylons',
      reason: 'centurions',
    })
  }
}

Actions.aActivateHeavyRaiders = function() {
  const heavyRaidersInfo = this
    .getCardsByPredicate(c => c.kind === 'ships.heavyRaiders')
    .filter(info => info.zoneName.startsWith('space.'))

  if (heavyRaidersInfo.length === 0) {
    this.aBasestarsLaunch('heavy raider', 1)
  }
  else {
    for (const info of heavyRaidersInfo) {
      const spaceIndex = parseInt(info.zoneName.slice(-1))
      const spaceZone = this.getZoneByName(info.zoneName)

      if (spaceIndex == 0 || spaceIndex == 1) {
        // counter-clockwise
        const newZone = this.getZoneAdjacentToSpaceZone(spaceZone)[1]
        this.mMoveCard(spaceZone, newZone, info.card)
      }
      else if (spaceIndex == 2 || spaceIndex == 3) {
        // clockwise
        const newZone = this.getZoneAdjacentToSpaceZone(spaceZone)[0]
        this.mMoveCard(spaceZone, newZone, info.card)
      }
      else {
        // land centurion
        this.mDiscard(info.card)
        this.mAddCenturion()
        this.mLog({ template: 'A centurion successfully boards Galactica' })
      }
    }
  }
}

Actions.aActivateRaider = function(raiderInfo) {
  const spaceZone = this.getZoneByName(raiderInfo.zoneName)
  const spaceZonesWithCivilians = this.getZonesSpaceContaining(c => c.kind === 'civilian')

  if (this.checkZoneContains(spaceZone, c => c.kind === 'ships.vipers')) {
    const roll = bsgutil.rollDie()
    if (roll === 8) {
      this.mRemoveViperAt(spaceZone, 'destroy')
    }
    else if (roll >= 5) {
      this.mRemoveViperAt(spaceZone, 'damage')
    }
    else {
      this.mLog({
        template: 'Raider in {location} misses',
        args: {
          location: spaceZone.name,
        }
      })
    }
  }
  else if (this.checkZoneContains(spaceZone, c => c.kind === 'civilian')) {
    const civvie = spaceZone.cards.find(c => c.kind === 'civilian')
    this.aDestroyCivilian(civvie)
  }
  else if (spaceZonesWithCivilians.length > 0) {
    const clockwiseDistance = this.getDistanceToCivilian(spaceZone, 'clockwise')
    const counterDistance = this.getDistanceToCivilian(spaceZone, 'counter')

    if (clockwiseDistance <= counterDistance) {
      this.mMoveAroundSpace(raiderInfo.card, 'clockwise')
    }
    else {
      this.mMoveAroundSpace(raiderInfo.card, 'counter-clockwise')
    }
  }
  else {
    this.aAttackGalactica(raiderInfo.card)
  }
}

Actions.aActivateRaiders = function() {
  const raidersInfo = this
    .getCardsByPredicate(c => c.kind === 'ships.raiders')
    .filter(info => info.zoneName.startsWith('space.'))

  if (raidersInfo.length === 0) {
    this.aBasestarsLaunch('raider', 2)
  }
  else {
    for (const info of raidersInfo) {
      this.aActivateRaider(info)
    }
  }
}

Actions.aActivateCylonShips = function(kind) {
  this.mLog({
    template: 'Activating Cylon ships: {kind}',
    args: { kind }
  })

  if (kind === 'Hvy Raiders') {
    this.aActivateCenturions()
    this.aActivateHeavyRaiders()
  }
  else if (kind === 'Basestar Attacks') {
    this.aActivateBasestarAttacks()
  }
  else if (kind === 'Raiders Launch') {
    this.aBasestarsLaunch('raiders', 3)
  }
  else if (kind === 'Raiders') {
    this.aActivateRaiders()
  }
  else {
    throw new Error(`Unknown cylon activation: ${kind}`)
  }
}

Actions.aAddDestinyCards = function() {
  const destiny = this.getZoneByName('destiny')
  util.assert(destiny.cards.length % 2 === 0, 'Odd number of cards in destiny deck')

  // refill the destiny zone if it is empty
  if (destiny.cards.length === 0) {
    this.mLog({ template: 'refilling destiny deck' })
    for (const skill of bsgutil.skillList) {
      if (skill === 'treachery') {
        continue
      }

      const deck = this.getZoneByName(`decks.${skill}`)
      for (let i = 0; i < 2; i++) {
        this.mMoveCard(deck, destiny)
      }
    }
  }

  // Move two destiny cards into the crisis pool
  for (let i = 0; i < 2; i++) {
    this.mMoveCard('destiny', 'crisisPool')
  }
}

Actions.aAssignAdmiral = function(player) {
  player = this._adjustPlayerParam(player)
  const card = this.getCardByKindAndName('title', 'Admiral')
  const playerHand = this.getZoneByPlayer(player).cards
  this.mLog({
    template: '{player} becomes the Admiral',
    args: {
      player: player.name
    }
  })
  this.rk.session.move(card, playerHand)
}

Actions.aAssignPresident = function(player) {
  player = this._adjustPlayerParam(player)
  const card = this.getCardByKindAndName('title', 'President')
  const playerHand = this.getZoneByPlayer(player.name).cards
  this.mLog({
    template: '{player} becomes the President',
    args: {
      player: player.name
    }
  })
  this.rk.session.move(card, playerHand)
}

Actions.aAttackGalactica = function(ship) {
  const dieRoll = bsgutil.rollDie()
  let hit = false

  if (ship.name.startsWith('Basestar')) {
    if (dieRoll >= 4) {
      hit = true
    }
  }
  else if (ship.name === 'raider') {
    if (dieRoll === 8) {
      hit = true
    }
  }
  else {
    throw new Error(`Unknown ship attacking Galactica: ${ship.name}`)
  }

  if (hit) {
    this.mLog({ template: `${ship.name} damages Galactica` })
    this.aDamageGalactica()
  }
  else {
    this.mLog({ template: `${ship.name} misses Galactica` })
  }
}

Actions.aBasestarsLaunch = function(kind, count) {
  // Are there any basestars to launch from?
  const basestarZones = this.getZonesWithBasestars()
  if (basestarZones.length === 0) {
    return
  }

  // How many to launch
  if (this.checkEffect('Cylon Swarm')) {
    count += 1
  }

  // Launch them
  for (const zone of basestarZones) {
    for (const ship of zone.cards) {
      if (ship.name.startsWith('Basestar')) {
        if (this.checkBasestarEffect(ship, 'disabled hangar')) {
          this.mLog({
            template: `${ship.name} can't launch due to disabled hangar`
          })
        }
        else {
          this.mLog({ template: `Basestars launch ${kind}` })
          this.mDeploy(zone, kind, count)
        }
      }
    }
  }

}

Actions.aBeginCrisis = function() {
  this.mMoveCard('decks.crisis', 'keep')
  const card = this.getZoneByName('keep').cards.slice(-1)[0]
  this.mSetCrisisActive(card)

  this.mLog({
    template: '{card} crisis begins',
    args: { card }
  })
}

Actions.aClearSpace = function() {
  this.mLog({
    template: 'Clearing all ships from space'
  })

  for (let i = 0; i < 6; i++) {
    const spaceZone = this.getZoneByName(`space.space${i}`)
    while (spaceZone.cards.length) {
      this.mDiscard(spaceZone.cards[0])
    }
  }
}

Actions.aDamageGalactica = function() {
  const token = this.getTokenDamageGalactica()

  // One time resource loss tokens
  if (token.name.startsWith('-1')) {
    const lost = token.name.slice(3)
    this.mAdjustCounterByName(lost, -1)
    this.mMoveCard('decks.damageGalactica', 'exile', token)
  }

  // Galactica area damage tokens
  else {
    const locationName = token.name.slice(7)
    this.aDamageLocationByName(locationName)
  }
}

Actions.aDamageLocationByName = function(locationName) {
  // Get the damage token from the damage bag
  const bag = this.getZoneByName('decks.damageGalactica')
  const token = bag.cards.find(c => c.name === `Damage ${locationName}`)

  util.assert(!!token, `Unable to find damage token for ${locationName}`)

  this.mLog({
    template: '{location} damaged',
    args: {
      location: locationName
    },
  })

  // Move it to the damaged location
  this.mMoveCard(bag, this.getZoneByLocationName(locationName), token)
}

Actions.aDeployShips = function(deployData) {
  this.mLog({ 'template': 'deploying ships' })

  for (let i = 0; i < 6; i++) {
    const spaceZone = this.getZoneByName(`space.space${i}`)
    const shipNames = deployData[i]

    for (const name of shipNames) {
      this.mDeploy(spaceZone, name)
    }
  }
}

Actions.aDestroyCivilian = function(civvie) {
  civvie = this._adjustCardParam(civvie)

  if (civvie.effect === 'Nothing') {
    this.mLog({ template: 'Raider destroys a civilian; no significant losses' })
  }
  else {
    this.mLog({ template: `Raider destroys a civilian; effect: ${civvie.effect}` })
    const costs = civvie.effect.split(', ')
    for (const cost of costs) {
      const name = cost.slice(3)
      const amount = parseInt(costs.slice(0, 2))
      this.mAdjustCounterByName(name, amount)
    }
  }

  this.mExile(civvie)
}

Actions.aDestroyColonialOne = function() {
  this.mLog({
    template: 'Colonial One destroyed',
    actor: 'admin'
  })

  this.rk.session.put(this.state.flags, 'colonialOneDestroyed', true)

  for (const location of this.getLocationsByArea('Colonial One')) {
    for (const card of location.cards) {
      if (card.kind === 'player-token') {
        this.mLog({
          template: '{player} sent to {location}',
          actor: 'admin',
          args: {
            player: card.name,
            location: 'Sickbay'
          }
        })

        this.mMovePlayer(card.name, 'Sickbay')
      }
    }
  }
}

Actions.aDiscardSkillCards = function(player, cards) {
  player = this._adjustPlayerParam(player)
  cards = this._adjustCardParam(cards)

  this.mLog({
    template: '{player} discards {cards}',
    args: {
      player: player.name,
      cards: cards.map(c => c.name).join(', ')
    }
  })

  for (const card of cards) {
    const discard = this.getZoneDiscardByCard(card).cards
    this.rk.session.move(card, discard)
  }
}

Actions.aDrawSkillCards = function(player, skills) {
  player = this._adjustPlayerParam(player)

  this.mLog({
    template: `{player} draws {skills}`,
    actor: player.name,
    args: {
      player: player.name,
      skills: skills.join(', ')
    }
  })

  for (const skill of skills) {
    this.mDrawSkillCard(player, skill)
  }
}

Actions.aLaunchSelfInViper = function(player, position) {
  player = this._adjustPlayerParam(player)

  util.assert(
    position.startsWith('Lower '),
    'Invalid launch position. Valid options are `Lower Left` and `Lower Right`'
  )

  this.mLog({
    template: `{player} rides a Viper into space at {position}`,
    args: {
      player: player.name,
      position,
    }
  })

  const spaceZoneName = position === 'Lower Left' ? 'space.space5' : 'space.space4'
  this.mMovePlayer(player, spaceZoneName)
  this.mLaunchViper(position)
}

Actions.aReturnAllVipersToSupply = function() {
  for (let i = 0; i < 6; i++) {
    const zone = this.getZoneSpaceByIndex(i)
    while (this.checkZoneContains(zone, c => c.kind === 'ships.vipers')) {
      this.mRemoveViperAt(zone, 'land')
    }
  }
}

// If count is less than the number of loyalty cards held by target player,
// the viewed cards are selected at random.
Actions.aRevealLoyaltyCards = function(target, viewer, count) {
  target = this._adjustPlayerParam(target)
  viewer = this._adjustPlayerParam(viewer)

  const cards = this.getCardsLoyaltyByPlayer(target)
  const cardIdsToView = util.array.shuffle(cards.map(c => c.id)).slice(0, count)
  const cardsToView = cards.filter(c => cardIdsToView.includes(c.id))

  for (const card of cardsToView) {
    util.array.pushUnique(card.visibility, viewer.name)
    this.mLog({
      template: '{player1} looks at {card} belonging to {player2}',
      args: {
        player1: viewer.name,
        player2: target.name,
        card: card,
      }
    })
  }
}

Actions.aSelectCharacter = function(player, characterName) {
  player = this._adjustPlayerParam(player)

  this.mLog({
    template: "{player} chooses {character}",
    args: {
      player: player.name,
      character: characterName,
    }
  })

  // Put the character card into the player's hand
  const playerHand = this.getZoneByPlayer(player.name).cards
  const characterZone = this.getZoneByName('decks.character')
  const characterCard = characterZone.cards.find(c => c.name === characterName)
  this.rk.session.move(characterCard, playerHand, 0)

  // Helo doesn't start on the game board. Leave his player token with the player for now.
  if (characterName === 'Karl "Helo" Agathon') {}

  // Apollo starts in a Viper. He needs to make a choice about where to launch.
  else if (characterName === 'Lee "Apollo" Adama') {}

  // Put the player's pawn in the correct location
  else {
    const pawn = playerHand.find(c => c.kind === 'player-token')
    const startingLocation = this.getZoneByLocationName(characterCard.setup)
    this.rk.session.move(pawn, startingLocation.cards)
  }
}

Actions.aSelectSkillCheckResult = function(result) {
  const skillCheck = this.getSkillCheck()

  util.assert(
    result === 'pass' || result === 'fail',
    `Unknown skill check result selected: ${result}`
  )
  util.assert(
    !!skillCheck,
    `No skill check in progress; can't set result`
  )

  this.rk.session.put(skillCheck, 'result', result)

  // End the existing session and rerun the current transition.
  this.rk.session.commit()
  this.run()
}

// Uses the lowest value card of the provided name
Actions.aUseSkillCardByName = function(player, name) {
  player = this._adjustPlayerParam(player)

  const cards = this
    .getZoneByPlayer(player)
    .cards
    .filter(c => c.name === name)
    .sort((l, r) => l.value - r.value)

  util.assert(cards.length, `${player.name} doesn't have any cards named ${name}`)

  const card = cards[0]
  const discard = this.getZoneDiscardByCard(card).cards

  this.rk.session.move(card, discard)
  this.mLog({
    template: '{player} uses {card} {value}',
    args: {
      player: player.name,
      card: card,
      value: card.value
    }
  })
}


////////////////////////////////////////////////////////////////////////////////
// Exports

function wrapper(func) {
  return function() {
    const inSession = !!this.rk.session

    if (!inSession) {
      this.rk.sessionStart()
    }

    func.call(this, ...arguments)

    // Allow actions to close sessions and (possibly) open new ones if needed
    if (!inSession && this.rk.session) {
      this.rk.session.commit()
    }
  }
}


const wrappedActions = {}

for (const [name, func] of Object.entries(Actions)) {
  wrappedActions[name] = wrapper(func)
}

module.exports = wrappedActions
