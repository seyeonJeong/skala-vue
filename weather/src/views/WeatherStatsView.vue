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

    <div
      v-if="loading"
      class="loading"
    >
      <el-skeleton
        :rows="3"
        animated
      />
    </div>

    <el-row
      v-else
      :gutter="16"
      class="stats"
    >
      <el-col
        :xs="24"
        :sm="8"
      >
        <el-card shadow="hover">
          <h3>평균 기온</h3>
          <p class="value">
            {{ averageTemp }}{{ configStore.unitSymbol }}
          </p>
        </el-card>
      </el-col>
      <el-col
        :xs="24"
        :sm="8"
      >
        <el-card shadow="hover">
          <h3>평균 습도</h3>
          <p class="value">{{ averageHumidity }}%</p>
        </el-card>
      </el-col>
      <el-col
        :xs="24"
        :sm="8"
      >
        <el-card shadow="hover">
          <h3>최대 풍속 도시</h3>
          <p
            v-if="windiestCity"
            class="value small"
          >
            {{ windiestCity.name }} ({{ windiestCity.wind }} m/s)
          </p>
          <p
            v-else
            class="value"
          >
            -
          </p>
        </el-card>
      </el-col>
    </el-row>

    <el-button
      type="primary"
      class="back-btn"
      @click="router.push('/')"
    >
      대시보드로 돌아가기
    </el-button>
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
  margin-top: 24px;
}

.stats .el-col {
  margin-bottom: 16px;
}

.value {
  margin: 12px 0 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #2c6ecb;
}

.value.small {
  font-size: 1.15rem;
}

.back-btn {
  margin-top: 12px;
}
</style>
