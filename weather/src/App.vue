<script setup>
import {
  ref,
  computed,
  watch,
  watchEffect,
} from 'vue'

// 1. 반응형 상태
const searchQuery = ref('')

const selectedCityInfo = ref(null)

const weatherList = ref([
  {
    id: 'city_01',
    name: '서울',
    temp: 28,
    status: '맑음',
    humidity: 65,
  },
  {
    id: 'city_02',
    name: '수원',
    temp: 24,
    status: '비',
    humidity: 80,
  },
  {
    id: 'city_03',
    name: '부산',
    temp: 26,
    status: '구름',
    humidity: 70,
  },
  {
    id: 'city_04',
    name: '제주',
    temp: 23,
    status: '바람',
    humidity: 75,
  },
])

// 2. 검색 결과 자동 계산
const filteredWeatherList = computed(() => {
  // 검색어가 없으면 전체 데이터
  if (searchQuery.value.trim() === '') {
    return weatherList.value
  }

  // 검색어가 포함된 도시만 반환
  return weatherList.value.filter((city) =>
    city.name.includes(searchQuery.value),
  )
})

// 5. 본인 추가: 최고 기온 / 최고 습도 도시
const highlightMode = ref('temp') // 'temp' | 'humidity'

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

// 검색창 입력
const updateSearchQuery = (event) => {
  searchQuery.value = event.target.value
}

// 카드 선택
const selectCity = (city) => {
  selectedCityInfo.value = city
}

// 상세보기
const showDetail = (city) => {
  window.alert(
    `${city.name}의 현재 날씨는 ${city.status}이며, 기온은 ${city.temp}℃입니다.`,
  )
}

// 3. 선택 도시 감시
watch(selectedCityInfo, (newCity, oldCity) => {
  console.log(
    '선택 도시 변경:',
    oldCity?.name ?? '없음',
    '→',
    newCity?.name ?? '없음',
  )
})

// 4. 검색어 자동 감시
watchEffect(() => {
  console.log(
    `현재 검색어: ${searchQuery.value}`,
  )
})

// 5. 본인 추가: 하이라이트 도시 감시
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

    <!-- 검색 -->
    <section class="search-box">
      <h2>도시 검색</h2>

      <input
        type="text"
        placeholder="도시 이름을 입력하세요"
        :value="searchQuery"
        @input="updateSearchQuery"
      />

      <p>
        현재 검색어:
        {{ searchQuery || '없음' }}
      </p>
    </section>

    <!-- 선택 상태 -->
    <section class="status-bar">
      <p v-if="selectedCityInfo">
        {{ selectedCityInfo.name }}이(가)
        선택되었습니다.
      </p>

      <p v-else>
        아직 선택된 도시가 없습니다.
      </p>
    </section>

    <!-- 5. 본인 추가: 최고 기온 / 최고 습도 -->
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

    <!-- 검색 결과 존재 -->
    <section
      v-if="filteredWeatherList.length > 0"
      class="weather-list"
    >
      <div
        v-for="city in filteredWeatherList"
        :key="city.id"
        class="weather-card"
        @click="selectCity(city)"
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

        <button
          @click.stop="showDetail(city)"
        >
          상세보기
        </button>
      </div>
    </section>

    <!-- 검색 결과 없음 -->
    <p
      v-else
      class="no-result"
    >
      검색 결과와 일치하는 도시가 없습니다.
    </p>
  </main>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.search-box {
  margin-bottom: 20px;
}

.search-box input {
  width: 100%;
  max-width: 420px;
  padding: 10px 12px;
  font-size: 1rem;
  box-sizing: border-box;
}

.status-bar {
  margin-bottom: 24px;
  padding: 15px 18px;
  background-color: #f3f3f3;
  border-radius: 8px;
}

.highlight-box {
  margin-bottom: 24px;
  padding: 15px 18px;
  background-color: #eef6ff;
  border-radius: 8px;
}

.highlight-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.highlight-buttons button.active {
  background-color: #2c6ecb;
  color: #fff;
  border-color: #2c6ecb;
}

.weather-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.weather-card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  cursor: pointer;
}

.weather-card:hover {
  background-color: #f8f8f8;
}

.hot,
.cool {
  font-weight: bold;
}

.no-result {
  padding: 20px;
  text-align: center;
}

button {
  padding: 8px 14px;
  cursor: pointer;
}

@media (max-width: 900px) {
  .weather-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .weather-list {
    grid-template-columns: 1fr;
  }
}
</style>