<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <div class="app-shell">
    <nav class="nav-bar">
      <RouterLink to="/">대시보드</RouterLink>
      <RouterLink to="/stats">통계</RouterLink>
      <RouterLink to="/about">소개</RouterLink>

      <!-- 내비 옆에 단위 토글러 배치 -->
      <UnitToggler />
    </nav>

    <RouterView />
  </div>
</template>

<style scoped>
.app-shell {
  width: 100%;
}

.nav-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ddd;
}

.nav-bar a {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 600;
}

.nav-bar a.router-link-active {
  color: #2c6ecb;
}
</style>
