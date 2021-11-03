const jsonpath = require('./jsonpath.js')
const util = require('./util.js')


function RecordKeeperSession(rk) {
  this.rk = rk
  this.game = rk.game
  this.diffs = []
  this.record = 'diff'
}

RecordKeeperSession.prototype.at = at
RecordKeeperSession.prototype.locate = locate
RecordKeeperSession.prototype.path = path

RecordKeeperSession.prototype.cancel = cancel
RecordKeeperSession.prototype.commit = commit

RecordKeeperSession.prototype.patch = patch
RecordKeeperSession.prototype.reverse = reverse

RecordKeeperSession.prototype.addKey = addKey
RecordKeeperSession.prototype.increment = increment
RecordKeeperSession.prototype.move = move
RecordKeeperSession.prototype.pop = pop
RecordKeeperSession.prototype.push = push
RecordKeeperSession.prototype.put = put
RecordKeeperSession.prototype.removeKey = removeKey
RecordKeeperSession.prototype.replace = replace
RecordKeeperSession.prototype.splice = splice


function cancel() {
  while (this.diffs.length) {
    this.reverse(this.diffs.pop())
    this.diffs.pop() // Remove the just reversed diff from saved diffs
  }
  _close(this)
}

function commit() {
  if (this.diffs.length) {
    this.rk.diffs.push(this.diffs)
  }
  _close(this)
}

function patch(diff) {
  if (this.record === 'diff') {
    this.diffs.push(util.deepcopy(diff))
  }

  const target = this.at(diff.path)

  // Ensure the current value matches the `old` valud from the diff
  if (diff.kind === 'put') {
    if (JSON.stringify(target[diff.key]) !== JSON.stringify(diff.old)) {
      console.log({
        target: target,
        diff: util.deepcopy(diff),
      })
      throw `Can't patch because old doesn't match: ${diff.path}.${diff.key} !== ${diff.old}`
    }

    target[diff.key] = util.deepcopy(diff.new)
  }

  else if (diff.kind === 'splice') {
    if (!Array.isArray(target)) {
      throw `${diff.path} is not an array`
    }

    target.splice(diff.key, diff.old.length, ...diff.new)
  }

  else if (diff.kind === 'addKey') {
    target[diff.key] = util.deepcopy(diff.new)
  }

  else if (diff.kind === 'removeKey') {
    delete target[diff.key]
  }

  else {
    throw `Unknown diff kind: ${diff.kind}`
  }
}

function reverse(diff) {
  const reversed = util.deepcopy(diff)

  if (diff.kind === 'addKey') {
    reversed.kind = 'removeKey'
    reversed.old = reversed.new
    delete reversed.new
  }
  else if (diff.kind === 'removeKey') {
    reversed.key = 'addKey'
    reversed.new = reversed.old
    delete reversed.old
  }
  else {
    reversed.old = diff.new
    reversed.new = diff.old
  }
  this.patch(reversed)
}

function move(object, destArray, destIndex) {
  _assert(!!object, `Can only move non-null objects. Got ${object}.`)
  _assert(Array.isArray(destArray), `Can only move objects into arrays. Got ${destArray}.`)

  if (destIndex === undefined) {
    destIndex = destArray.length
  }

  const { path, key } = this.locate(object)
  const sourceArray = this.at(path)

  this.splice(sourceArray, key, 1)
  this.splice(destArray, destIndex, 0, object)
}

function addKey(object, key, value) {
  this.patch({
    kind: 'addKey',
    path: this.path(object),
    key: key,
    new: value,
  })
}

function removeKey(object, key) {
  this.patch({
    kind: 'removeKey',
    path: this.path(object),
    key: key,
    old: object[key],
  })
}

function pop(array) {
  this.splice(array, array.length - 1, 1)
}

function push(array, elem) {
  this.splice(array, array.length, 0, elem)
}

function increment(object, key) {
  const value = object[key]
  this.put(object, key, value + 1)
}

function put(object, key, value) {
  util.assert(value !== undefined, 'Not allowed to put undefined. Use removeKey instead.')
  util.assert(object[key] !== undefined, 'Not allowed to put new keys. Use addKey instead.')

  // If object and value are identical, do nothing.
  if (JSON.stringify(object[key]) === JSON.stringify(value)) {
    return
  }

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
  // If object and value are identical, do nothing.
  if (JSON.stringify(object) === JSON.stringify(value)) {
    return
  }

  const { path, key } = this.locate(object)

  this.put(
    this.at(path),
    key,
    value,
  )
}

function locate(object) {
  const fullPath = this.path(object)

  if (!fullPath) {
    console.log(object)
    throw new Error('Unable to find the specified object')
  }

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

  return {path, key}
}

function splice(array, index, count, ...items) {
  const old = array.slice(index, index + count)

  // If there is no actual change, do nothing.
  if (JSON.stringify(old) === JSON.stringify(items)) {
    return
  }

  this.patch({
    kind: 'splice',
    path: this.path(array),
    key: index,
    old: old,
    new: items,
  })
}

function at(path) {
  return jsonpath.at(this.game, path)
}

function path(target) {
  return jsonpath.path(this.game, target)
}

function _close(session) {
  // Session is now closed
  session.rk.session = null
  session.diffs = null
  session.game = null
  session.rk = null
}

function _assert(truthyValue, message) {
  if (!truthyValue) {
    throw new Error(message)
  }
}

module.exports = RecordKeeperSession
