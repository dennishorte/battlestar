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
      <div v-for="(option, index) in selector.choices" :key="index">
        <div v-if="!optionHasChildren(option)" class="input-row">
          <input type="checkbox" :value="index" v-model="selected" />

          <span class="input-label">
            <span>
              {{ optionDisplayName(option) }}
            </span>
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

import { selector, util } from 'battlestar-common'

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
    selectorTitle() {
      return this.selector.title
    },

    displayName() {
      return `${this.selectorTitle}`
    },

    isValid() {
      return selector.validate(this.selector, this.selection).valid
    },

    max() {
      return selector.minMax(this.selector).max
    },

    min() {
      return selector.minMax(this.selector).min
    },

    rangeString() {
      if (this.min === this.max) {
        return `[${this.min}]`
      }
      else {
        return `[${this.min}..${this.max}]`
      }
    },

    selection() {
      const selectedOptions = []
      for (let i = 0; i < this.selector.choices.length; i++) {
        const opt = this.selector.choices[i]
        const title = this.optionDisplayName(opt)
        const isSelected = this.selected.includes(i)
        if (isSelected) {
          if (this.optionHasChildren(opt)) {
            // This case comes up when selectors change.
            // Since the whole OptionSelector isn't reloaded from scratch, there is
            // leftover state whose order of recalculation can cause problems.
            if (this.childInfo[title] === undefined) {
              continue
            }
            selectedOptions.push(this.childInfo[title])
          }
          else {
            selectedOptions.push(title)
          }
        }
      }
      return {
        title: this.selectorTitle,
        selection: selectedOptions
      }
    }
  },

  watch: {
    selection() {
      this.notifyParent()
    },
  },

  methods: {
    optionDisplayName(option) {
      return option.title || option
    },

    optionHasChildren(option) {
      return Array.isArray(option.choices)
    },

    childChanged(event) {
      const childIndex = this
        .selector
        .choices
        .findIndex(o => this.optionDisplayName(o) === event.title)

      if (event.isChecked) {
        Vue.set(this.childInfo, event.title, event)
        util.array.pushUnique(this.selected, childIndex)
      }
      else {
        Vue.delete(this.childInfo, event.title)
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
input[type='checkbox'] {
  width: 1.5rem;
  height: 1.5rem;
}

.input-label {
  vertical-align: top;
}

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

.option-name {
  margin-top: .45rem;
}
</style>
