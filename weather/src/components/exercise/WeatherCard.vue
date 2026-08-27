<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore'

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()

// 원본 temp는 섭씨 → 현재 단위로 변환해 표시
const displayTemp = computed(() => {
  return configStore.convertTemp(props.city.temp)
})
</script>

<template>
  <div
    class="weather-card"
    @click="emit('select-card', city)"
  >
    <h2>{{ city.name }}</h2>

    <p>
      기온: {{ displayTemp }}{{ configStore.unitSymbol }}
    </p>
    <p>날씨: {{ city.status }}</p>
    <p>습도: {{ city.humidity }}%</p>

    <img
      v-if="city.icon"
      class="weather-icon"
      :src="`https://openweathermap.org/img/wn/${city.icon}.png`"
      :alt="city.status"
    />

    <!-- 더움/선선함은 원본 섭씨 기준 -->
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

.weather-icon {
  display: block;
  margin: 4px 0;
}

button {
  padding: 8px 14px;
  cursor: pointer;
}
</style>
