import RecordKeeperSession from './recordkeepersession'


export default function RecordKeeper(state) {
  this.state = state
  this.diffs = state.history
  this.undone = []
  this.record = 'session'
  this.session = null
}

RecordKeeper.prototype.loadState = loadState

RecordKeeper.prototype.sessionStart = sessionStart
RecordKeeper.prototype.redo = redo
RecordKeeper.prototype.undo = undo

RecordKeeper.prototype.at = RecordKeeperSession.prototype.at
RecordKeeper.prototype.path = RecordKeeperSession.prototype.path
RecordKeeper.prototype.patch = RecordKeeperSession.prototype.patch
RecordKeeper.prototype.reverse = RecordKeeperSession.prototype.reverse

function loadState(state) {
  this.state = state
  this.diffs = state.history
}

function sessionStart(func) {
  if (this.session) {
    throw "Session in progress. Can't start new session."
  }

  else if (func) {
    this.session = new RecordKeeperSession(this)
    func(this.session)
    this.session.commit()
  }

  else {
    this.session = new RecordKeeperSession(this)
    return this.session
  }
}

function undo() {
  const diff = this.diffs.pop()
  this.undone.push(diff)
  const reversed = [...diff].reverse()
  for (const step of reversed) {
    this.reverse(step)
  }

  this.state.hasUndone = !!this.undone.length
}

function redo() {
  const diff = this.undone.pop()
  this.diffs.push(diff)
  for (const step of diff) {
    this.patch(step)
  }

  this.state.hasUndone = !!this.undone.length
}
