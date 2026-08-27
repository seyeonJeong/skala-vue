<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAllCurrentWeather } from '../api/openWeather'
import { useConfigStore } from '../stores/configStore'

const router = useRouter()
const configStore = useConfigStore()

const weatherList = ref([])
const loading = ref(false)

const averageTemp = computed(() => {
  if (!weatherList.value.length) return '-'
  const sum = weatherList.value.reduce((acc, city) => acc + city.temp, 0)
  const celsiusAvg = sum / weatherList.value.length
  return configStore.convertTemp(celsiusAvg)
})

const averageHumidity = computed(() => {
  if (!weatherList.value.length) return '-'
  const sum = weatherList.value.reduce((acc, city) => acc + city.humidity, 0)
  return (sum / weatherList.value.length).toFixed(1)
})

const windiestCity = computed(() => {
  if (!weatherList.value.length) return null
  return weatherList.value.reduce((max, city) =>
    city.wind > max.wind ? city : max,
  )
})

onMounted(async () => {
  loading.value = true
  try {
    const { list } = await fetchAllCurrentWeather()
    weatherList.value = list
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="container">
    <h1>날씨 통계</h1>
    <p>전체 관측 도시 기준 요약 통계입니다. (실데이터/Mock)</p>

    <p
      v-if="loading"
      class="loading"
    >
      통계 데이터 로딩 중...
    </p>

    <section
      v-else
      class="stats"
    >
      <div class="stat-card">
        <h2>평균 기온</h2>
        <p>{{ averageTemp }}{{ configStore.unitSymbol }}</p>
      </div>
      <div class="stat-card">
        <h2>평균 습도</h2>
        <p>{{ averageHumidity }}%</p>
      </div>
      <div class="stat-card">
        <h2>최대 풍속 도시</h2>
        <p v-if="windiestCity">
          {{ windiestCity.name }} ({{ windiestCity.wind }} m/s)
        </p>
        <p v-else>-</p>
      </div>
    </section>

    <button @click="router.push('/')">
      대시보드로 돌아가기
    </button>
  </main>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
}

.loading {
  margin-top: 20px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;
}

.stat-card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #f7fbff;
}

button {
  margin-top: 24px;
  padding: 10px 16px;
  cursor: pointer;
}

@media (max-width: 700px) {
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
