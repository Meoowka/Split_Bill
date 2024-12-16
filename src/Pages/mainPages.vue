<template>
  <div class="welcome-container">
    <h1>Добро пожаловать</h1>
    <p>Легко делитесь расходами с друзьями и приятно проводите время в кафе.</p>
    <router-link to="/users">
      <v-btn class="btn">
        Создать чек
      </v-btn>
    </router-link>
  </div>
</template>

<script>

</script>

<style scoped lang="scss">
$primary-color: #007bff;
$secondary-color: #f9f9f9;
$text-color: #333;
$input-bg: #fff;
$input-border: #ddd;
$hover-bg-color: #f1f1f1;
$icon-color: #666;
$hover-icon-color: $primary-color;
$border-radius: 8px;
$box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);


.welcome-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: $secondary-color;
  padding: 20px;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  max-width: 400px;
  width: 90%;
}

.welcome-container h1 {
  font-size: 2.5rem;
  color: $primary-color;
  margin-bottom: 20px;
}

.welcome-container p {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: $text-color;
}

.welcome-container .btn {
  display: inline-block;
  padding: 10px 15px;
  font-size: 1em;
  color: white;
  background-color: $primary-color;
  border: none;
  border-radius: $border-radius;
  text-decoration: none;
  box-shadow: $box-shadow;
  transition: background-color 0.3s;
}

.welcome-container .btn:hover {
  background-color: darken($primary-color, 10%);
}
</style>
