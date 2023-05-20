<template>
  <Modal>
    <template #header>Edit File</template>

    <label class="form-label">name</label>
    <input class="form-control" v-model="newName" placeholder="name" />

    <label class="form-label">path</label>
    <input class="form-control" v-model="newPath" placeholder="path" />

    <template #footer>
      <button class="btn btn-secondary" @click="cancel" data-bs-dismiss="modal">cancel</button>
      <button class="btn btn-primary" @click="save" data-bs-dismiss="modal">save</button>
    </template>
  </Modal>
</template>


<script>
import Modal from '@/components/Modal'

export default {
  name: 'EditModal',

  components: {
    Modal,
  },

  props: {
    file: Object,
  },

  data() {
    return {
      newName: '',
      newPath: '',
    }
  },

  methods: {
    save() {
      if (this.newName !== this.file.name || this.newPath !== this.file.path) {
        this.$emit('save', {
          newName: this.newName,
          newPath: this.newPath,
        })
      }
    },
  },

  watch: {
    file(newValue) {
      if (newValue) {
        this.newName = newValue.name
        this.newPath = newValue.path
      }
    }
  },
}
</script>
