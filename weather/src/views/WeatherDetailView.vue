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

    <p
      v-if="loading"
      class="loading"
    >
      상세 데이터를 불러오는 중...
    </p>

    <section
      v-else-if="city"
      class="detail-card"
    >
      <div class="title-row">
        <h2>{{ city.name }}</h2>
        <img
          v-if="city.icon"
          :src="`https://openweathermap.org/img/wn/${city.icon}@2x.png`"
          :alt="city.status"
          width="64"
          height="64"
        />
      </div>

      <p><strong>도시 코드:</strong> {{ city.id }}</p>
      <p>
        <strong>기온:</strong>
        {{ displayTemp }}{{ configStore.unitSymbol }}
      </p>
      <p>
        <strong>체감온도:</strong>
        {{ displayFeelsLike }}{{ configStore.unitSymbol }}
      </p>
      <p><strong>날씨:</strong> {{ city.status }}</p>
      <p><strong>습도:</strong> {{ city.humidity }}%</p>
      <p><strong>풍속:</strong> {{ city.wind }} m/s</p>
      <p v-if="city.pressure">
        <strong>기압:</strong> {{ city.pressure }} hPa
      </p>
      <p v-if="city.updatedAt">
        <strong>관측 시각:</strong> {{ city.updatedAt }}
      </p>
      <p class="observation">
        <strong>메모:</strong> {{ city.observation }}
      </p>

      <!-- OpenWeatherMap Forecast API -->
      <section
        v-if="forecast.length"
        class="sub-section"
      >
        <h3>5일 예보 (Forecast API)</h3>
        <ul class="forecast-list">
          <li
            v-for="item in forecast"
            :key="item.time"
          >
            <span>{{ item.time.slice(0, 10) }}</span>
            <span>
              {{ configStore.convertTemp(item.temp) }}{{ configStore.unitSymbol }}
            </span>
            <span>{{ item.status }}</span>
          </li>
        </ul>
      </section>

      <!-- OpenWeatherMap Air Pollution API -->
      <section
        v-if="airPollution"
        class="sub-section"
      >
        <h3>대기질 (Air Pollution API)</h3>
        <p>
          AQI {{ airPollution.aqi }} · {{ airPollution.label }}
        </p>
        <p>
          PM2.5: {{ airPollution.pm2_5?.toFixed?.(1) ?? airPollution.pm2_5 }}
          · PM10: {{ airPollution.pm10?.toFixed?.(1) ?? airPollution.pm10 }}
        </p>
      </section>

      <!-- 기타 외부 API: Open-Meteo Geocoding -->
      <section
        v-if="cityGeo"
        class="sub-section"
      >
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

      <!-- 기타 외부 API: Wikipedia -->
      <section
        v-if="cityWiki"
        class="sub-section wiki"
      >
        <h3>도시 소개 (Wikipedia API)</h3>
        <div class="wiki-row">
          <img
            v-if="cityWiki.thumbnail"
            :src="cityWiki.thumbnail"
            :alt="cityWiki.title"
            width="96"
          />
          <div>
            <p><strong>{{ cityWiki.title }}</strong></p>
            <p class="wiki-extract">{{ cityWiki.extract }}</p>
            <a
              v-if="cityWiki.url"
              :href="cityWiki.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              위키백과에서 더 보기
            </a>
          </div>
        </div>
      </section>

      <button @click="router.push('/')">
        대시보드로 돌아가기
      </button>
    </section>

    <section
      v-else
      class="empty"
    >
      <p>해당 도시 코드의 관측 데이터를 찾을 수 없습니다.</p>
      <button @click="router.push('/')">
        대시보드로 돌아가기
      </button>
    </section>
  </main>
</template>

<style scoped>
.container {
  max-width: 720px;
  margin: 0 auto;
}

.error-banner {
  margin: 12px 0;
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

.loading {
  margin-top: 20px;
}

.detail-card,
.empty {
  margin-top: 20px;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fafafa;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.observation {
  margin-top: 16px;
  line-height: 1.6;
}

.sub-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.forecast-list {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
}

.forecast-list li {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr 1fr;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
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

button {
  margin-top: 20px;
  padding: 10px 16px;
  cursor: pointer;
}
</style>
