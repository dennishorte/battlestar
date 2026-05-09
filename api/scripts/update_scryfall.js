/**
 * Worker script: refresh Scryfall sets + cards in one pass.
 *
 * Run as a child process from the API job runner, or directly from the CLI.
 * Streams the bulk download to disk and stream-parses it so we never hold
 * the full ~600MB body as a single JS string (V8's max string size is ~512MB).
 *
 * Usage:
 *   node api/scripts/update_scryfall.js
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


async function main() {
  await databaseClient.connect()  // idempotent; ensures the pool is ready

  log('sets', 'Refreshing Magic sets from Scryfall...')
  const setsResult = await Sets.update()
  log('sets', `Updated ${setsResult.count} sets`)

  log('locate-bulk', 'Looking up bulk card download URI...')
  const downloadUri = await fetchScryfallBulkUri()
  const version = downloadUri.split('/').slice(-1)[0]
  log('locate-bulk', `Bulk file: ${version}`)

  const tmpFile = path.join(os.tmpdir(), `scryfall-${Date.now()}-${version}`)
  log('download', `Streaming download to ${tmpFile}...`)
  await streamDownloadToFile(downloadUri, tmpFile)
  const sizeMb = (fs.statSync(tmpFile).size / 1024 / 1024).toFixed(1)
  log('download', `Download complete (${sizeMb} MB)`)

  log('parse', 'Stream-parsing card entries...')
  const rawCards = []
  const stream = fs.createReadStream(tmpFile)
  for await (const card of streamJsonArrayElements(stream)) {
    rawCards.push(card)
    if (rawCards.length % 50000 === 0) {
      log('parse', `...parsed ${rawCards.length} cards so far`)
    }
  }
  log('parse', `Parsed ${rawCards.length} raw card entries`)

  log('process', 'Processing cards...')
  const formatted = processCards(rawCards)
  log('process', `${formatted.length} cards after processing`)

  log('insert', 'Inserting cards into database...')
  await Scryfall.insertCards(formatted, version)
  log('insert', 'Insert complete')

  try {
    fs.unlinkSync(tmpFile)
  }
  catch { /* ignore */ }

  log('done', `RESULT sets=${setsResult.count} cards=${formatted.length} version=${version}`)
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
