# Weather Dashboard

## 1. 프로젝트 소개
- Vue.js를 활용한 지역별 날씨 대시보드 Mockup
- 임의의 날씨 데이터를 기반으로 검색, 조건부 표시, 카드 선택 및 상세보기 기능 구현

## 2. 구현 기능
### Weather Mockup
- v-for를 활용한 지역별 날씨 카드 반복 렌더링
- :key에 도시 id 바인딩
- v-if를 활용한 기온별 상태 라벨 표시
- :value / @input을 활용한 한글 도시 검색
- 날씨 카드 클릭 시 선택 강조 상태 표시
- 상세보기 버튼 클릭 시 window.alert 출력
- .stop을 활용한 이벤트 버블링 방지

## 3. Customization
- 기본 서울/수원/부산 데이터 외 제주 데이터 추가
- 각 도시별 humidity(습도) 데이터 추가
- 날씨 카드에 습도 정보 표시
- 기본 카드 UI 및 상태바 스타일 추가

## 4. Composition API 적용
- ref를 활용한 반응형 상태 관리
- computed를 활용한 도시 검색 필터링
- watch를 활용한 선택 도시 변경 감시
- watchEffect를 활용한 검색어 변경 감시

## 5. 실행 방법

```sh
npm install
npm run dev
```
