<script setup>
import { useConfigStore } from '../../stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span class="label">
      기온 단위: {{ configStore.unitLabel }}
    </span>
    <button type="button" @click="configStore.toggleUnit()">
      단위변경
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.label {
  font-size: 0.95rem;
  color: #333;
}

button {
  padding: 6px 12px;
  cursor: pointer;
  border: 1px solid #2c6ecb;
  border-radius: 6px;
  background: #2c6ecb;
  color: #fff;
}

button:hover {
  background: #1f5bb5;
}
</style>
