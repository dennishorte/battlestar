<template>
  <Modal id="cube-settings-modal">
    <template #header>
      Cube Settings
    </template>

    <div class="container">
      <div class="mb-3">
        <label for="cube-name" class="form-label">Cube Name</label>
        <input type="text" class="form-control" id="cube-name" v-model="formData.name">
      </div>
    </div>
    
    <template #footer>
      <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
      <button class="btn btn-primary" @click="save" data-bs-dismiss="modal">Save</button>
    </template>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal'

export default {
  name: 'CubeSettingsModal',
  
  components: {
    Modal
  },
  
  inject: ['bus'],
  
  props: {
    cube: {
      type: Object,
      required: true
    }
  },
  
  data() {
    return {
      formData: {
        name: '',
      }
    }
  },
  
  methods: {
    openModal(cube) {
      this.formData = {
        name: cube.name,
      }
      this.$modal('cube-settings-modal').show()
    },
    
    async save() {
      this.$emit('update-settings', this.formData)
    }
  },
  
  mounted() {
    this.bus.on('open-cube-settings', this.openModal)
  }
}
</script>

<style scoped>
</style> 