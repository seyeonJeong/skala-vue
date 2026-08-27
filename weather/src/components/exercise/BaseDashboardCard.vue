<template>
  <div class="dashboard-card">
    <el-card
      shadow="never"
      class="search-section"
    >
      <slot name="search"></slot>
    </el-card>

    <div
      v-if="$slots.status"
      class="status-section"
    >
      <slot name="status"></slot>
    </div>

    <el-row :gutter="16">
      <slot name="list"></slot>
    </el-row>
  </div>
</template>

<style scoped>
.dashboard-card {
  width: 100%;
}

.search-section {
  margin-bottom: 20px;
}

.status-section {
  margin-bottom: 20px;
}
</style>
