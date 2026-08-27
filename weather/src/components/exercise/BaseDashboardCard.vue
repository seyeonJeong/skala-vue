<template>
  <div class="dashboard-card">
    <section class="search-section">
      <slot name="search"></slot>
    </section>

    <section
      v-if="$slots.status"
      class="status-section"
    >
      <slot name="status"></slot>
    </section>

    <section class="list-section">
      <slot name="list"></slot>
    </section>
  </div>
</template>

<style scoped>
.dashboard-card {
  width: 100%;
}

.search-section {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.status-section {
  margin-bottom: 20px;
}

.list-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 900px) {
  .list-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .list-section {
    grid-template-columns: 1fr;
  }
}
</style>
