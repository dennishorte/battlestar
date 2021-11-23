const jsonpath = require('./jsonpath.js')
const util = require('./util.js')


function RecordKeeper(game) {
  this.game = game
  this.diffs = game.history
  this.undone = []
}

RecordKeeper.prototype.load = load

RecordKeeper.prototype.redo = redo
RecordKeeper.prototype.undo = undo

RecordKeeper.prototype.at = at
RecordKeeper.prototype.locate = locate
RecordKeeper.prototype.path = path

RecordKeeper.prototype.patch = patch
RecordKeeper.prototype.reverse = reverse

RecordKeeper.prototype.addKey = addKey
RecordKeeper.prototype.increment = increment
RecordKeeper.prototype.move = move
RecordKeeper.prototype.pop = pop
RecordKeeper.prototype.push = push
RecordKeeper.prototype.put = put
RecordKeeper.prototype.removeKey = removeKey
RecordKeeper.prototype.replace = replace
RecordKeeper.prototype.splice = splice



function load(game) {
  this.game = game
  this.diffs = game.history
}

function undo() {
  const diff = this.diffs.pop()
  this.undone.push(diff)
  this.reverse(diff)
  this.game.hasUndone = this.undone.length > 0
}

function redo() {
  const diff = this.undone.pop()
  this.patch(diff)
  this.game.hasUndone = this.undone.length > 0
}

function patch(diff, skipRecord) {
  if (!skipRecord) {
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
  this.patch(reversed, true)
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

  const path = this.path(object)
  util.assert(!!path, `Unable to find object`)

  this.patch({
    kind: 'put',
    path: path,
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

function _assert(truthyValue, message) {
  if (!truthyValue) {
    throw new Error(message)
  }
}

module.exports = RecordKeeper
