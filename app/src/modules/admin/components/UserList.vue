<template>
<div class='create-user'>
  <h3>User List</h3>

  <b-table :items="users">
  </b-table>

</div>
</template>

<script>

export default {
  name: 'CreateUser',
  props: {
    users: Array,
  },
}
</script>
