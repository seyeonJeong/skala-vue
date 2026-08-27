<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore'

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()

const displayTemp = computed(() => {
  return configStore.convertTemp(props.city.temp)
})
</script>

<template>
  <el-card
    shadow="hover"
    class="weather-card"
    @click="emit('select-card', city)"
  >
    <template #header>
      <div class="card-header">
        <span>{{ city.name }}</span>
        <img
          v-if="city.icon"
          :src="`https://openweathermap.org/img/wn/${city.icon}.png`"
          :alt="city.status"
          width="40"
          height="40"
        />
      </div>
    </template>

    <p>
      기온:
      <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
    </p>
    <p>날씨: {{ city.status }}</p>
    <p>습도: {{ city.humidity }}%</p>

    <el-tag
      v-if="city.temp >= 25"
      type="danger"
      effect="light"
      class="temp-tag"
    >
      🔥 더움
    </el-tag>
    <el-tag
      v-else
      type="primary"
      effect="light"
      class="temp-tag"
    >
      ❄️ 선선함
    </el-tag>

    <el-button
      type="primary"
      plain
      class="detail-btn"
      @click.stop="emit('click-detail', city)"
    >
      상세보기
    </el-button>
  </el-card>
</template>

<style scoped>
.weather-card {
  cursor: pointer;
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  font-size: 1.1rem;
}

.temp-tag {
  margin-top: 8px;
}

.detail-btn {
  margin-top: 14px;
  width: 100%;
}
</style>
