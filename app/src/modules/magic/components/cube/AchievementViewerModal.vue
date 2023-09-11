<template>
  <Modal id="achievement-viewer-modal">
    <template #header>Achievement Viewer</template>

    <template v-if="!!achievement">

      <div>
        <h2 class="achievement-name">{{ achievement.name }}</h2>
        <div class="achievement-text">{{ achievement.unlock }}</div>
      </div>


      <template v-if="!!achievement.claimed">
        Claimed!
      </template>

      <template v-else>
        <hr>
        <h2 class="question">Did you really earn this?</h2>
        <div class="buttons-row">
          <button class="btn btn-success yes-no-btn" @click="unlock">yes</button>
          <button class="btn btn-danger yes-no-btn" data-bs-dismiss="modal">no</button>
        </div>
      </template>

    </template>

    <template #footer>
      <div></div>
    </template>
  </Modal>
</template>


<script>
import { mapState } from 'vuex'

import Modal from '@/components/Modal'

export default {
  name: 'AchievementViewerModal',

  components: {
    Modal,
  },

  computed: {
    ...mapState('magic/cube', {
      achievement: 'managedAchievement',
    }),
  },

  methods: {
    unlock() {
      console.log('unlocked')
      this.achievement.claimed = true
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
