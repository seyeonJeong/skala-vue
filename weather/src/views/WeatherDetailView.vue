<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findCityById } from '../data/weatherMock'
import { useConfigStore } from '../stores/configStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const city = ref(null)

const loadCity = () => {
  city.value = findCityById(route.params.cityId)
}

onMounted(loadCity)
watch(() => route.params.cityId, loadCity)

const displayTemp = computed(() => {
  if (!city.value) return null
  return configStore.convertTemp(city.value.temp)
})

const displayFeelsLike = computed(() => {
  if (!city.value) return null
  return configStore.convertTemp(city.value.feelsLike)
})
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
