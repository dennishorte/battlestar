function deepcopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}


export default function RecordKeeper(state) {
  this.state = state
  this.diffs = []
  this.undone = []
  this.record = 'session'
  this.session = null
}

// Given a path, return the value at that path in this.state
RecordKeeper.prototype.at = at

// Give an object, return the path to it in this.state
RecordKeeper.prototype.path = path

RecordKeeper.prototype.sessionStart = sessionStart
RecordKeeper.prototype.redo = redo
RecordKeeper.prototype.undo = undo

RecordKeeper.prototype.patch = patch
RecordKeeper.prototype.reverse = reverse


function RecordKeeperSession(rk) {
  this.rk = rk
  this.state = rk.state
  this.diffs = []
  this.record = 'diff'
}

RecordKeeperSession.prototype.at = at
RecordKeeperSession.prototype.path = path

RecordKeeperSession.prototype.cancel = cancel
RecordKeeperSession.prototype.commit = commit
RecordKeeperSession.prototype._close = _close

RecordKeeperSession.prototype.patch = patch
RecordKeeperSession.prototype.reverse = reverse

RecordKeeperSession.prototype.put = put
RecordKeeperSession.prototype.replace = replace
RecordKeeperSession.prototype.splice = splice

function cancel() {
  while (this.diffs.length) {
    this.reverse(this.diffs.pop())
    this.diffs.pop() // Remove the just reversed diff from saved diffs
  }
  this._close()
}

function commit() {
  if (this.diffs.length) {
    this.rk.diffs.push(this.diffs)
  }
  this._close()
}

function _close() {
  // Session is now closed
  this.rk.session = null
  this.diffs = null
  this.state = null
  this.rk = null
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
}

function redo() {
  const diff = this.undone.pop()
  this.diffs.push(diff)
  for (const step of diff) {
    this.patch(step)
  }
}

function patch(diff) {
  if (this.record === 'diff') {
    this.diffs.push(diff)
  }

  const target = this.at(diff.path)

  // Ensure the current value matches the `old` valud from the diff
  if (diff.kind === 'put') {
    if (JSON.stringify(target[diff.key]) !== JSON.stringify(diff.old)) {
      console.log({
        target: target,
        diff: JSON.parse(JSON.stringify(diff)),
      })
      throw `Can't patch because old doesn't match: ${diff.path}.${diff.key} !== ${diff.old}`
    }

    target[diff.key] = deepcopy(diff.new)
  }

  else if (diff.kind === 'splice') {
    if (!Array.isArray(target)) {
      throw `${diff.path} is not an array`
    }

    target.splice(diff.key, diff.old.length, ...diff.new)
  }

  else {
    throw `Unknown diff kind: ${diff.kind}`
  }
}

function reverse(diff) {
  const reversed = {...diff}
  reversed.old = diff.new
  reversed.new = diff.old
  this.patch(reversed)
}

function put(object, key, value) {
  this.patch({
    kind: 'put',
    path: this.path(object),
    key: key,
    old: object[key],
    new: value,
  })
}

// Similar to put, but instead of setting .path[key] = value, set .path-1[objectName] = value
function replace(object, value) {
  const fullPath = this.path(object)

  let key
  let path
  if (fullPath.endsWith(']')) {
    const pathTokens = fullPath.split('[')
    key = parseInt(pathTokens.pop())
    path = pathTokens.join('[')
  }
  else {
    const pathTokens = fullPath.split('.')
    key = pathTokens.pop()
    path = pathTokens.join('.')
  }

  this.put(
    this.at(path),
    key,
    value,
  )
}

function splice(array, index, count, ...items) {
  this.patch({
    kind: 'splice',
    path: this.path(array),
    key: index,
    old: array.slice(index, index + count),
    new: items,
  })
}

function at(path) {
  if (path.startsWith('.')) {
    path = path.slice(1)
  }

  if (path === '') {
    return this.state
  }

  const tokens = path.split('.')

  let pos = this.state
  for (const token of tokens) {
    if (token.endsWith(']')) {
      const pieces = token.split('[')
      const key = pieces[0]
      pos = pos[key]

      for (let i = 1; i < pieces.length; i++) {
        const index = pieces[i].substr(0, pieces[i].length - 1)
        pos = pos[index]
      }
    }
    else {
      pos = pos[token]
    }
  }

  return pos
}

function path(target) {
  if (typeof target !== 'object' || target === null) {
    throw `Invalid path target. Can only path objects and arrays. Got ${typeof target}: ${target}`
  }

  const result = _pathRecursive(target, this.state, '')
  if (!result) {
    throw `Target not found: ${target}`
  }
  return result
}

function _pathRecursive(target, root, pathAccumulator) {
  if (root === target) {
    return pathAccumulator || '.'
  }
  else if (Array.isArray(root)) {
    for (let i = 0; i < root.length; i++) {
      const result = _pathRecursive(target, root[i], pathAccumulator + `[${i}]`)
      if (result) {
        return result
      }
    }
  }
  else if (typeof root === 'object') {
    for (const key of Object.keys(root)) {
      const result = _pathRecursive(target, root[key], pathAccumulator + '.' + key)
      if (result) {
        return result
      }
    }
  }
  else {
    return false
  }
}
