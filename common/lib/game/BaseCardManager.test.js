const fs = require('fs')
const os = require('os')
const path = require('path')
const { BaseCardManager } = require('./BaseCardManager.js')

function makeTempCardDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cards-'))
  function write(name, body) {
    fs.writeFileSync(path.join(dir, name), body)
  }
  return { dir, write }
}

function cleanup(dir) {
  fs.rmSync(dir, { recursive: true, force: true })
}

describe('BaseCardManager.loadFromDirectory', () => {
  test('loads every .js file in the directory and ignores test/index files', () => {
    const { dir, write } = makeTempCardDir()
    try {
      write('apple.js', "module.exports = { id: 'apple', source: 'Base' }")
      write('banana.js', "module.exports = { id: 'banana', source: 'Base' }")
      write('apple.test.js', "throw new Error('should be skipped')")
      write('index.js', "throw new Error('should be skipped')")
      write('notes.md', "not a js file")

      const defs = BaseCardManager.loadFromDirectory(dir)
      expect(defs.map(d => d.id).sort()).toEqual(['apple', 'banana'])
    }
    finally {
      cleanup(dir)
    }
  })

  test('returns definitions in sorted order for deterministic output', () => {
    const { dir, write } = makeTempCardDir()
    try {
      write('zebra.js', "module.exports = { id: 'zebra', source: 'Base' }")
      write('aardvark.js', "module.exports = { id: 'aardvark', source: 'Base' }")
      write('mongoose.js', "module.exports = { id: 'mongoose', source: 'Base' }")

      const defs = BaseCardManager.loadFromDirectory(dir)
      expect(defs.map(d => d.id)).toEqual(['aardvark', 'mongoose', 'zebra'])
    }
    finally {
      cleanup(dir)
    }
  })

  test("throws when a card definition is missing 'source' and requireSource is true", () => {
    const { dir, write } = makeTempCardDir()
    try {
      write('sourceless.js', "module.exports = { id: 'sourceless' }")
      expect(() => BaseCardManager.loadFromDirectory(dir))
        .toThrow(/sourceless\.js is missing required 'source' field/)
    }
    finally {
      cleanup(dir)
    }
  })

  test('allows sourceless definitions when requireSource is false', () => {
    const { dir, write } = makeTempCardDir()
    try {
      write('sourceless.js', "module.exports = { id: 'sourceless' }")
      const defs = BaseCardManager.loadFromDirectory(dir, { requireSource: false })
      expect(defs).toEqual([{ id: 'sourceless' }])
    }
    finally {
      cleanup(dir)
    }
  })
})

describe('BaseCardManager.filterDefinitions', () => {
  const defs = [
    { id: 'a', source: 'Base' },
    { id: 'b', source: 'Expansion1', tags: ['promo'] },
    { id: 'c', source: 'Expansion2', tags: ['legacy', 'promo'] },
    { id: 'd', source: 'Base', tags: ['legacy'] },
  ]

  test('filters by sources allowlist', () => {
    expect(BaseCardManager.filterDefinitions(defs, { sources: ['Base'] }).map(d => d.id))
      .toEqual(['a', 'd'])
    expect(BaseCardManager.filterDefinitions(defs, { sources: ['Base', 'Expansion2'] }).map(d => d.id))
      .toEqual(['a', 'c', 'd'])
  })

  test('filters by tags (any match)', () => {
    expect(BaseCardManager.filterDefinitions(defs, { tags: ['promo'] }).map(d => d.id))
      .toEqual(['b', 'c'])
    expect(BaseCardManager.filterDefinitions(defs, { tags: ['legacy'] }).map(d => d.id))
      .toEqual(['c', 'd'])
  })

  test('combines sources and tags as AND', () => {
    expect(BaseCardManager.filterDefinitions(defs, { sources: ['Base'], tags: ['legacy'] }).map(d => d.id))
      .toEqual(['d'])
  })

  test('returns input unchanged when no filters provided', () => {
    expect(BaseCardManager.filterDefinitions(defs).map(d => d.id))
      .toEqual(['a', 'b', 'c', 'd'])
  })
})
