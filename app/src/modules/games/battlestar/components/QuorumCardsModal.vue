<template>
  <b-modal
    id="quorum-cards-modal"
    title="Quorum Cards"
    ok-only>
    <QuorumCardViewer />
  </b-modal>
</template>


<script>
import QuorumCardViewer from './QuorumCardViewer'

export default {
  name: 'QuorumCardModal',

  components: {
    QuorumCardViewer,
  },
}
</script>
