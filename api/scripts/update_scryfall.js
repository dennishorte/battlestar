/**
 * Worker script: refresh Scryfall sets + cards.
 *
 * Run as a child process from the API job runner, or directly from the CLI.
 *
 * Memory strategy: the bulk Scryfall file is ~600MB. To avoid blowing the V8
 * string limit (~512MB) and to keep heap usage flat, the pipeline runs as:
 *
 *   1. stream-download to a temp file
 *   2. PASS 1 — stream-parse, build only the `hasNormalVersion` name set
 *   3. PASS 2 — stream-parse, accumulate chunks of CHUNK_SIZE cards, run them
 *      through processCards (with the pre-built set), insert each chunk to
 *      Mongo, drop the chunk
 *
 * Net working set is bounded by one chunk plus the name set (~100MB instead
 * of >2GB).
 *
 * Progress is written to stdout as plain lines, prefixed with a phase tag in
 * square brackets so the parent process can pick out the current phase.
 * Exit code 0 = success, 1 = failure.
 */

import axios from 'axios'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { pipeline } from 'stream/promises'

import { processCards } from './fetch_scryfall_cards.js'
import { streamJsonArrayElements } from './util/json_array_stream.js'
import Sets from '../src/models/magic/sets_models.js'
import Scryfall from '../src/models/magic/scryfall_models.js'
import { client as databaseClient } from '../src/utils/mongo.js'

const CHUNK_SIZE = 5000


function log(phase, msg) {
  process.stdout.write(`[${phase}] ${msg}\n`)
}

async function streamDownloadToFile(uri, dest) {
  const response = await axios.get(uri, {
    responseType: 'stream',
    maxRedirects: 5,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    timeout: 0,
  })

  await pipeline(response.data, fs.createWriteStream(dest))
}

async function fetchScryfallBulkUri() {
  const result = await axios.get('https://api.scryfall.com/bulk-data')
  if (result.status !== 200) {
    throw new Error('Unable to fetch bulk data list')
  }
  const target = result.data.data.find(d => d.type === 'default_cards')
  if (!target?.download_uri) {
    throw new Error('Unable to locate default_cards download URI')
  }
  return target.download_uri
}

// Iterate cards from the temp file, yielding one parsed card at a time.
// Wraps streamJsonArrayElements so callers don't need to manage the read stream.
async function* streamCardsFromFile(file) {
  const stream = fs.createReadStream(file)
  yield* streamJsonArrayElements(stream)
}

// Streaming equivalent of buildHasNormalVersionSet so we never hold the full
// card array in memory just to compute names. Mirrors that function's logic.
async function buildHasNormalVersionFromFile(file) {
  const result = new Set()
  for await (const card of streamCardsFromFile(file)) {
    if (card.lang !== 'en') {
      continue
    }
    if (card.textless || card.full_art) {
      continue
    }
    if (['art_series', 'vanguard', 'double_faced_token', 'scheme'].includes(card.layout)) {
      continue
    }
    result.add(card.name)
  }
  return result
}

async function processAndInsertChunk(chunk, hasNormalVersion) {
  const formatted = processCards(chunk, hasNormalVersion)
  if (formatted.length) {
    await Scryfall.insertBatch(formatted)
  }
  return formatted.length
}

async function streamProcessAndInsert(file, hasNormalVersion) {
  await Scryfall.beginReplace()

  let chunk = []
  let rawCount = 0
  let insertedCount = 0

  for await (const card of streamCardsFromFile(file)) {
    chunk.push(card)
    rawCount++

    if (chunk.length >= CHUNK_SIZE) {
      insertedCount += await processAndInsertChunk(chunk, hasNormalVersion)
      chunk = []
      log('process', `read ${rawCount}, inserted ${insertedCount}`)
    }
  }

  if (chunk.length) {
    insertedCount += await processAndInsertChunk(chunk, hasNormalVersion)
  }

  return { rawCount, insertedCount }
}


async function main() {
  await databaseClient.connect()

  log('sets', 'Refreshing Magic sets from Scryfall...')
  const setsResult = await Sets.update()
  log('sets', `Updated ${setsResult.count} sets`)

  log('locate-bulk', 'Looking up bulk card download URI...')
  const downloadUri = await fetchScryfallBulkUri()
  const version = downloadUri.split('/').slice(-1)[0]
  log('locate-bulk', `Bulk file: ${version}`)

  const tmpFile = path.join(os.tmpdir(), `scryfall-${Date.now()}-${version}`)

  try {
    log('download', `Streaming download to ${tmpFile}...`)
    await streamDownloadToFile(downloadUri, tmpFile)
    const sizeMb = (fs.statSync(tmpFile).size / 1024 / 1024).toFixed(1)
    log('download', `Download complete (${sizeMb} MB)`)

    log('analyze', 'Pass 1: collecting card names with normal versions...')
    const hasNormalVersion = await buildHasNormalVersionFromFile(tmpFile)
    log('analyze', `${hasNormalVersion.size} card names with normal versions`)

    log('process', 'Pass 2: streaming cards through processCards in chunks...')
    const { rawCount, insertedCount } = await streamProcessAndInsert(tmpFile, hasNormalVersion)
    log('process', `Read ${rawCount} raw entries, inserted ${insertedCount} cards`)

    log('commit', `Committing version ${version}...`)
    await Scryfall.commitVersion(version)
    log('commit', 'Version updated')

    log('done', `RESULT sets=${setsResult.count} cards=${insertedCount} version=${version}`)
  }
  finally {
    try {
      fs.unlinkSync(tmpFile)
    }
    catch { /* may not exist if we failed before download */ }
  }
}


main()
  .then(async () => {
    await databaseClient.close()
    process.exit(0)
  })
  .catch(async (err) => {
    log('error', `FAILED ${err.message}`)
    console.error(err.stack || err)
    try {
      await databaseClient.close()
    }
    catch { /* ignore */ }
    process.exit(1)
  })
