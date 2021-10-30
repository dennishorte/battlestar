/*
   All actions are automatically wrapped in a session.
 */

const bsgutil = require('./util.js')
const util = require('../lib/util.js')


const Actions = {}

Actions.aActivateBasestarAttacks = function() {
  for (const letter of ['A', 'B']) {
    const zone = game.getZoneBasestarByLetter(letter)
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
    this.aBasestarsLaunch('heavy raider')
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

  let noHeavyRaiders = true
  let noRaiders = true
  for (let i = 0; i < 6; i++) {
    const spaceZone = this.getZoneByName(`space.space${i}`)

    // By iterating backwards, we ensure that even if we remove cards from the list
    // by moving them, we still iterate over all of the elements.
    for (let i = spaceZone.cards.length - 1; i >= 0; i--) {
      const ship = spaceZone.cards[i]
      if (kind === 'Raiders' && ship.name === 'raider') {
        noRaiders = false
        if (this.checkZoneContains(spaceZone, c => c.name === 'raider')) {

        }
        else if (this.checkZoneContains(spaceZone, c => c.name === 'civilian')) {

        }
        else if (this.getZonesContaining(c => c.name === 'civilian')) {

        }
        else {
          this.aAttackGalactica(ship)
        }
      }

      else if (kind === 'Raiders Launch' && ship.name.startsWith('Basestar')) {
        let count = 3
        if (game.checkEffect('Cylon Swarm')) {
          count += 1
        }
        this.mDeploy(spaceZone, 'raider', count)
      }

    }
  }

  if (kind === 'Raiders' && noRaiders) {
    const basestarZones = this.getZonesWithBasestars()
    if (basestarZones) {
      this.mLog({ template: 'Basestars launch raiders' })
    }

    let count = 2
    if (this.checkEffect('Cylon Swarm')) {
      count += 1
    }

    for (const zone of basestarZones) {
      for (const ship of zone.cards) {
        if (ship.name.startsWith('Basestar')) {
          this.mDeploy(zone, 'raider', count)
        }
      }
    }
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
  const card = this.getCardByName('Admiral')
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
  const card = this.getCardByName('President')
  const playerHand = this.getZoneByPlayer(player.name).cards
  this.mLog({
    template: '{player} becomes the President',
    args: {
      player: player.name
    }
  })
  this.rk.session.move(card, playerHand)
}

Actions.aBasestarsLaunch = function(kind) {
  // Are there any basestars to launch from?
  const basestarZones = this.getZonesWithBasestars()
  if (basestarZones.length === 0) {
    return
  }

  // How many to launch
  let count = 1
  if (kind === 'raider') {
    count += 1
  }
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
  this.mMoveCard('decks.crisis', 'common')
  const card = this.getZoneByName('common').cards.slice(-1)[0]

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

Actions.aDamageLocationByName = function(locationName) {
  // Get the damage token from the damage bag
  const bag = this.getZoneByName('decks.damageGalactica').cards
  const token = bag.find(c => c.name === `Damage ${locationName}`)

  util.assert(!!token, `Unable to find damage token for ${locationName}`)

  this.mLog({
    template: '{location} damaged',
    args: {
      location: locationName
    },
  })

  // Move it to the damaged location
  const location = this.getZoneByLocationName(locationName)
  this.rk.session.move(token, location.cards, location.cards.length)
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
  cards = this._adjustCardsParam(cards)

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
