<script setup>
import { useRoute, useRouter } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'

const route = useRoute()
const router = useRouter()

const menus = [
  { path: '/', label: '대시보드' },
  { path: '/stats', label: '통계' },
  { path: '/about', label: '소개' },
]

const onSelect = (path) => {
  if (route.path !== path) router.push(path)
}
</script>

<template>
  <div class="app-shell">
    <el-menu
      mode="horizontal"
      :ellipsis="false"
      :default-active="route.path"
      class="nav-menu"
      @select="onSelect"
    >
      <el-menu-item
        v-for="menu in menus"
        :key="menu.path"
        :index="menu.path"
      >
        {{ menu.label }}
      </el-menu-item>

      <div class="nav-right">
        <UnitToggler />
      </div>
    </el-menu>

    <RouterView />
  </div>
</template>

<style scoped>
.app-shell {
  width: 100%;
}

.nav-menu {
  margin-bottom: 24px;
  border-bottom: 1px solid var(--el-border-color);
}

.nav-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  padding-right: 12px;
}
</style>
