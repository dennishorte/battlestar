import Modal from 'bootstrap/js/dist/modal'


export default {
  getModal,
}

function getModal(elemId, opts={}) {
  const elem = document.getElementById(elemId)
  return new Modal(elem, opts)
}
