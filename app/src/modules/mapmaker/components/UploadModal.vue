<template>
  <ModalBase id="upload-modal" @ok="maybeLoad">
    <template #header>Upload a File</template>

    <input
      class="form-control"
      type="file"
      @change="selectFile"
    />
  </ModalBase>
</template>


<script>
import ModalBase from '@/components/ModalBase'


export default {
  name: 'UploadModal',

  components: {
    ModalBase,
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
