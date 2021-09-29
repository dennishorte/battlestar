import RecordKeeperSession from './recordkeepersession'


export default function RecordKeeper(game) {
  this.game = game
  this.diffs = game.history
  this.undone = []
  this.record = 'session'
  this.session = null
}

RecordKeeper.prototype.load = load

RecordKeeper.prototype.sessionStart = sessionStart
RecordKeeper.prototype.redo = redo
RecordKeeper.prototype.undo = undo

RecordKeeper.prototype.at = RecordKeeperSession.prototype.at
RecordKeeper.prototype.path = RecordKeeperSession.prototype.path
RecordKeeper.prototype.patch = RecordKeeperSession.prototype.patch
RecordKeeper.prototype.reverse = RecordKeeperSession.prototype.reverse

function load(game) {
  this.game = game
  this.diffs = game.history
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

  this.game.hasUndone = !!this.undone.length
}

function redo() {
  const diff = this.undone.pop()
  this.diffs.push(diff)
  for (const step of diff) {
    this.patch(step)
  }

  this.game.hasUndone = !!this.undone.length
}
