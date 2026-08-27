<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findCityMetaById, findCityById } from '../data/weatherMock'
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchAirPollution,
  hasOpenWeatherKey,
  getApiErrorDetail,
} from '../api/openWeather'
import { fetchCityGeo, fetchCityWikipedia } from '../api/external'
import { useConfigStore } from '../stores/configStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const city = ref(null)
const forecast = ref([])
const airPollution = ref(null)
const cityGeo = ref(null)
const cityWiki = ref(null)
const loading = ref(false)
const errorMessage = ref('')
const errorDetails = ref([])

const displayTemp = computed(() => {
  if (!city.value) return null
  return configStore.convertTemp(city.value.temp)
})

const displayFeelsLike = computed(() => {
  if (!city.value) return null
  return configStore.convertTemp(city.value.feelsLike)
})

const loadDetail = async () => {
  loading.value = true
  errorMessage.value = ''
  errorDetails.value = []
  forecast.value = []
  airPollution.value = null
  cityGeo.value = null
  cityWiki.value = null

  const meta = findCityMetaById(route.params.cityId)
  if (!meta) {
    city.value = null
    loading.value = false
    return
  }

  try {
    if (!hasOpenWeatherKey()) {
      city.value = findCityById(meta.id)
      errorMessage.value =
        'API Key가 없어 Mock + 외부 API(도시정보)만 표시합니다.'
    } else {
      // 1) Current Weather
      try {
        city.value = await fetchCurrentWeather(meta)
      } catch (error) {
        const detail = getApiErrorDetail(error)
        console.error('Current Weather 실패:', detail, error)
        errorDetails.value.push(`Current Weather: ${detail}`)
        city.value = findCityById(meta.id)
      }

      // 2) Forecast
      try {
        forecast.value = await fetchForecast(meta.lat, meta.lon)
      } catch (error) {
        const detail = getApiErrorDetail(error)
        console.error('Forecast 실패:', detail, error)
        errorDetails.value.push(`Forecast: ${detail}`)
      }

      // 3) Air Pollution
      try {
        airPollution.value = await fetchAirPollution(meta.lat, meta.lon)
      } catch (error) {
        const detail = getApiErrorDetail(error)
        console.error('Air Pollution 실패:', detail, error)
        errorDetails.value.push(`Air Pollution: ${detail}`)
      }

      if (errorDetails.value.length) {
        errorMessage.value =
          '일부 실데이터를 불러오지 못해 Mock/부분 표시로 대체했습니다.'
      }
    }

    // 4) 기타 외부 API: Open-Meteo + Wikipedia
    const geoQuery = meta.query?.split(',')[0] || meta.name
    const [geo, wiki] = await Promise.all([
      fetchCityGeo(geoQuery),
      fetchCityWikipedia(meta.wikiTitle || meta.name),
    ])
    cityGeo.value = geo
    cityWiki.value = wiki

    if (!geo && !wiki) {
      errorDetails.value.push('외부 API(Open-Meteo/Wikipedia) 조회 실패')
      if (!errorMessage.value) {
        errorMessage.value = '외부 API 도시 정보를 불러오지 못했습니다.'
      }
    }
  } finally {
    loading.value = false
  }
}

onMounted(loadDetail)
watch(() => route.params.cityId, loadDetail)
</script>

<template>
  <main class="container">
    <h1>지역별 상세 기상관측</h1>

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

    <div
      v-if="loading"
      class="loading"
    >
      <el-skeleton
        :rows="6"
        animated
      />
    </div>

    <el-card
      v-else-if="city"
      shadow="never"
      class="detail-card"
    >
      <template #header>
        <div class="title-row">
          <span>{{ city.name }}</span>
          <img
            v-if="city.icon"
            :src="`https://openweathermap.org/img/wn/${city.icon}@2x.png`"
            :alt="city.status"
            width="64"
            height="64"
          />
        </div>
      </template>

      <el-descriptions
        :column="1"
        border
      >
        <el-descriptions-item label="도시 코드">
          {{ city.id }}
        </el-descriptions-item>
        <el-descriptions-item label="기온">
          {{ displayTemp }}{{ configStore.unitSymbol }}
        </el-descriptions-item>
        <el-descriptions-item label="체감온도">
          {{ displayFeelsLike }}{{ configStore.unitSymbol }}
        </el-descriptions-item>
        <el-descriptions-item label="날씨">
          {{ city.status }}
        </el-descriptions-item>
        <el-descriptions-item label="습도">
          {{ city.humidity }}%
        </el-descriptions-item>
        <el-descriptions-item label="풍속">
          {{ city.wind }} m/s
        </el-descriptions-item>
        <el-descriptions-item
          v-if="city.pressure"
          label="기압"
        >
          {{ city.pressure }} hPa
        </el-descriptions-item>
        <el-descriptions-item
          v-if="city.updatedAt"
          label="관측 시각"
        >
          {{ city.updatedAt }}
        </el-descriptions-item>
        <el-descriptions-item label="메모">
          {{ city.observation }}
        </el-descriptions-item>
      </el-descriptions>

      <el-divider v-if="forecast.length" />
      <section v-if="forecast.length">
        <h3>5일 예보 (Forecast API)</h3>
        <el-table
          :data="forecast"
          stripe
          size="small"
          style="width: 100%"
        >
          <el-table-column
            prop="time"
            label="날짜"
            :formatter="(_r, _c, value) => value.slice(0, 10)"
          />
          <el-table-column label="기온">
            <template #default="{ row }">
              {{ configStore.convertTemp(row.temp) }}{{ configStore.unitSymbol }}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="날씨"
          />
        </el-table>
      </section>

      <el-divider v-if="airPollution" />
      <section v-if="airPollution">
        <h3>대기질 (Air Pollution API)</h3>
        <el-tag type="success">
          AQI {{ airPollution.aqi }} · {{ airPollution.label }}
        </el-tag>
        <p class="muted">
          PM2.5: {{ airPollution.pm2_5?.toFixed?.(1) ?? airPollution.pm2_5 }}
          · PM10: {{ airPollution.pm10?.toFixed?.(1) ?? airPollution.pm10 }}
        </p>
      </section>

      <el-divider v-if="cityGeo" />
      <section v-if="cityGeo">
        <h3>도시 지리정보 (Open-Meteo Geocoding API)</h3>
        <p>
          <strong>{{ cityGeo.name }}</strong>
          · {{ cityGeo.country }} ({{ cityGeo.countryCode }})
        </p>
        <p>타임존: {{ cityGeo.timezone }}</p>
        <p>
          좌표: {{ cityGeo.latitude }}, {{ cityGeo.longitude }}
          <span v-if="cityGeo.elevation">
            · 고도 {{ cityGeo.elevation }}m
          </span>
        </p>
        <p v-if="cityGeo.population">
          인구: {{ cityGeo.population.toLocaleString() }}명
        </p>
      </section>

      <el-divider v-if="cityWiki" />
      <section
        v-if="cityWiki"
        class="wiki"
      >
        <h3>도시 소개 (Wikipedia API)</h3>
        <div class="wiki-row">
          <el-image
            v-if="cityWiki.thumbnail"
            :src="cityWiki.thumbnail"
            :alt="cityWiki.title"
            style="width: 96px; height: 96px"
            fit="cover"
          />
          <div>
            <p><strong>{{ cityWiki.title }}</strong></p>
            <p class="wiki-extract">{{ cityWiki.extract }}</p>
            <el-link
              v-if="cityWiki.url"
              :href="cityWiki.url"
              target="_blank"
              type="primary"
            >
              위키백과에서 더 보기
            </el-link>
          </div>
        </div>
      </section>

      <el-button
        type="primary"
        class="back-btn"
        @click="router.push('/')"
      >
        대시보드로 돌아가기
      </el-button>
    </el-card>

    <el-empty
      v-else
      description="해당 도시 코드의 관측 데이터를 찾을 수 없습니다."
    >
      <el-button
        type="primary"
        @click="router.push('/')"
      >
        대시보드로 돌아가기
      </el-button>
    </el-empty>
  </main>
</template>

<style scoped>
.container {
  max-width: 720px;
  margin: 0 auto;
}

.error-alert {
  margin: 12px 0 16px;
}

.error-alert ul {
  margin: 8px 0 0;
  padding-left: 18px;
}

.loading {
  margin-top: 20px;
}

.detail-card {
  margin-top: 12px;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.25rem;
  font-weight: 700;
}

.muted {
  margin-top: 10px;
  color: #666;
}

.wiki-row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-top: 10px;
}

.wiki-extract {
  margin: 8px 0;
  line-height: 1.6;
  color: #333;
}

.back-btn {
  margin-top: 20px;
}
</style>
