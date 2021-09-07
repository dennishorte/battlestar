<template>
  <b-modal
    id="zone-modal"
    title="Zone Viewer"
    ok-only>
    <ZoneViewer :zoneName="zoneName" />
  </b-modal>
</template>


<script>
import ZoneViewer from './ZoneViewer'

export default {
  name: 'ZoneViewerModal',

  components: {
    ZoneViewer,
  },

  computed: {
    zoneName() {
      return this.$store.getters['bsg/uiModalZone'].name
    }
  },
}
</script>
