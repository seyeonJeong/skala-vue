<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findCityById } from '../data/weatherMock'

const route = useRoute()
const router = useRouter()

const city = ref(null)

const loadCity = () => {
  // 동적 경로 :cityId 기준으로 Mock Data에서 도시 선택
  city.value = findCityById(route.params.cityId)
}

onMounted(loadCity)
watch(() => route.params.cityId, loadCity)
</script>

<template>
  <main class="container">
    <h1>지역별 상세 기상관측</h1>

    <section
      v-if="city"
      class="detail-card"
    >
      <h2>{{ city.name }}</h2>
      <p><strong>도시 코드:</strong> {{ city.id }}</p>
      <p><strong>기온:</strong> {{ city.temp }}℃</p>
      <p><strong>체감온도:</strong> {{ city.feelsLike }}℃</p>
      <p><strong>날씨:</strong> {{ city.status }}</p>
      <p><strong>습도:</strong> {{ city.humidity }}%</p>
      <p><strong>풍속:</strong> {{ city.wind }} m/s</p>
      <p class="observation">
        <strong>관측 메모:</strong> {{ city.observation }}
      </p>

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

.detail-card,
.empty {
  margin-top: 20px;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fafafa;
}

.observation {
  margin-top: 16px;
  line-height: 1.6;
}

button {
  margin-top: 20px;
  padding: 10px 16px;
  cursor: pointer;
}
</style>
