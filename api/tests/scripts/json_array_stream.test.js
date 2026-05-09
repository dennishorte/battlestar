import { Readable } from 'stream'
import { describe, test, expect } from 'vitest'

import { streamJsonArrayElements } from '../../scripts/util/json_array_stream.js'

function readableFromString(str, chunkSize) {
  if (!chunkSize) {
    return Readable.from([str])
  }
  const chunks = []
  for (let i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.slice(i, i + chunkSize))
  }
  return Readable.from(chunks)
}

async function collect(readable) {
  const out = []
  for await (const el of streamJsonArrayElements(readable)) {
    out.push(el)
  }
  return out
}

describe('streamJsonArrayElements', () => {
  test('parses a simple array of objects', async () => {
    const input = '[{"a":1},{"b":2},{"c":3}]'
    expect(await collect(readableFromString(input))).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }])
  })

  test('handles strings containing braces', async () => {
    const input = '[{"text":"a {b} c"},{"text":"]["}]'
    expect(await collect(readableFromString(input))).toEqual([
      { text: 'a {b} c' },
      { text: '][' },
    ])
  })

  test('handles escaped quotes inside strings', async () => {
    const input = '[{"text":"he said \\"hi\\""},{"x":1}]'
    expect(await collect(readableFromString(input))).toEqual([
      { text: 'he said "hi"' },
      { x: 1 },
    ])
  })

  test('handles backslash before quote correctly', async () => {
    const input = '[{"a":"\\\\"},{"b":2}]'
    expect(await collect(readableFromString(input))).toEqual([
      { a: '\\' },
      { b: 2 },
    ])
  })

  test('handles nested objects and arrays', async () => {
    const input = '[{"x":{"y":[1,2,{"z":3}]}},{"a":[]}]'
    expect(await collect(readableFromString(input))).toEqual([
      { x: { y: [1, 2, { z: 3 }] } },
      { a: [] },
    ])
  })

  test('handles whitespace around elements', async () => {
    const input = '[\n  {"a":1},\n  {"b":2}\n]'
    expect(await collect(readableFromString(input))).toEqual([{ a: 1 }, { b: 2 }])
  })

  test('produces correct results when chunk boundaries split objects', async () => {
    const input = '[{"key":"value with spaces"},{"nested":{"deep":[1,2,3]}},{"last":true}]'
    for (const chunkSize of [1, 2, 3, 5, 7, 11, 31]) {
      const result = await collect(readableFromString(input, chunkSize))
      expect(result).toEqual([
        { key: 'value with spaces' },
        { nested: { deep: [1, 2, 3] } },
        { last: true },
      ])
    }
  })

  test('handles empty array', async () => {
    expect(await collect(readableFromString('[]'))).toEqual([])
  })

  test('handles single element', async () => {
    expect(await collect(readableFromString('[{"only":1}]'))).toEqual([{ only: 1 }])
  })

  test('handles chunk boundary inside an escape sequence', async () => {
    const input = '[{"x":"a\\"b"}]'
    for (let cs = 1; cs <= input.length; cs++) {
      expect(await collect(readableFromString(input, cs))).toEqual([{ x: 'a"b' }])
    }
  })
})
