<script setup>
defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])
</script>

<template>
  <div class="search-box">
    <h3>도시 검색</h3>

    <el-input
      :model-value="searchQuery"
      clearable
      placeholder="도시 이름을 입력하세요"
      size="large"
      style="max-width: 420px"
      @update:model-value="emit('update-query', $event)"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>

    <p class="hint">
      현재 검색어:
      <el-tag size="small">{{ searchQuery || '없음' }}</el-tag>
    </p>
  </div>
</template>

<style scoped>
.search-box h3 {
  margin: 0 0 12px;
}

.hint {
  margin: 12px 0 0;
  color: #666;
}
</style>
