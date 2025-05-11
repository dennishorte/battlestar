<template>
  <Modal id="upload-modal" @ok="maybeLoad">
    <template #header>Load from file</template>

    <input class="form-control"
           type="file"
           id="formFile"
           ref="fileinput"/>
  </Modal>
</template>


<script>
import Modal from '@/components/Modal'


export default {
  name: 'UploadModal',

  components: {
    Modal,
  },

  emits: ['file-ready'],

  methods: {
    maybeLoad() {
      const reader = new FileReader()
      reader.onload = (e) => this.$emit('file-ready', e.target.result)
      reader.readAsText(this.$refs.fileinput.files[0])
    },
  },
}
</script>


<style scoped>
</style>
