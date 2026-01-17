const jsonpath = require('./jsonpath.js')

describe('pathAll', () => {
  test('finds multiple hits', () => {
    const state = {
      root: { name: 'foo' },
      array: [{ name: 'bar'}, { name: 'foo'}, { name: 'world' }],
      object: { a: { name: 'foo' } },
    }
    const matches = jsonpath.pathAll(state, (x: { name: string }) => x.name === 'foo')

    expect(matches.sort()).toStrictEqual([
      '.array[1]',
      '.object.a',
      '.root',
    ])
  })
})
