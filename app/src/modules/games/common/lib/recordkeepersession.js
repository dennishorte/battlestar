export default function RecordKeeperSession(rk) {
  this.rk = rk
  this.game = rk.game
  this.diffs = []
  this.record = 'diff'
}

RecordKeeperSession.prototype.at = at
RecordKeeperSession.prototype.path = path

RecordKeeperSession.prototype.cancel = cancel
RecordKeeperSession.prototype.commit = commit

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
    this.diffs.push(diff)
  }

  const target = this.at(diff.path)

  // Ensure the current value matches the `old` valud from the diff
  if (diff.kind === 'put') {
    if (JSON.stringify(target[diff.key]) !== JSON.stringify(diff.old)) {
      console.log({
        target: target,
        diff: _deepcopy(diff),
      })
      throw `Can't patch because old doesn't match: ${diff.path}.${diff.key} !== ${diff.old}`
    }

    target[diff.key] = _deepcopy(diff.new)
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
  const reversed = _deepcopy(diff)
  reversed.old = diff.new
  reversed.new = diff.old
  this.patch(reversed)
}

function put(object, key, value) {
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
  if (path.startsWith('.')) {
    path = path.slice(1)
  }

  if (path === '') {
    return this.game
  }

  const tokens = path.split('.')

  let pos = this.game
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

  const result = _pathRecursive(target, this.game, '')
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

function _close(session) {
  // Session is now closed
  session.rk.session = null
  session.diffs = null
  session.game = null
  session.rk = null
}

function _deepcopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}
