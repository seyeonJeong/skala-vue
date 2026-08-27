<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="container">
    <h1>Weather Dashboard 소개</h1>

    <p>
      이 서비스는 Vue.js Composition API와 컴포넌트 구조를 활용한
      지역별 날씨 Mock 대시보드입니다.
    </p>

    <ul>
      <li>도시 검색 및 카드 선택</li>
      <li>최고 기온 / 최고 습도 하이라이트</li>
      <li>도시별 상세 기상관측 페이지</li>
      <li>Vue Router 기반 페이지 이동</li>
    </ul>

    <button @click="router.push('/')">
      메인 대시보드로 돌아가기
    </button>
  </main>
</template>

<style scoped>
.container {
  max-width: 720px;
  margin: 0 auto;
}

p,
ul {
  margin-top: 16px;
  line-height: 1.7;
}

button {
  margin-top: 24px;
  padding: 10px 16px;
  cursor: pointer;
}
</style>
