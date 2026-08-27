<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="container">
    <el-result
      icon="warning"
      title="404 - 페이지를 찾을 수 없습니다"
      sub-title="요청하신 경로는 정의되지 않은 주소입니다."
    >
      <template #extra>
        <el-button
          type="primary"
          @click="router.push('/')"
        >
          홈으로 이동
        </el-button>
      </template>
    </el-result>
  </main>
</template>

<style scoped>
.container {
  max-width: 720px;
  margin: 40px auto;
}
</style>
