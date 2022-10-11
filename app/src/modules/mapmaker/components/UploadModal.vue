<template>
  <b-modal id="upload-modal" title="Load from file" @ok="maybeLoad">
    <b-form-file
      v-model="file"
      :state="Boolean(file)"
      placeholder="Choose a file or drop it here..."
      drop-placeholder="Drop file here..."
    ></b-form-file>
  </b-modal>
</template>


<script>
export default {
  name: 'UploadModal',

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
