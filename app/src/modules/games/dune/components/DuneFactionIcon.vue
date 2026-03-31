<template>
  <svg :class="['faction-icon', `faction-icon-${faction}`]"
       :width="size"
       :height="size"
       viewBox="0 0 24 24">

    <!-- Emperor: open arc with vertical stem -->
    <template v-if="faction === 'emperor'">
      <path d="M5.5 17A9 9 0 1 1 18.5 17"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round" />
      <line x1="10"
            y1="8"
            x2="10"
            y2="22"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round" />
      <line x1="14"
            y1="8"
            x2="14"
            y2="22"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round" />
      <line x1="10"
            y1="8"
            x2="4"
            y2="8"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round" />
      <line x1="14"
            y1="8"
            x2="20"
            y2="8"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round" />
    </template>

    <!-- Guild: infinity/lemniscate -->
    <template v-else-if="faction === 'guild'">
      <path d="M5 8.5a3.5 3.5 0 1 0 0 7c1.4 0 2.5-.7 3.2-1.7L10 12l1.4 1.8c1.1 1.4 2.8 2.7 4.8 2.7a5 5 0 1 0 0-10c-2 0-3.7 1-4.8 2.7L10 12l-1.8-2.3C7.5 8.9 6.4 8.5 5 8.5z"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linejoin="round" />
    </template>

    <!-- Bene Gesserit: eye with pupil -->
    <template v-else-if="faction === 'bene-gesserit'">
      <path d="M12 5C6 5 1 12 1 12s5 7 11 7 11-7 11-7-5-7-11-7z"
            fill="none"
            stroke="currentColor"
            stroke-width="3" />
      <circle cx="12"
              cy="12"
              r="3.5"
              fill="currentColor" />
    </template>

    <!-- Fremen: circle bisected horizontally with two inner dots -->
    <template v-else-if="faction === 'fremen'">
      <circle cx="12"
              cy="12"
              r="9.5"
              fill="none"
              stroke="currentColor"
              stroke-width="3" />
      <line x1="2.5"
            y1="12"
            x2="21.5"
            y2="12"
            stroke="currentColor"
            stroke-width="2" />
      <circle cx="8"
              cy="12"
              r="2.2"
              fill="currentColor" />
      <circle cx="16"
              cy="12"
              r="2.2"
              fill="currentColor" />
    </template>
  </svg>
</template>


<script>
export default {
  name: 'DuneFactionIcon',

  props: {
    faction: {
      type: String,
      required: true,
    },
    size: {
      type: [String, Number],
      default: '1em',
    },
  },
}
</script>


<style scoped>
.faction-icon {
  vertical-align: middle;
  flex-shrink: 0;
}

.faction-icon-emperor { color: #d03030; }
.faction-icon-guild { color: #e08828; }
.faction-icon-bene-gesserit { color: #8855cc; }
.faction-icon-fremen { color: #3088cc; }
</style>
