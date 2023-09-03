import Modal from 'bootstrap/js/dist/modal'


export default {
  pleaseReload,
  getModal,
}

function pleaseReload(message) {
  const modal = getModal('error-modal')
  const bodyElem = modal._element.querySelector('.error-modal-body')
  bodyElem.textContent = message
  modal.show()
}

function getModal(elemId, opts={}) {
  const elem = document.getElementById(elemId)
  return new Modal(elem, opts)
}
