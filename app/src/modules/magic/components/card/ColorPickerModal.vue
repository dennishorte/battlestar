<template>
  <BModal v-model="modalVisible" title="Color Picker" @ok="saveColors">
    <div class="section bg-secondary-subtle">
      <span>Color Identity</span>
      <div class="mana-selectors">
        <ManaSymbol
          v-for="color in colorIndicatorColors"
          :key="`identity-${props.card.name(faceIndex)}-${color}`"
          :m="color"
          :class="colorIdentity.includes(color) ? 'selected' : ''"
        />
      </div>
    </div>

    <div class="section">
      <span>Mana Produced</span>
      <div class="mana-selectors">
        <ManaSymbol
          v-for="color in producedManaColors"
          :key="`mana-${props.card.name(faceIndex)}-${color}`"
          :m="color"
          :class="producedMana.includes(color) ? 'selected' : ''"
          @click="toggleManaProduced(color)"
        />
      </div>
    </div>

    <div class="section" :class="canUseColorIndicator ? '' : 'bg-secondary-subtle'">
      <span>Color Indicator</span>
      <div class="mana-selectors">
        <ManaSymbol
          v-for="color in colorIndicatorColors"
          :key="`indicator-${props.card.name(faceIndex)}-${color}`"
          :m="color"
          :class="colorIndicator.includes(color) ? 'selected' : ''"
          @click="toggleColorIndicator(color)"
        />
      </div>
    </div>

    <div class="section">
      <div>
        Mana Cost
        <div>
          <ManaSymbol
            v-for="symbol in manaCost"
            :key="`manacost-${props.card.name(faceIndex)}-${symbol}`"
            :m="symbol"
            @click="removeManaFromCost(symbol)"
          />
        </div>
      </div>
      <div class="mana-cost-selectors">
        <div class="mana-selectors" v-for="[name, symbols] in Object.entries(manaSelectors)" :key="name">
          <ManaSymbol
            v-for="symbol in symbols"
            :key="`${name}-${props.card.name(faceIndex)}-${symbol}`"
            :m="symbol"
            @click="addManaToCost(symbol)"
          />
        </div>
      </div>
    </div>

  </BModal>
</template>


<script setup>
import { computed, ref, watch } from 'vue'
import { magic, util } from 'battlestar-common'
import ManaSymbol from './ManaSymbol.vue'

const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
  faceIndex: {
    type: Number,
    default: 0,
  },

  // The visibility of the modal
  // It is passed through from the parent down to the actual modal that this component contains,
  // which is required by Bootstrap Vue Next in order to have modals as separate components.
  modelValue: {
    type: Boolean,
    required: true
  },
})

// Data used to render the mana symbols in the color picker
const manaSelectors = {
  manaCostColorless: ['c', '0', 'x', 'y', 'z'],
  manaCostColors: ['w', 'u', 'b', 'r', 'g'],
  manaCostPhyrexian: ['wp', 'up', 'bp', 'rp', 'gp'],
  manaCostTwoSplit: ['2w', '2u', '2b', '2r', '2g'],
  manaCostColorlessSplit: ['cw', 'cu', 'cb', 'cr', 'cg'],
  manaCostTwoColor: ['wu', 'ub', 'br', 'rg', 'gw', 'wb', 'ur', 'bg', 'rw', 'gu'],
  manaCostTwoColorPhyrexian: ['wup', 'ubp', 'brp', 'rgp', 'gwp', 'wbp', 'urp', 'bgp', 'rwp', 'gup'],
}
const producedManaColors = ['c', 'w', 'u', 'b', 'r', 'g']
const colorIndicatorColors = ['w', 'u', 'b', 'r', 'g']

// Trackers for the various color picking options
// Automatically populated with the current values of the cardface being edited using watchers.
const producedMana = ref([])
const colorIndicator = ref([])
const manaCost = ref([])

// Used to highlight the colorIdentity of the card.
const colorIdentity = computed(() => util.array.distinct([
  ...producedMana.value,
  ...colorIndicator.value,
  ...extractColorsFromManaCost(manaCost.value)
]).sort())

// Used to calculate the color identity of the card
function extractColorsFromManaCost(symbols) {
  return ['w', 'u', 'b', 'r', 'g'].filter(c => symbols.some(s => s.includes(c)))
}

// Used for adjusting the mana cost
function incrementColorlessCost(amount) {
  const colorlessString = manaCost.value.find(x => util.isDigits(x))

  if (colorlessString) {
    util.array.remove(manaCost.value, colorlessString)
    console.log(manaCost.value)
    const colorlessValue = parseInt(colorlessString) + amount
    if (colorlessValue > 0) {
      manaCost.value.push(colorlessValue.toString())
    }
  }
  else if (amount > 0) {
    manaCost.value.push(amount.toString())
  }

  updateAfterManaCostChange()
}

// Used for adjusting the mana cost
function addManaToCost(symbol) {
  if (symbol === 'c') {
    incrementColorlessCost(1)
  }
  else {
    manaCost.value.push(symbol)
  }
  updateAfterManaCostChange()
}

// Used for adjusting the mana cost
function removeManaFromCost(symbol) {
  if (util.isDigits(symbol)) {
    incrementColorlessCost(-1)
  }
  else {
    util.array.remove(manaCost.value, symbol)
  }
  updateAfterManaCostChange()
}

function updateAfterManaCostChange() {
  manaCost.value = magic.util.card.sortManaArray(manaCost.value)

  // If color indicator isn't valid, clear it's values.
  if (!canUseColorIndicator.value) {
    colorIndicator.value = []
  }
}

// Used for adjusting the color indicator
function toggleColorIndicator(color) {
  if (!canUseColorIndicator.value) {
    alert('You can only use the color indicator if there is no color in the mana cost.')
  }
  else if (colorIndicator.value.includes(color)) {
    util.array.remove(colorIndicator.value, color)
  }
  else {
    colorIndicator.value.push(color)
  }
}

// Used for adjusting the mana produced
function toggleManaProduced(color) {
  if (producedMana.value.includes(color)) {
    util.array.remove(producedMana.value, color)
  }
  else {
    producedMana.value.push(color)
  }
}

// Can only use the color indicator if there is no mana cost.
const canUseColorIndicator = computed(() => {
  return manaCost.value.length === 0
})

function saveColors() {
  emit('colors-updated', {
    faceIndex: props.faceIndex,
    colorFields: {
      producedMana: producedMana.value,
      colorIndicator: colorIndicator.value,
      manaCost: manaCost.value.map(s => '{' + s + '}').join(''),
    },
  })
}

// Track the visibility of the modal via a parent-level v-model directive.
const emit = defineEmits(['update:modelValue', 'colors-updated'])
const modalVisible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

// Called by the watchers to update all of the mana values.
function updateMana() {
  function getColorProps(name) {
    return [...props.card[name](props.faceIndex)].map(c => c.toLowerCase())
  }

  function getManaCostSymbols() {
    const costString = props.card.manaCost(props.faceIndex)
    const symbols = magic.util.card.manaSymbolsFromString(costString)
    return symbols
  }

  if (props.card) {
    producedMana.value = getColorProps('producedMana')
    colorIndicator.value = getColorProps('colorIndicator')
    manaCost.value = getManaCostSymbols()
  }
}

// Update to the latest mana values when the card or faceIndex changes.
watch(
  () => props.card,
  () => {
    updateMana(props.card, props.faceIndex)
  },
  { immediate: true, flush: 'post' },
)
watch(
  () => props.faceIndex,
  () => {
    updateMana(props.card, props.faceIndex)
  },
  { immediate: true, flush: 'post' },
)
</script>


<style scoped>
.section {
  border: 1px solid #aaa;
  border-radius: .25em;
  margin-bottom: .5em;
  padding: .5em;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.mana-selectors {
  display: flex;
  flex-direction: row;
  gap: .5em;
}

.mana-cost-selectors {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: .5em;
}

.selected {
  box-shadow: 0 0 5px #00f, 0 0 10px #00f, 0 0 15px #00f;
}
</style>
