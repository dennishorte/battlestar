<template>
  <div class="option-selector">

    <div
      :class="[
        'option-name',
        isValid ? '' : 'invalid-selection'
      ]">
      {{ displayName }} {{ rangeString }}
    </div>

    <div class="option-checkboxes">
      <div v-for="(option, index) in selector.options" :key="index">
        <div v-if="!optionHasChildren(option)">
          <input type="checkbox" :value="index" v-model="selected" />

          <CardLink v-if="!!cardForOption(option)" :card="cardForOption(option)" />
          <span v-else>
            {{ optionDisplayName(option) }}
          </span>

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
import CardLink from './CardLink'

import { bsg, selector, util } from 'battlestar-common'

export default {
  name: 'OptionSelector',

  components: {
    CardLink,
  },

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

    rangeString() {
      const { min, max } = selector.minMax(this.selector)
      if (min === max) {
        return `[${min}]`
      }
      else {
        return `[${min}..${max}]`
      }
    },

    selection() {
      const selectedOptions = []
      for (let i = 0; i < this.selector.options.length; i++) {
        const opt = this.selector.options[i]
        const name = bsg.util.optionName(opt)
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
    cardForOption(option) {
      try {
        const name = bsg.util.optionName(option)
        return this.$game.getCardById(name)
      }
      catch {
        return undefined
      }
    },

    optionDisplayName(option) {
      return bsg.util.optionName(option)
    },

    optionHasChildren(option) {
      return Array.isArray(option.options)
    },

    childChanged(event) {
      const childIndex = this.selector.options.findIndex(o => bsg.util.optionName(o) === event.name)

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
