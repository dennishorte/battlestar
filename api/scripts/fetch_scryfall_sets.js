import axios from 'axios'
import fs from 'fs'

async function fetchScryfallSets(uri) {
  const result = await axios.get(uri, {
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    timeout: 0,
  })

  if (result.status !== 200) {
    return {
      status: 'error',
      message: result.statusText,
    }
  }

  return result.data.data
}

async function sortData(data) {
  data.sort((l, r) => r.released_at < l.released_at)
}

async function fetchFromScryfallAndClean() {
  console.log('Fetching latest SET data from scryfall')

  const downloadUri = 'https://api.scryfall.com/sets'
  const outputFilename = 'set_data/sets.raw'

  console.log('...downloading set data from ' + downloadUri)
  const sets = await fetchScryfallSets(downloadUri)

  console.log('...cleaning data')
  sortData(sets)

  console.log('...writing raw data to disk: ' + outputFilename)
  if (!fs.existsSync('set_data')) {
    fs.mkdirSync('set_data')
  }
  fs.writeFileSync(outputFilename, JSON.stringify(sets, null, 2))

  console.log('...done')
}


////////////////////////////////////////////////////////////////////////////////
// Main

fetchFromScryfallAndClean()
