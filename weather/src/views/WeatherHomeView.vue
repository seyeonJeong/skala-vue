<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { fetchAllCurrentWeather, hasOpenWeatherKey } from '../api/openWeather'
import { useConfigStore } from '../stores/configStore'

const router = useRouter()
const configStore = useConfigStore()

const searchQuery = ref('')
const selectedCityInfo = ref(null)
const weatherList = ref([])
const loading = ref(false)
const errorMessage = ref('')
const errorDetails = ref([])
const dataSource = ref('mock')

const filteredWeatherList = computed(() => {
  if (searchQuery.value.trim() === '') {
    return weatherList.value
  }

  return weatherList.value.filter((city) =>
    city.name.includes(searchQuery.value),
  )
})

const highlightMode = ref('temp')

const hottestCity = computed(() => {
  if (weatherList.value.length === 0) return null
  return weatherList.value.reduce((max, city) =>
    city.temp > max.temp ? city : max,
  )
})

const mostHumidCity = computed(() => {
  if (weatherList.value.length === 0) return null
  return weatherList.value.reduce((max, city) =>
    city.humidity > max.humidity ? city : max,
  )
})

const highlightCity = computed(() => {
  return highlightMode.value === 'temp'
    ? hottestCity.value
    : mostHumidCity.value
})

const selectCity = (city) => {
  selectedCityInfo.value = city
}

const goToDetail = (city) => {
  router.push('/weather/' + city.id)
}

const loadWeather = async () => {
  loading.value = true
  errorMessage.value = ''
  errorDetails.value = []

  try {
    const { source, list, error } = await fetchAllCurrentWeather()
    weatherList.value = list
    dataSource.value = source

    if (!hasOpenWeatherKey()) {
      errorMessage.value =
        'OpenWeatherMap API Key가 없어 Mock 데이터를 표시합니다. (.env 설정 후 재시작)'
    } else if (error) {
      errorMessage.value = error.summary
      errorDetails.value = error.details
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = '날씨 데이터를 불러오지 못했습니다.'
    errorDetails.value = [String(error?.message ?? error)]
  } finally {
    loading.value = false
  }
}

onMounted(loadWeather)

watch(selectedCityInfo, (newCity, oldCity) => {
  console.log(
    '선택 도시 변경:',
    oldCity?.name ?? '없음',
    '→',
    newCity?.name ?? '없음',
  )
})

watchEffect(() => {
  console.log(`현재 검색어: ${searchQuery.value}`)
})

watch(highlightCity, (city) => {
  if (!city) return
  const label =
    highlightMode.value === 'temp' ? '최고 기온' : '최고 습도'
  console.log(
    `${label} 도시:`,
    city.name,
    `(기온 ${city.temp}℃, 습도 ${city.humidity}%)`,
  )
})
</script>

<template>
  <main class="container">
    <div class="header-row">
      <h1>날씨 대시보드</h1>
      <button
        type="button"
        class="refresh-btn"
        :disabled="loading"
        @click="loadWeather"
      >
        {{ loading ? '불러오는 중...' : '새로고침' }}
      </button>
    </div>

    <p class="source-badge">
      데이터 소스:
      {{ dataSource === 'openweather' ? 'OpenWeatherMap (실데이터)' : 'Mock' }}
    </p>

    <div
      v-if="errorMessage"
      class="error-banner"
    >
      <p>{{ errorMessage }}</p>
      <ul v-if="errorDetails.length">
        <li
          v-for="(detail, index) in errorDetails"
          :key="index"
        >
          {{ detail }}
        </li>
      </ul>
    </div>

    <BaseDashboardCard>
      <template #search>
        <SearchBar
          :search-query="searchQuery"
          @update-query="searchQuery = $event"
        />
      </template>

      <template #status>
        <section class="status-bar">
          <p v-if="selectedCityInfo">
            {{ selectedCityInfo.name }}이(가) 선택되었습니다.
          </p>
          <p v-else>
            아직 선택된 도시가 없습니다.
          </p>
        </section>

        <section class="highlight-box">
          <div class="highlight-buttons">
            <button
              type="button"
              :class="{ active: highlightMode === 'temp' }"
              @click="highlightMode = 'temp'"
            >
              최고 기온 도시
            </button>
            <button
              type="button"
              :class="{ active: highlightMode === 'humidity' }"
              @click="highlightMode = 'humidity'"
            >
              최고 습도 도시
            </button>
          </div>

          <p v-if="highlightCity">
            <template v-if="highlightMode === 'temp'">
              최고 기온:
              {{ hottestCity.name }}
              ({{ configStore.convertTemp(hottestCity.temp) }}{{ configStore.unitSymbol }})
            </template>
            <template v-else>
              최고 습도:
              {{ mostHumidCity.name }} ({{ mostHumidCity.humidity }}%)
            </template>
          </p>
        </section>
      </template>

      <template #list>
        <p
          v-if="loading"
          class="no-result"
        >
          날씨 데이터를 불러오는 중...
        </p>

        <template v-else-if="filteredWeatherList.length > 0">
          <WeatherCard
            v-for="city in filteredWeatherList"
            :key="city.id"
            :city="city"
            @select-card="selectCity"
            @click-detail="goToDetail"
          />
        </template>

        <p
          v-else
          class="no-result"
        >
          검색 결과와 일치하는 도시가 없습니다.
        </p>
      </template>
    </BaseDashboardCard>
  </main>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.refresh-btn {
  padding: 8px 14px;
  cursor: pointer;
}

.source-badge {
  margin: 8px 0 12px;
  color: #555;
  font-size: 0.95rem;
}

.error-banner {
  margin-bottom: 16px;
  padding: 12px 14px;
  border-radius: 8px;
  background: #fff3cd;
  color: #856404;
}

.error-banner ul {
  margin: 8px 0 0;
  padding-left: 18px;
  font-size: 0.9rem;
  word-break: break-word;
}

.status-bar {
  margin-bottom: 16px;
  padding: 15px 18px;
  background-color: #f3f3f3;
  border-radius: 8px;
}

.highlight-box {
  margin-bottom: 8px;
  padding: 15px 18px;
  background-color: #eef6ff;
  border-radius: 8px;
}

.highlight-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.highlight-buttons button {
  padding: 8px 14px;
  cursor: pointer;
}

.highlight-buttons button.active {
  background-color: #2c6ecb;
  color: #fff;
  border-color: #2c6ecb;
}

.no-result {
  grid-column: 1 / -1;
  padding: 20px;
  text-align: center;
}
</style>
