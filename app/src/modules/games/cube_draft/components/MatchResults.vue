<template>
  <div class="match-results">
    match results
  </div>
</template>


<script>
export default {
  name: 'MatchResults',

  watch: {
    async game(newValue) {
      if (!newValue) {
        return
      }

      // Load linked games and tabulate results

    },
  }
}
</script>


<style scoped>
</style>
