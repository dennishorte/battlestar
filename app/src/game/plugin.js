import axios from 'axios'
import { bsg, util } from 'battlestar-common'

const assert = util.assert


export default {
  install: function(Vue) {
    Vue.prototype.$game = game
  }
}

function GamePlugin() {
  this.prep = {
    state: null,
    transitions: null,
    actor: null,
  }

  this.data = {
    raw: {},
    filtered: {},
  },

  this.ui = {
    grab: {
      source: '',
      index: -1,
    },
    modal: {
      cardInfo: {},
      characters: '',
      error: '',
      locations: '',
      skillCards: '',
      zoneInfo: '',
    },
  }
  bsg.Game.call(this)
}

////////////////////////////////////////////////////////////////////////////////
// Prototype inheritance

GamePlugin.prototype = Object.create(bsg.Game.prototype)
Object.defineProperty(GamePlugin.prototype, 'constructor', {
  value: GamePlugin,
  enumerable: false,
  writable: true
})


////////////////////////////////////////////////////////////////////////////////
// Initialization

GamePlugin.prototype.ready = function() {
  assert(!!this.prep.actor, "Actor has not yet been set")
  assert(!!this.prep.state, "State has not yet been set")
  assert(!!this.prep.transitions, "Transitions has not yet been set")

  this.load(
    this.prep.transitions,
    this.prep.state,
    this.prep.actor,
  )

  this.run()

  // Load the static deck data used in info panels
  this.data.raw = bsg.res
  this.data.filtered = {}
  for (const [key, cards] of Object.entries(bsg.res)) {
    this.data.filtered[key] = bsg.util.expansionFilter(cards, this.state.options.expansions)
  }
}

GamePlugin.prototype.setActor = function(actor) {
  this.prep.actor = actor
}

GamePlugin.prototype.setState = function(state) {
  this.prep.state = state
}

GamePlugin.prototype.setToaster = function(toaster) {
  this.toaster = toaster
}

GamePlugin.prototype.setTransitions = function(transitions) {
  this.prep.transitions = transitions
}


////////////////////////////////////////////////////////////////////////////////
// Special

GamePlugin.prototype.save = async function() {
  const requestResult = await axios.post('/api/game/save', this.state)
  if (requestResult.data.status !== 'success') {
    this.ui.modal.error = requestResult.data.message
  }
  else {
    this.toaster('saved')
  }
}


////////////////////////////////////////////////////////////////////////////////
// UI interactions

GamePlugin.prototype.actionCancelGrab = function() {
  this.ui.grab.source = ''
  this.ui.grab.index = -1
}

GamePlugin.prototype.actionClickZone = function(source, index) {
  console.log('actionClickZone', source, index)
}

GamePlugin.prototype.actionShowInfoAboutGrabbedCard = function() {
  const grab = this.ui.grab
  const card = this.getCardByLocation(grab.source, grab.index)
  this.actionCancelGrab()

  if (card.kind === 'character') {
    this.ui.modal.characters = card.name
    return 'characters-modal'
  }
  else if (card.kind === 'skill') {
    this.ui.modal.skillCards = card.name
    return 'skill-cards-modal'
  }
  else {
    this.ui.modal.cardInfo = card
    return 'card-modal'
  }
}

const game = new GamePlugin()
