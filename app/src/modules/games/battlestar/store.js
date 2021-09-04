import axios from 'axios'
import bsgutil from './util.js'
import factory from './factory.js'
import util from '@/util.js'


function adjustCounter(state, counter, amount) {
  if (amount === 0) return

  state.game.counters[counter] += amount
  log(state, {
    template: `${counter} adjusted by {amount}`,
    classes: [
      amount > 0 ? 'resource-up' : 'resource-down',
      'admin-action',
    ],
    args: { amount },
  })
}

function clearGrab(state) {
  // Pawn
  state.ui.pawnGrab.playerId = ''

  // Space Component
  state.ui.spaceComponentGrab.component = ''
  state.ui.spaceComponentGrab.source = ''

  // Grab Message
  state.ui.grabbing.message = ''
}

function doSpaceComponentRemove(state) {
  const { component, source } = state.ui.spaceComponentGrab
  removeFromSpaceRegion(state)
  clearGrab(state)

  log(state, {
    template: "{component} returned to supply from {region}",
    classes: ['player-action', 'space-action'],
    args: {
      component: component,
      region: source,
    },
  })
}

function logEnrichArgClasses(msg) {
  if (!msg.args)
    return

  for (const key of Object.keys(msg.args)) {
    // Convert string args to a dict
    if (typeof msg.args[key] !== 'object') {
      msg.args[key] = {
        value: msg.args[key],
      }
    }

    // Ensure the dict has a classes entry
    const classes = msg.args[key].classes || []
    msg.args[key].classes = classes

    if (key === 'player') {
      pushUnique(classes, 'player-name')
    }
    else if (key === 'character') {
      pushUnique(classes, 'character-name')
      pushUnique(classes, bsgutil.characterNameToCssClass(msg.args[key].value))
    }
    else if (key === 'location') {
      pushUnique(classes, 'location-name')
    }
    else if (key === 'phase') {
      pushUnique(classes, 'phase-name')
    }
    else if (key === 'title') {
      pushUnique(classes, 'title-name')
    }
  }
}

function log(state, msgObject) {
  logEnrichArgClasses(msgObject)

  const log = state.game.log
  msgObject.id = log.length
  log.push(msgObject)
}

function pushUnique(array, value) {
  if (array.indexOf(value) === -1) {
    array.push(value)
  }
}

// If the specified skill deck is empty, reshuffle the discard pile into it.
function maybeReshuffleSkill(state, skill) {
  if (state.game.skillDecks[skill].length == 0
    && state.game.skillDiscards[skill].length > 0
  ) {
    const shuffled = util.shuffleArray([...state.game.skillDiscards[skill]])
    state.game.skillDecks[skill] = shuffled
    state.game.skillDiscards[skill] = []

    log(state, {
      template: "{skill} discard shuffled back into deck",
      classes: ['admin-action', 'skill-deck-shuffle'],
      args: { skill },
    })
  }
}

function healBasestar(state, name) {
  state.game.space.ships[name].damage.forEach(token => {
    state.game.space.basestarDamageTokens.push(token)
  })
  state.game.space.ships[name].damage = []
}

function removeFromSpaceRegion(state) {
  const { component, source } = state.ui.spaceComponentGrab
  if (source !== 'supply') {
    const deployRegion = state.game.space.deployed[source]
    const idx = deployRegion.indexOf(component)
    deployRegion.splice(idx, 1)
  }

  if (component.startsWith('basestar')) {
    healBasestar(state, component)
  }
}


export default {
  namespaced: true,

  state() {
    return {
      ////////////////////////////////////////////////////////////
      // UI State
      ui: {
        charactersModal: {
          selected: '',
        },

        playerModal: {
          playerId: '',
        },

        skillCardsModal: {
          selected: '',
        },

        grabbing: {
          message: '',
        },

        pawnGrab: {
          playerId: '',
        },

        spaceComponentGrab: {
          component: '',
          source: '',
        },
      },

      ////////////////////////////////////////////////////////////
      // Game State

      game: {},
    }
  },

  getters: {
    distanceTraveled(state) {
      const cardDistance = state.game.destination.chosen
                                .reduce((acc, next) => acc + next.distance, 0)
      return state.game.destination.bonusDistance + cardDistance
    },

    isPawnGrabbing(state) {
      return !!state.ui.pawnGrab.playerId
    },

    spaceComponentGrabbing(state) {
      return !!state.ui.spaceComponentGrab.component
    },
  },

  mutations: {
    beginSkillCheck(state, card) {
      state.game.skillCheck.active.card = card
    },

    characterAssign(state, { playerId, character }) {
      const player = state.game.players.find(p => p._id === playerId)
      player.character = character.name
      player.location = character.setup

      // Helo starts "Stranded on Caprica".
      // Rather than make a special location for him, just put him on Caprica.
      if (character.name === 'Karl "Helo" Agathon') {
        player.location = 'Caprica'
      }

      log(state, {
        template: "{player} chooses {character}",
        classes: ['character-selection', 'player-action'],
        args: {
          player: player.name,
          character: character.name,
        }
      })
    },

    character_info_request(state, name) {
      state.ui.charactersModal.selected = name
    },

    destinationCardChoose(state, index) {
      state.game.destination.admiralViewing.forEach((viewIdx, card) => {
        if (viewIdx === index) {
          state.game.destination.active = card
        }
        else {
          state.game.destination.discard.push(card)
        }
      })
      state.game.destination.admiralViewing = []


    },

    destinationCardDraw(state) {
      util.shuffleArray(state.game.destination.deck)
      state.game.destination.admiralViewing.push(state.game.destination.deck.pop())
      log(state, {
        template: "Admiral draws a destination card",
        classes: [],
        args: {},
      })
    },

    grabCancel(state) {
      clearGrab(state)
    },

    loadGameData(state, data) {
      this.state.bsg.game = data
    },

    locationRepair(state, name) {
      const damagedLocations = state.game.space.ships.galactica.damage
      const damagedIndex = damagedLocations.indexOf(name)

      if (damagedIndex === -1) {
        alert(`That location is not damaged. ${name}`)
      }

      damagedLocations.splice(damagedIndex, 1)
      state.game.space.galacticaDamageTokens.push(name)
    },

    loyaltyCardDraw(state, playerId) {
      const player = state.game.players.find(p => p._id === playerId)
      const deck = state.game.loyaltyDeck
      player.loyaltyCards.push(deck.pop())

      log(state, {
        template: "{player} ({character}) drew a loyalty card",
        classes: ['loyalty-draw'],
        args: {
          player: player.name,
          character: player.character,
        },
      })
    },

    loyaltyDeckSet(state, deck) {
      state.game.players.forEach(p => p.loyaltyCards = [])
      state.game.loyaltyDeck = deck
      log(state, {
        template: "Loyalty deck created with {numHuman} Human cards and {numCylon} Cylon cards",
        classes: ['loyalty-deck'],
        args: {
          numHuman: deck.filter(c => c.team === 'Human').length,
          numCylon: deck.filter(c => c.team === 'Cylon').length,
        },
      })
    },

    pawnDrop(state, targetRoomName) {
      const playerId = state.ui.pawnGrab.playerId
      const player = state.game.players.find(p => p._id === playerId)
      clearGrab(state)

      player.location = targetRoomName

      log(state, {
        template: "{player} moves {character} to {location}",
        classes: ['pawn-move', 'player-action'],
        args: {
          player: 'tbd',
          character: player.character,
          location: targetRoomName,
        },
      })
    },

    pawnGrab(state, playerId) {
      const player = state.game.players.find(p => p._id === playerId)
      state.ui.grabbing.message = `Holding pawn ${player.character}`
      state.ui.pawnGrab.playerId = playerId
    },

    phaseSet(state, phase) {
      state.game.phase = phase

      log(state, {
        template: "Phase set to {phase}",
        classes: ['phase-change'],
        args: { phase },
      })
    },

    playerShow(state, playerId) {
      state.ui.playerModal.playerId = playerId
    },

    skillCardDraw(state, { skill, playerId }) {
      skill = skill.toLowerCase()
      maybeReshuffleSkill(state, skill)

      const player = state.game.players.find(p => p._id === playerId)
      const draw = state.game.skillDecks[skill].pop()

      if (draw) {
        player.skillCards.push(draw)

        log(state, {
          template: "{player} drew a {skill} card",
          classes: ['player-action', 'skill-card-draw'],
          args: {
            player: player.name,
            skill: skill,
          },
        })
      }
      else {
        log(state, {
          template: "{skill} deck and discard are empty",
          classes: ['admin-action'],
          args: { skill },
        })
      }
    },

    skillCardInfoRequest(state, cardName) {
      state.ui.skillCardsModal.selected = cardName
    },

    spaceComponentDamage(state) {
      const { component, source } = state.ui.spaceComponentGrab

      if (component === 'viper') {
        state.game.space.ships.viper.damaged += 1
        removeFromSpaceRegion(state)
        log(state, {
          template: 'Viper from region {region} damaged',
          classes: ['space-action', 'admin-action'],
          args: {
            region: source,
          },
        })
      }
      else if (component.startsWith('basestar')) {
        const letter = component[component.length - 1].toUpperCase()
        const key = 'basestar' + letter

        const damageToken = util.shuffleArray(state.game.space.basestarDamageTokens).pop()
        if (!damageToken) {
          alert('No more damage tokens for basestars')
          return
        }

        state.game.space.ships[key].damage.push(damageToken)
        log(state, {
          template: `{basestar} gains {token} damage token`,
          classes: ['space-action', 'admin-action'],
          args: {
            basestar: key,
            token: damageToken,
          },
        })
      }
      else if (component === 'galactica') {
        const damageToken = util.shuffleArray(state.game.space.galacticaDamageTokens).pop()
        if (!damageToken) {
          alert('No more damage tokens for galactica. Usually this means humans lose.')
          return
        }

        log(state, {
          template: `Galactica gains {token} damage token`,
          classes: ['space-action', 'admin-action'],
          args: {
            token: damageToken,
          },
        })

        if (damageToken === '-1 fuel') {
          adjustCounter(state, 'fuel', -1)
        }
        else if (damageToken === '-1 food') {
          adjustCounter(state, 'food', -1)
        }
        else {
          state.game.space.ships.galactica.damage.push(damageToken)
        }
      }

      clearGrab(state)
    },

    spaceComponentDestroy(state) {
      const { component, source } = state.ui.spaceComponentGrab

      if (component === 'viper') {
        state.game.space.ships.viper.destroyed += 1
        log(state, {
          template: 'Viper from region {region} destroyed',
          classes: ['space-action', 'admin-action'],
          args: {
            region: source,
          },
        })
        removeFromSpaceRegion(state)
        clearGrab(state)
      }
      else if (component === 'civilian') {
        state.game.space.ships.civilian.destroyed += 1
        const destroyed = state.game.space.ships.civilian.remaining.pop()
        log(state, {
          template: 'Civilian ship destroyed: {effect}',
          classes: ['space-action', 'admin-action'],
          args: {
            effect: destroyed.effect,
          },
        })
        adjustCounter(state, 'population', destroyed.population)
        adjustCounter(state, 'morale', destroyed.morale)
        adjustCounter(state, 'fuel', destroyed.fuel)
        removeFromSpaceRegion(state)
        clearGrab(state)
      }
      else {
        doSpaceComponentRemove(state)
      }
    },

    spaceComponentDrop(state, target) {
      const { component, source } = state.ui.spaceComponentGrab

      removeFromSpaceRegion(state)
      clearGrab(state)

      // Add the component to the new region
      state.game.space.deployed[target].push(component)

      log(state, {
        template: "{player} moved {component} from {source} to {target}",
        classes: ['space-action', 'player-action'],
        args: {
          player: 'tbd',
          component,
          source: {
            value: source,
            classes: ['space-location'],
          },
          target: {
            value: target,
            classes: ['space-location'],
          },
        },
      })
    },

    spaceComponentGrab(state, { component, source, message }) {
      state.ui.spaceComponentGrab.component = component
      state.ui.spaceComponentGrab.source = source
      state.ui.grabbing.message = message
    },

    spaceComponentRemove(state) {
      doSpaceComponentRemove(state)
    },

    spaceComponentsClear(state) {
      state.game.space.deployed = [[], [], [], [], [], []]
      healBasestar('basestarA')
      healBasestar('basestarB')

      log(state, {
        template: "All space components returned to the supply",
        classes: ['admin-action', 'space-action'],
        args: {},
      })
    },

    titleAssign(state, { title, character }) {
      state.game.titles[title] = character
      log(state, {
        template: "{character} becomes the {title}",
        classes: ['title-assign'],
        args: {
          title,
          character,
        },
      })
    }
  },

  actions: {
    async load(context, data) {
      if (data) {
        if (!data.initialized) {
          await factory.initialize(data)
        }

        context.commit('loadGameData', data)
        await context.dispatch('save')
      }
      else {
        context.commit('loadGameData', data)
      }
    },

    async save({ state }) {
      const requestResult = await axios.post('/api/game/save', state.game)
      if (requestResult.data.status !== 'success') {
        throw requestResult.data.message
      }
    },
  },
}
