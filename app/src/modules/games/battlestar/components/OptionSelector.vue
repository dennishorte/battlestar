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
        <div v-if="!optionHasChildren(option)">
          <input type="checkbox" :value="index" v-model="selected" />
          {{ optionName(option) }}
        </div>


        <div class="nested-options" v-else>
          <input type="checkbox" :value="index" v-model="selected" disabled />
          <OptionSelector
            :selector="option"
            @selection-changed="childChanged"
          />
        </div>
      </div>

    </div>

  </div>
</template>


<script>
import Vue from 'vue'
import { selector } from 'battlestar-common'
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
      childInfo: {},

      // The physically selected checkboxes in this option selector (by index)
      selected: [],
    }
  },

  computed: {
    displayName() {
      return `${this.selector.name}`
    },

    isValid() {
      return selector.validate(this.selector, this.selection).valid
    },

    selection() {
      const selectedOptions = []
      for (let i = 0; i < this.selector.options.length; i++) {
        const opt = this.selector.options[i]
        const name = this.optionName(opt)
        const isSelected = this.selected.includes(i)
        if (isSelected) {
          if (this.optionHasChildren(opt)) {
            selectedOptions.push(this.childInfo[name])
          }
          else {
            selectedOptions.push(name)
          }
        }
      }
      return {
        name: this.selector.name,
        option: selectedOptions
      }
    }
  },

  watch: {
    selection() {
      this.notifyParent()
    }
  },

  methods: {
    optionHasChildren(option) {
      return Array.isArray(option.options)
    },

    optionName(option) {
      return option.name || option
    },

    childChanged(event) {
      const childIndex = this.selector.options.findIndex(o => this.optionName(o) === event.name)

      if (event.isChecked) {
        Vue.set(this.childInfo, event.name, event)
        util.array.pushUnique(this.selected, childIndex)
      }
      else {
        Vue.delete(this.childInfo, event.name)
        util.array.remove(this.selected, childIndex)
      }
    },

    // Need to share our selected info upwards
    notifyParent() {
      const copy = util.deepcopy(this.selection)
      copy.isChecked = this.selected.length > 0
      this.$emit('selection-changed', copy)
    },
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
