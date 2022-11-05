<template>
  <div class="game-card">
    <CardFace v-if="card" v-for="index in faceIndices" :card="card" :index="index" />
  </div>
</template>


<script>
import { util } from 'battlestar-common'

import CardFace from './CardFace'


export default {
  name: 'GameCard',

  components: {
    CardFace,
  },

  props: {
    card: {
      type: Object,
      default: null,
    },
  },

  computed: {
    faceIndices() {
      if (this.card.card_faces) {
        console.log(util.range(this.card.card_faces.length))
        return util.range(this.card.card_faces.length)
      }
      else {
        return [0]
      }
    },
  },
}
</script>


<style lang="scss">
.game-card {
  display: flex;
  flex-direction: row;
  flex-wrap: none;
  overflow: scroll;
  min-height: 20em;
  max-height: 20em;
}

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

@mixin card-face($size) {
  $unit: $size * .01;

  .card-container-#{$size} {
    position: relative;
    min-width: $size;
    max-width: $size;

    .card-border {
      background: $almost-black;
      border-radius: $unit * 3;
      justify-content: space-between;
      padding: $unit * 3;
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
    .frame-pt-loyalty,
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
    .frame-pt-loyalty {
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
        padding: 0 $unit;
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
@include card-face(200px);
@include card-face(220px);
@include card-face(270px);
</style>
