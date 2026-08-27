<script setup>
defineProps({
  city: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <div
    class="weather-card"
    @click="emit('select-card', city)"
  >
    <h2>{{ city.name }}</h2>

    <p>기온: {{ city.temp }}℃</p>
    <p>날씨: {{ city.status }}</p>
    <p>습도: {{ city.humidity }}%</p>

    <p
      v-if="city.temp >= 25"
      class="hot"
    >
      🔥 더움
    </p>

    <p
      v-else
      class="cool"
    >
      ❄️ 선선함
    </p>

    <button @click.stop="emit('click-detail', city)">
      상세보기
    </button>
  </div>
</template>

<style scoped>
.weather-card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  cursor: pointer;
  background-color: #fff;
}

.weather-card:hover {
  background-color: #f8f8f8;
}

.hot,
.cool {
  font-weight: bold;
}

button {
  padding: 8px 14px;
  cursor: pointer;
}
</style>
