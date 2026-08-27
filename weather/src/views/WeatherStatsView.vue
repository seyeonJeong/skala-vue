<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { weatherList } from '../data/weatherMock'
import { useConfigStore } from '../stores/configStore'

const router = useRouter()
const configStore = useConfigStore()

const averageTemp = computed(() => {
  const sum = weatherList.reduce((acc, city) => acc + city.temp, 0)
  const celsiusAvg = sum / weatherList.length
  return configStore.convertTemp(celsiusAvg)
})

const averageHumidity = computed(() => {
  const sum = weatherList.reduce((acc, city) => acc + city.humidity, 0)
  return (sum / weatherList.length).toFixed(1)
})

const windiestCity = computed(() => {
  return weatherList.reduce((max, city) =>
    city.wind > max.wind ? city : max,
  )
})
</script>

<template>
  <main class="container">
    <h1>날씨 통계</h1>
    <p>전체 관측 도시 기준 요약 통계입니다. (본인 추가 View)</p>

    <section class="stats">
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
        <p>{{ windiestCity.name }} ({{ windiestCity.wind }} m/s)</p>
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
