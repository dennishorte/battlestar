export default function RecordKeeper(state) {
  this.state = state
  this.diffs = []
}

RecordKeeper.prototype.patch = function(diff) {
  const target = this.at(diff.path)

  // Ensure the current value matches the `old` valud from the diff
  if (diff.kind === 'put') {
    if (target[diff.key] !== diff.old) {
      throw `${diff.path}.${diff.key} !== ${diff.old}`
    }

    target[key] = diff.new
  }

  else if (diff.kind === 'splice') {
    if (!Array.isArray(target)) {
      throw `${diff.path} is not an array`
    }
    if (target.length !== diff.key + diff.old.length) {
      throw `${diff.path} does not have enough values`
    }

    target.splice(diff.key, diff.old.length, ...diff.new)
  }

  else {
    throw `Unknown diff kind: ${diff.kind}`
  }
}

RecordKeeper.prototype.reverse = function(diff) {
  const reversed = {...diff}
  reversed.old = diff.new
  reversed.new = diff.old
  this.patch(reversed)
}

RecordKeeper.prototype.put = function(object, key, value) {
  this.diffs.push({
    kind: 'put',
    path: this.find(object),
    key: key,
    old: object[key],
    new: value,
  })

  object[key] = value
}

RecordKeeper.prototype.splice = function(array, index, count, ...items) {
  const removed = array.splice(index, count, items)
  this.diffs.push({
    kind: 'splice',
    path: this.find(array),
    key: index,
    old: removed,
    new: items,
  })
}

RecordKeeper.prototype.at = function(path) {
  const tokens = path.split('.')

  let pos = this.state
  for (const token of tokens) {
    const arrayMatch = /\[([0-9]+)\]/.exec(token)
    if (arrayMatch) {
      const key = arrayMatch[1]
      const index = arrayMatch[2]
      pos = pos[key][index]
    }
    else {
      pos = pos[token]
    }
  }

  return pos
}

RecordKeeper.prototype.find = function(target) {
  if (typeof target !== 'object' || target === null) {
    throw `Invalid find target. Can only find objects and arrays. Got ${typeof target}: ${target}`
  }

  const result = _findRecursive(target, this.state, '')
  if (!result) {
    throw `Target not found: ${target}`
  }
  return result
}

function _findRecursive(target, root, pathAccumulator) {
  if (root === target) {
    return pathAccumulator
  }
  else if (Array.isArray(root)) {
    for (let i = 0; i < root.length; i++) {
      const result = _findRecursive(target, root[i], pathAccumulator + `[${i}]`)
      if (result) {
        return result
      }
    }
  }
  else if (typeof root === 'object') {
    for (const key of Object.keys(root)) {
      const result = _findRecursive(target, root[key], pathAccumulator + '.' + key)
      if (result) {
        return result
      }
    }
  }
  else {
    return false
  }

  return path
}
