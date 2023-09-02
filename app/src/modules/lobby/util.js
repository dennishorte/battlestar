import axiosWrapper from '@/util/axiosWrapper.js'

const Util = {}
export default Util

Util.create = async function() {
  const { lobbyId } = await axiosWrapper.post('/api/lobby/create', {})
  return lobbyId
}
