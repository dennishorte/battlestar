<template>
  <div class="magic-card" :style="cardStyles" v-if="card">

    <div class="magic-card-face-wrapper" v-for="(_, index) in this.card.numFaces()" :key="index">
      <slot name="before-face" :face="card.face(index)" :face-index="index" />

      <CardFace
        :card="card"
        :index="index"
        :size="size"
        :is-editable="isEditable"
        @updateFace="$emit('update-face', $event)"
        @show-color-picker="showColorPicker"
      />

      <slot name="after-face" />
    </div>

    <ColorPickerModal
      :card="card"
      :face-index="colorPickerFaceIndex"
      :lazy="true"
      v-model="colorPickerVisible"
      @colors-updated="colorsUpdated"
    />

    <div v-if="disabled" class="card-disabled-overlay"/>
  </div>
</template>


<script>
import { util } from 'battlestar-common'

import CardFace from './CardFace'
import ColorPickerModal from './ColorPickerModal'

export default {
  name: 'MagicCard',

  components: {
    CardFace,
    ColorPickerModal,
  },

  emits: ['update-face'],

  props: {
    card: {
      type: Object,
      default: null,
    },
    size: {
      type: Number,
      default: 200,
    },
    limitHeight: {
      type: Boolean,
      default: true,
    },
    scrollable: {
      type: Boolean,
      default: true
    },
    isEditable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      colorPickerFaceIndex: 0,
      colorPickerVisible: false,
    }
  },

  computed: {
    cardStyles() {
      const styles = {
        'overflow-x': 'scroll',
      }

      if (this.limitHeight) {
        styles['max-height'] = '25em'
        styles['overflow-y'] = this.scrollable ? 'scroll' : 'hidden'
      }

      return styles
    },
  },

  methods: {
    colorsUpdated({ faceIndex, colorFields }) {
      // Check if each field actually changes and emit events if they did.
      for (const [field, value] of Object.entries(colorFields)) {
        const original = this.card[field](faceIndex)

        let equality

        if (typeof original === 'string') {
          equality = original === value
        }
        else if (Array.isArray(original)) {
          equality = util.array.elementsEqual(original, value)
        }
        else {
          throw new Error('Unexpected type: ' + (typeof original))
        }

        if (!equality) {
          this.$emit('update-face', {
            index: faceIndex,
            field: util.toSnakeCase(util.toPlainCase(field)),
            value,
          })
        }
      }
    },

    showColorPicker(faceIndex) {
      this.colorPickerFaceIndex = faceIndex
      this.colorPickerVisible = true
    },
  },
}
</script>


<style lang="scss">
$artifact-bg: #9facc3;
$artifact-fg: #dfe0f2;
$artifact-bdr: #dbd9e8;
$artifact-txt: #d6d8e7;

$blue-bg: #73b2e0;
$blue-fg: #cfdfec;
$blue-bdr: #2a6186;
$blue-txt: #eaeef7;

$black-bg: #292d3a;
$black-fg: #c4bbc2;
$black-bdr: #2a292c;
$black-txt: #eae6ef;

$green-bg: #709d61;
$green-fg: #c8d5cd;
$green-bdr: #1c6a31;
$green-txt: #dae5de;

$gold-bg: #cebc70;
$gold-fg: #dbc582;
$gold-bdr: #ddd09c;
$gold-txt: #f6f3e2;

$land-bg: #847467;
$land-fg: #c2bebf;
$land-bdr: #897978;
$land-txt: #c8c7c5;

$red-bg: #ce563d;
$red-fg: #f4c0ac;
$red-bdr: #d22e22;
$red-txt: #fde4e3;

$white-bg: #d5cba6;
$white-fg: #f4f5f0;
$white-bdr: #f3f1e9;
$white-txt: #fdfbf8;

$almost-black: #171314;
$silver: #9facb4;
$gold: #d9631b;

.magic-card {
  display: flex;
  flex-direction: row;
  flex-wrap: none;
}

.magic-card-face-wrapper {
  display: flex;
  flex-direction: column;
}

@mixin frame-colors($name, $background, $foreground, $border, $rules-background) {
  .#{$name}-card {
    .card-background {
      background-color: $background;
    }
    .frame-foreground {
      background-color: $foreground;
      border-color: $border;
    }
    .frame-art {
      border-color: $border;
    }
    .frame-text-box {
      background-color: $rules-background;
      border-color: $border;
    }
  }
}
@include frame-colors('artifact', $artifact-bg, $artifact-fg, $artifact-bdr, $artifact-txt);
@include frame-colors('black', $black-bg, $black-fg, $black-bdr, $black-txt);
@include frame-colors('blue', $blue-bg, $blue-fg, $blue-bdr, $blue-txt);
@include frame-colors('green', $green-bg, $green-fg, $green-bdr, $green-txt);
@include frame-colors('red', $red-bg, $red-fg, $red-bdr, $red-txt);
@include frame-colors('white', $white-bg, $white-fg, $white-bdr, $white-txt);
@include frame-colors('gold', $gold-bg, $gold-fg, $gold-bdr, $gold-txt);
@include frame-colors('land', $land-bg, $land-fg, $land-bdr, $land-txt);

.card-wrapper-overlay {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background-color: rgba(12, 34, 56, 0.5);
}

.card-disabled-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: none;
  border-radius: .5em;
}

@mixin card-face($size) {
  $unit: $size * .01;

  .card-container-#{$size} {
    position: relative;
    min-width: $size;
    max-width: $size;

    .artist-name {
      color: #ddd;
      font-size: $unit * 3.5;
      margin-left: $unit * 3;
    }
    .card-border {
      background: $almost-black;
      border-radius: $unit * 3;
      justify-content: space-between;
      padding: $unit * 3;
      padding-bottom: $unit;
    }
    .card-background {
      $border-width: $unit * 2.5;
      border-radius: $unit * 2;
      flex-direction: column;
    }
    .card-pick-info {
      font-size: $unit * 4;
      margin-top: 0;
      margin-left: $unit * 4;
    }
    .card-frame {
      position: relative;
      height: 100%;
      width: 100%;

      display: flex;
      flex-direction: column;

      align-items: center;
      margin-bottom: 0;
      max-width: 100%;

      padding: #{$unit * 1.6} $unit;
      padding-bottom: 0;
    }
    .frame-card-icon {
      border-radius: $unit;
      border: 1px solid;
      min-height: $unit * 7;
      max-height: $unit * 7;
      min-width: $unit * 7;
      max-width: $unit * 7;
    }
    .frame-card-icon.mythic {
      background-color: orange;
    }
    .frame-card-icon.rare {
      background-color: yellow;
    }
    .frame-card-icon.uncommon {
      background-color: gray;
    }
    .frame-card-icon.common {
      background-color: black;
    }
    .frame-header,
    .frame-power-toughness,
    .frame-type-line {
      display: flex;
      flex-direction: row;
      font-size: $unit * 5;
      font-weight: 500;
      min-height: $unit * 8;
      justify-content: space-between;
      align-items: center;

      padding: 0 #{$unit * 2};

      border-radius: #{$unit*2}/#{$unit*5};
      border: 1px solid;

      width: 100%;
    }
    .frame-mana-cost {
      font-size: $unit * 4.5;
    }
    .frame-defense,
    .frame-loyalty{
      width: $unit * 15;
      align-self: flex-end;
      align-items: center;
      justify-content: center;
      padding: 0;
      height: $unit * 9;
      position: absolute;
      bottom: 0;
      right: $unit;
    }
    .frame-power-toughness {
      width: $unit * 15;
      align-self: flex-end;
      align-items: center;
      justify-content: center;
      padding: 0;
      height: $unit * 9;
      position: absolute;
      bottom: $unit * 2;
      right: $unit;
    }
    .frame-art {
      object-fit: cover;
      width: $unit * 90 - 2px;
      max-height: $unit * 70 - 2px;
      border-left: 1px solid;
      border-right: 1px solid;
      margin-left: $unit * 1.3;
    }
    .frame-text-box {
      font-size: $unit * 5;
      font-weight: normal;
      padding: $unit;
      line-height: 1;
      width: $unit * 90 - 2px;
      min-height: $unit * 50;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid;
      border-top: 0;

      div {
        flex-direction: column;
        padding: ($unit * .2) ($unit * .5);
      }
      p {
        margin-bottom: $unit * 2;
      }
      i {
        font-size: $unit * 4;
      }
      .rule-scar {
        font-weight: 550;
        color: #400;
      }
      .rules-line {
        padding: 0;
        margin-bottom: $unit * 1.5;
      }
      .reminder-text {
        font-style: italic;
      }
    }
    .frame-flavor-text,
    .frame-achievement-desc {
      font-style: italic;
      font-weight: 300;
    }
    .frame-flavor-text:first-of-type,
    .frame-achievement-desc:first-of-type {
      padding-top: 5px;
      border-top: 1px solid;
      border-color: #999 !important;
    }
  }
  .card-container.scarred {
    .card-border {
      background-image: linear-gradient(142deg, rgba(245,151,29,1) 0%, rgba(133,50,36,1) 32%, rgba(159,172,180,1) 100%);
    }
  }
}

@include card-face(160px);
@include card-face(200px);
@include card-face(220px);
@include card-face(270px);

.scar-tape {
  /* Core styling */
  background: linear-gradient(135deg, #f5f2e8 0%, #e8e0cc 50%, #ddd4b8 100%);
  color: #333!important;
  padding: 2px 6px;
  margin: -5px -3px;
  display: inline-block;
  position: relative;
  letter-spacing: 0.5px;

  /* Tape-like edges */
  border-radius: 2px;
  border: 1px solid #ccc;

  /* Shadow for depth */
  box-shadow:
    0 2px 6px rgba(0,0,0,0.2),
    0 1px 3px rgba(0,0,0,0.15),
    inset 0 1px 0 rgba(255,255,255,0.2);

  /* Transform for slight rotation */
  transform: rotate(-1deg);
  transition: transform 0.2s ease;
}

.narrow-tape {
  padding: 0 2px;
  margin: -1px -1px;
}

.scar-tape:hover {
  transform: rotate(-0.5deg) scale(1.02);
}

/* Add torn edges effect */
.scar-tape::before,
.scar-tape::after {
  content: '';
  position: absolute;
  top: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(to bottom,
    transparent 0%,
    rgba(0,0,0,0.1) 20%,
    transparent 40%,
    rgba(0,0,0,0.1) 60%,
    transparent 80%,
    rgba(0,0,0,0.1) 100%);
}

.scar-tape::before {
  left: -1px;
}

.scar-tape::after {
  right: -1px;
}
</style>
