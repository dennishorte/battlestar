<template>
  <ModalBase>
    <template #header>
      Add Set Filter
    </template>

    <SetPicker @selection-changed="selectionChanged" />

    <template #footer>
      <button class="btn btn-secondary" @click="cancel" data-bs-dismiss="modal">cancel</button>
      <button
        class="btn btn-primary"
        @click="pick"
        data-bs-dismiss="modal"
        :disabled="!this.selected"
      >
        pick
      </button>
    </template>
  </ModalBase>
</template>


<script>
import ModalBase from '@/components/ModalBase'
import SetPicker from './SetPicker'


export default {
  name: 'SetPickerModal',

  components: {
    ModalBase,
    SetPicker,
  },

  emits: ['set-selected'],

  data() {
    return {
      selected: null,
    }
  },

  methods: {
    pick() {
      this.$emit('set-selected', this.selected)
    },

    selectionChanged(sett) {
      this.selected = sett
    },
  },
}
</script>
