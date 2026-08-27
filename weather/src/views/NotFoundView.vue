<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="container">
    <h1>404 - 페이지를 찾을 수 없습니다</h1>
    <p>요청하신 경로는 정의되지 않은 주소입니다.</p>

    <button @click="router.push('/')">
      홈으로 이동
    </button>
  </main>
</template>

<style scoped>
.container {
  max-width: 720px;
  margin: 40px auto;
  text-align: center;
}

p {
  margin: 16px 0 24px;
}

button {
  padding: 10px 16px;
  cursor: pointer;
}
</style>
