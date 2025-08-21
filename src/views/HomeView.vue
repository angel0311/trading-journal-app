<template>
  <div class="home">
    <img alt="Trading Journal App Logo" src="../assets/logo.png" style="width: 240px; margin-bottom: 20px;">
    <h1>Trading Journal App</h1>
    <p>
      Use this app to log, review, and analyze your trades.
    </p>
    <div class="actions">
      <router-link to="/trades" class="btn btn-primary">view trades</router-link>
      <router-link to="/add" class="btn btn-primary">add new trades</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 40px;
}

.actions {
  margin-top: 25px;
}
</style>
