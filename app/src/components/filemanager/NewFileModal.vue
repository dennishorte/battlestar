<template>
  <Modal>
    <template #header>Edit File</template>

    <label class="form-label">name</label>
    <input class="form-control" v-model="newName" placeholder="name" />

    <label class="form-label">path</label>
    <input class="form-control" v-model="newPath" placeholder="path" />

    <label class="form-label">file type</label>
    <select class="form-select" v-model="newKind">
      <option disabled value="">choose a file type...</option>
      <option v-for="type in fileTypes">{{ type }}</option>
    </select>

    <template #footer>
      <button class="btn btn-secondary" @click="cancel" data-bs-dismiss="modal">cancel</button>
      <button class="btn btn-primary" @click="create" data-bs-dismiss="modal" :disabled="!validInput">create</button>
    </template>
  </Modal>
</template>


<script>
import Modal from '@/components/Modal'

export default {
  name: 'NewFileModal',

  components: {
    Modal,
  },

  props: {
    fileTypes: Array,
    selection: Object,
  },

  data() {
    return {
      newKind: '',
      newName: '',
      newPath: '/',
    }
  },

  computed: {
    validInput() {
      return this.newName.trim() !== '' && this.newKind.trim() !== ''
    }
  },

    methods: {
    create() {
      this.newName = this.newName.trim()
      this.newPath = this.newPath.trim()
      this.newKind = this.newKind.trim()
      if (!this.newPath.startsWith('/')) {
        this.newPath = '/' + this.newPath
      }

      if (this.newName !== '' && this.newPath !== '' && this.newKind !== '') {
        this.$emit('create', {
          kind: this.newKind,
          name: this.newName,
          path: this.newPath,
        })
      }
    },
  },

  watch: {
    selection(newValue) {
      const kind = newValue.folder ? 'folder' : 'file'
      const content = newValue.folder ? newValue.folder : newValue.file

      if (content) {
        this.newKind = content.kind || ''
        this.newName = kind === 'file' ? content.name : ''
        this.newPath = content.path
      }
    }
  },
}
</script>


<style scoped>
label {
  margin-top: .5em;
  margin-bottom: .25em;
  margin-left: .5em;
}
</style>
