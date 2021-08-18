import axios from 'axios'

const Util = {}
export default Util

Util.create = async function() {
  const createResult = await axios.post('/api/lobby/create', {})
  return createResult.data.lobbyId
}
