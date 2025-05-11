<template>
  <ModalBase id="achievement-viewer-modal">
    <template #header>Achievement Viewer</template>

    <template v-if="!!achievement">

      <div>
        <h2 class="achievement-name">{{ achievement.name }}</h2>

        <div class="area">
          <h5>Requirements</h5>
          <div class="achievement-text">{{ achievement.unlock }}</div>
        </div>
      </div>


      <template v-if="!!achievement.claimed">

        <div class="area">
          <h5>Sections</h5>
          <div v-for="(section, index) of achievement.hidden" :key="index" class="d-grid gap-2">
            <div class="d-grid gap-2">
              <button class="btn btn-success mb-2" @click="toggle(index)">{{ section.name }}</button>
              <div v-if="toggled[index]" class="area" style="white-space: pre-wrap;">
                {{ section.text }}
              </div>
            </div>
          </div>
        </div>

        <!-- <button class="btn btn-primary" @click="finalize">finalize</button> -->
      </template>

      <template v-else>
        <hr/>
        <h2 class="question">Did you really earn this?</h2>
        <div class="buttons-row">
          <button class="btn btn-success yes-no-btn" @click="unlock">yes</button>
          <button class="btn btn-danger yes-no-btn" data-bs-dismiss="modal">no</button>
        </div>
      </template>

    </template>

    <template #footer>
      <div/>
    </template>
  </ModalBase>
</template>


<script>
import { mapState } from 'vuex'

import ModalBase from '@/components/ModalBase'

export default {
  name: 'AchievementViewerModal',

  components: {
    ModalBase,
  },

  inject: ['actor'],

  data() {
    return {
      toggled: [],
    }
  },

  computed: {
    ...mapState('magic/cube', {
      achievement: 'managedAchievement',
    }),
  },

  methods: {
    finalize() {
      alert('not implemented')
    },

    toggle(index) {
      this.toggled[index] = !this.toggled[index]
    },

    async unlock() {
      await this.$store.dispatch('magic/cube/claimAchievement', {
        achId: this.achievement._id,
        userId: this.actor._id,
      })
    }
  },
}
</script>


<style scoped>
.achievement-name {
  font-weight: bold;
  text-align: center;
  width: 100%;
}

.area {
  border: 1px solid #999;
  border-radius: .5em;
  margin-bottom: .5em;
  padding: .5em;
}

.area-header {

}

.buttons-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.question {
  width: 100%;
  text-align: center;
}

.yes-no-btn {
  width: 10em;
}
</style>
