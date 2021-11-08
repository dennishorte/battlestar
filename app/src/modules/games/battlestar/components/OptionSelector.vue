<template>
  <div class="option-selector">

    <div
      :class="[
        'option-name',
        isValid ? '' : 'invalid-selection'
      ]">
      {{ displayName }}
    </div>

    <div class="option-checkboxes">
      <div v-for="(option, index) in selector.options" :key="index">
        <div v-if="typeof option === 'string' || !option.options">
          <input type="checkbox" :value="index" v-model="selected" @change="updateParent" />
          {{ optionName(option) }}
        </div>


        <div class="nested-options" v-else>
          <input type="checkbox" :value="index" v-model="selected" disabled />
          <OptionSelector
            :selector="option"
            @selection-changed="updateSelection($event, index)"
          />
        </div>
      </div>

    </div>

  </div>
</template>


<script>
import Vue from 'vue'
import { util } from 'battlestar-common'

export default {
  name: 'OptionSelector',

  props: {
    required: {
      type: Boolean,
      default: false,
    },
    selector: Object,
  },

  data() {
    return {
      response: {},
      selected: [],
    }
  },

  computed: {
    count() {
      return this.selector.count ? this.selector.count : 1
    },

    name() {
      return this.selector.name ? this.selector.name : 'choose'
    },

    displayName() {
      return `${this.name} (${this.selected.length}/${this.count})`
    },

    isValid() {
      const numChecked = this.selected.length
      return (!this.required && numChecked === 0) || numChecked === this.count
    },
  },

  watch: {
    selector() {
      this.initialize()
    }
  },

  methods: {
    initialize() {
      this.response = util.deepcopy(this.selector)
      Vue.set(this.response, 'isChecked', false)
      Vue.set(this.response, 'isValid', this.isValid)
      Vue.set(this.response, 'selected', util.deepcopy(this.selected))
      this.selected = []

      this.$emit('selection-changed', this.response)
    },

    optionName(option) {
      if (typeof option === 'string') {
        return option
      }
      else {
        return option.name
      }
    },

    updateParent() {
      const numChecked = this.selected.length
      this.response.isChecked = numChecked > 0
      this.response.isValid = this.isValid
      this.response.selected = this.selected
      this.$emit('selection-changed', util.deepcopy(this.response))
    },

    updateSelection(event, index) {
      // Update the display array based on child value
      if (event.isChecked) {
        util.array.pushUnique(this.selected, index)
      }
      else {
        this.selected = this.selected.filter(x => x !== index)
      }

      Vue.set(this.response.options, index, event)
      this.response.selected = this.selected
      this.response.isValid = this.isValid

      this.$emit('selection-changed', util.deepcopy(this.response))
    },
  },

  beforeMount() {
    this.initialize()
  },
}
</script>


<style scoped>
.invalid-selection {
  color: red;
}

.nested-options {
  display: flex;
  flex-direction: row;
}

.nested-options > input {
  margin-top: .4rem;
}

.nested-options .option-selector {
  margin-left: .4rem;
}

.option-checkboxes {
  display: flex;
  flex-direction: column;
}
</style>
