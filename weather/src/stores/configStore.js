import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    // 기온 단위 (기본값: 섭씨)
    unit: 'celsius',
    // 본인 추가: 단위 변경 횟수
    toggleCount: 0,
  }),

  getters: {
    // °C / °F 기호
    unitSymbol(state) {
      return state.unit === 'celsius' ? '°C' : '°F'
    },
    // 본인 추가: 한글 라벨 (내비/토글러 표시용)
    unitLabel(state) {
      return state.unit === 'celsius' ? '섭씨(°C)' : '화씨(°F)'
    },
  },

  actions: {
    // 섭씨 ↔ 화씨 전환
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
      this.toggleCount += 1
    },
    // 본인 추가: 섭씨 원본 → 현재 단위로 변환
    convertTemp(celsius) {
      if (this.unit === 'fahrenheit') {
        return Math.round((celsius * 9) / 5 + 32)
      }
      return celsius
    },
  },
})
