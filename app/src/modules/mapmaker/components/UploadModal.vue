<template>
  <Modal id="upload-modal" @ok="maybeLoad">
    <template #header>Load from file</template>

    <input class="form-control" type="file" id="formFile">
  </Modal>
</template>


<script>
import Modal from '@/components/Modal'


export default {
  name: 'UploadModal',

  components: {
    Modal,
  },

  data() {
    return {
      file: null,
    }
  },

  methods: {
    maybeLoad() {
      if (this.file) {
        const reader = new FileReader()
        reader.onload = (e) => this.$emit('file-ready', e.target.result)
        reader.readAsText(this.file)
      }
      else {
        console.log('no file uploaded')
      }
    },
  },
}
</script>


<style scoped>
</style>
