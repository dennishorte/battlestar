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
      
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="legacy-flag" v-model="formData.legacy">
        <label class="form-check-label" for="legacy-flag">Legacy Mode</label>
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
import { mapState } from 'vuex'
export default {
  name: 'CubeSettingsModal',
  
  components: {
    Modal
  },
  
  inject: ['bus'],
  
  data() {
    return {
      formData: {
        name: '',
        legacy: false,
      }
    }
  },

  computed: {
    ...mapState('magic/cube', ['cube']),
  },
  
  methods: {
    openModal() {
      this.formData = {
        name: this.cube.name,
        legacy: this.cube.flags && this.cube.flags.legacy || false,
      }
      this.$modal('cube-settings-modal').show()
    },
    
    async save() {
      await this.$store.dispatch('magic/cube/updateSettings', {
        cubeId: this.cube._id,
        settings: this.formData,
      })
    }
  },
  
  mounted() {
    this.bus.on('open-cube-settings', this.openModal)
  }
}
</script>

<style scoped>
</style> 