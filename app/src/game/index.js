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
  bsg.Game.call(this)
}

GamePlugin.prototype = Object.create(bsg.Game.prototype)
Object.defineProperty(GamePlugin.prototype, 'constructor', {
  value: GamePlugin,
  enumerable: false,
  writable: true
})

GamePlugin.prototype.ready = function() {
  assert(!!this.prep.actor, "Actor has not yet been set")
  assert(!!this.prep.state, "State has not yet been set")
  assert(!!this.prep.transitions, "Transitions has not yet been set")

  this.load(
    this.prep.transitions,
    this.prep.state,
    this.prep.actor,
  )
}

GamePlugin.prototype.setActor = function(actor) {
  this.prep.actor = actor
}

GamePlugin.prototype.setState = function(state) {
  this.prep.state = state
}

GamePlugin.prototype.setTransitions = function(transitions) {
  this.prep.transitions = transitions
}

const game = new GamePlugin()
