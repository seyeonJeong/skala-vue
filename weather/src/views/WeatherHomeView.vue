<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { weatherList as weatherMockList } from '../data/weatherMock'

const router = useRouter()

const searchQuery = ref('')
const selectedCityInfo = ref(null)
const weatherList = ref([...weatherMockList])

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

// alert 제거 → Programmatic Navigation
const goToDetail = (city) => {
  router.push('/weather/' + city.id)
}

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
    <h1>날씨 대시보드</h1>

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
              {{ hottestCity.name }} ({{ hottestCity.temp }}℃)
            </template>
            <template v-else>
              최고 습도:
              {{ mostHumidCity.name }} ({{ mostHumidCity.humidity }}%)
            </template>
          </p>
        </section>
      </template>

      <template #list>
        <template v-if="filteredWeatherList.length > 0">
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
