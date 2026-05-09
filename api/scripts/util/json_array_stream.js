import { StringDecoder } from 'string_decoder'

/**
 * Streams elements from a top-level JSON array.
 * Yields each parsed top-level element ({...} or [...]) one at a time.
 *
 * Why hand-rolled: the bulk Scryfall file is too large to buffer as a single
 * JS string (V8 caps strings at ~512MB), but each individual card object is
 * ~5KB so well below the limit. This parser tracks bracket depth, with
 * awareness of strings and escape sequences so braces inside string values
 * don't confuse the depth counter.
 */
export async function* streamJsonArrayElements(readable) {
  const decoder = new StringDecoder('utf8')
  let buf = ''
  let scanPos = 0
  let inArray = false
  let depth = 0
  let inString = false
  let escaped = false
  let elementStart = -1

  for await (const chunk of readable) {
    buf += decoder.write(chunk)

    while (scanPos < buf.length) {
      const c = buf[scanPos]

      if (inString) {
        if (escaped) {
          escaped = false
        }
        else if (c === '\\') {
          escaped = true
        }
        else if (c === '"') {
          inString = false
        }
        scanPos++
        continue
      }

      if (c === '"') {
        inString = true
        scanPos++
        continue
      }

      if (!inArray) {
        if (c === '[') {
          inArray = true
        }
        scanPos++
        continue
      }

      if (depth === 0) {
        if (c === '{' || c === '[') {
          elementStart = scanPos
          depth = 1
        }
        else if (c === ']') {
          return
        }
        scanPos++
        continue
      }

      if (c === '{' || c === '[') {
        depth++
      }
      else if (c === '}' || c === ']') {
        depth--
        if (depth === 0) {
          yield JSON.parse(buf.slice(elementStart, scanPos + 1))
          elementStart = -1
        }
      }
      scanPos++
    }

    // Drop the consumed prefix to keep buf small (worst case: one in-flight element).
    const dropTo = elementStart >= 0 ? elementStart : scanPos
    if (dropTo > 0) {
      buf = buf.slice(dropTo)
      if (elementStart >= 0) {
        elementStart = 0
      }
      scanPos -= dropTo
    }
  }

  buf += decoder.end()
  if (buf.length > 0 && elementStart >= 0 && depth === 0) {
    yield JSON.parse(buf.slice(elementStart))
  }
}
