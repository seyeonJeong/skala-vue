<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="container">
    <el-card shadow="never">
      <template #header>
        <h1>Weather Dashboard 소개</h1>
      </template>

      <p>
        이 서비스는 Vue.js Composition API, Router, Pinia, Axios와
        Element Plus UI Library를 활용한 지역별 날씨 대시보드입니다.
      </p>

      <el-divider />

      <ul>
        <li>도시 검색 및 카드 선택</li>
        <li>최고 기온 / 최고 습도 하이라이트</li>
        <li>OpenWeatherMap 실데이터 + 예보/대기질</li>
        <li>외부 API(Open-Meteo, Wikipedia) 도시 정보</li>
        <li>Element Plus UI 컴포넌트 적용</li>
      </ul>

      <el-button
        type="primary"
        @click="router.push('/')"
      >
        메인 대시보드로 돌아가기
      </el-button>
    </el-card>
  </main>
</template>

<style scoped>
.container {
  max-width: 720px;
  margin: 0 auto;
}

p,
ul {
  margin-top: 12px;
  line-height: 1.7;
}

.el-button {
  margin-top: 20px;
}
</style>
