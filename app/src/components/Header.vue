<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="header text-left">

          <div class="dropdown float-end">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="header-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
              menu
            </button>

            <ul class="dropdown-menu" aria-labelledby="header-dropdown">
              <li class="dropdown-item"><router-link to="/">home</router-link></li>
              <li class="dropdown-item"><router-link to="/lobby/create">new lobby</router-link></li>
              <li class="dropdown-item"><router-link to="/data">data</router-link></li>
              <li class="dropdown-item"><router-link to="/admin">admin</router-link></li>
              <li class="dropdown-item"><router-link to="/logout">logout</router-link></li>
            </ul>
          </div>

          <a href="/" class="link-unstyled">
            <h1>Game Center</h1>
          </a>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
}
</script>

<style scoped>
  .header {
  text-align: center;
  }

  #header-dropdown {
  float: right;
  margin: .5em;
  }
</style>
