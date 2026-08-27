<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Refresh } from '@element-plus/icons-vue'
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
      <el-button
        type="primary"
        :loading="loading"
        :icon="Refresh"
        @click="loadWeather"
      >
        새로고침
      </el-button>
    </div>

    <el-tag
      class="source-badge"
      :type="dataSource === 'openweather' ? 'success' : 'warning'"
    >
      데이터 소스:
      {{ dataSource === 'openweather' ? 'OpenWeatherMap (실데이터)' : 'Mock' }}
    </el-tag>

    <el-alert
      v-if="errorMessage"
      class="error-alert"
      type="warning"
      :closable="false"
      show-icon
      :title="errorMessage"
    >
      <ul v-if="errorDetails.length">
        <li
          v-for="(detail, index) in errorDetails"
          :key="index"
        >
          {{ detail }}
        </li>
      </ul>
    </el-alert>

    <BaseDashboardCard>
      <template #search>
        <SearchBar
          :search-query="searchQuery"
          @update-query="searchQuery = $event"
        />
      </template>

      <template #status>
        <el-alert
          type="info"
          :closable="false"
          show-icon
          class="status-alert"
          :title="
            selectedCityInfo
              ? `${selectedCityInfo.name}이(가) 선택되었습니다.`
              : '아직 선택된 도시가 없습니다.'
          "
        />

        <el-card
          shadow="never"
          class="highlight-box"
        >
          <el-radio-group
            v-model="highlightMode"
            size="default"
          >
            <el-radio-button value="temp">최고 기온 도시</el-radio-button>
            <el-radio-button value="humidity">최고 습도 도시</el-radio-button>
          </el-radio-group>

          <p
            v-if="highlightCity"
            class="highlight-text"
          >
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
        </el-card>
      </template>

      <template #list>
        <el-col
          v-if="loading"
          :span="24"
        >
          <div class="center-box">
            <el-skeleton
              :rows="4"
              animated
            />
          </div>
        </el-col>

        <template v-else-if="filteredWeatherList.length > 0">
          <el-col
            v-for="city in filteredWeatherList"
            :key="city.id"
            :xs="24"
            :sm="12"
            :md="6"
            class="card-col"
          >
            <WeatherCard
              :city="city"
              @select-card="selectCity"
              @click-detail="goToDetail"
            />
          </el-col>
        </template>

        <el-col
          v-else
          :span="24"
        >
          <el-empty description="검색 결과와 일치하는 도시가 없습니다." />
        </el-col>
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

.source-badge {
  margin: 12px 0;
}

.error-alert {
  margin-bottom: 16px;
}

.error-alert ul {
  margin: 8px 0 0;
  padding-left: 18px;
}

.status-alert {
  margin-bottom: 12px;
}

.highlight-box {
  background: #f5f9ff;
}

.highlight-text {
  margin: 14px 0 0;
  font-weight: 600;
}

.card-col {
  margin-bottom: 16px;
}

.center-box {
  padding: 20px 0;
}
</style>
