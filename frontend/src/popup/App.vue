<template>
  <div class="popup-container">
    <h1>PUXA AI Browser</h1>
    <div class="status">
      <p>Status: {{ status }}</p>
      <p v-if="defluffScore !== null">Defluff Score: {{ defluffScore }}</p>
    </div>
    <button @click="testAPI">Test API Connection</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const status = ref('Ready');
const defluffScore = ref(null);

async function testAPI() {
  status.value = 'Testing...';
  try {
    const response = await fetch('http://localhost:8000/api/health/');
    const data = await response.json();
    status.value = `Connected: ${data.service}`;
  } catch (error) {
    status.value = `Error: ${error.message}`;
  }
}
</script>

<style scoped>
.popup-container {
  width: 300px;
  padding: 20px;
  font-family: system-ui, -apple-system, sans-serif;
}

h1 {
  margin: 0 0 20px 0;
  font-size: 18px;
}

.status {
  margin: 20px 0;
}

button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}
</style>

