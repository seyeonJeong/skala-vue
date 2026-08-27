<script setup>
defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

const onInput = (event) => {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="search-box">
    <h2>도시 검색</h2>

    <input
      type="text"
      placeholder="도시 이름을 입력하세요"
      :value="searchQuery"
      @input="onInput"
    />

    <p>
      현재 검색어:
      {{ searchQuery || '없음' }}
    </p>
  </div>
</template>

<style scoped>
.search-box input {
  width: 100%;
  max-width: 420px;
  padding: 10px 12px;
  font-size: 1rem;
  box-sizing: border-box;
}
</style>
