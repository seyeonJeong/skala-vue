# skala-vue

Vue.js 실습 제출용 저장소입니다.  
이후 실습 내용도 **이 README 하나만** 계속 업데이트합니다.

## 폴더 구조

```text
skala-vue/
└── weather/    # Weather Dashboard (Composition API 실습)
```

## 실행 방법

```sh
cd weather
npm install
npm run dev
```

브라우저: `http://localhost:5173/`

---

# Hands on - Project Scaffolding

Vue 3 로컬 개발 환경 구성 및 프로젝트 스캐폴딩 실습입니다.

## 1. Local Development Environment

### Node.js 설치

```sh
node -v
npm -v
```

- Node.js: `v26.5.0`
- npm: `12.0.1`

### VS Code Extension 설치

- [Vue - Official (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 2. Project Scaffolding

### 프로젝트 생성

```sh
npm create vue@3.22.3
```

| 항목 | 선택 |
|---|---|
| Project name | `skala-vue` |
| TypeScript | No |
| Features | Router, Pinia, Linter, Prettier |
| Experimental features | none |
| Blank project | No (예제 코드 포함) |

### 의존성 설치 및 실행

```sh
npm install
npm run dev
```

### 동작 확인

1. `http://localhost:5173/` 접속
2. Vue 기본 템플릿 화면 확인
3. 소스 수정 시 Vite HMR로 즉시 반영되는지 확인 (`AboutView.vue` template 변경 등)

---

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

---

# Hands on - Weather Composition

Vue Composition API(`ref`, `computed`, `watch`, `watchEffect`)를 활용한 날씨 대시보드 실습입니다.

## 1. 반응형 상태 관리 (ref)
- `searchQuery`: 도시 검색어
- `selectedCityInfo`: 선택된 도시 정보
- `weatherList`: 지역별 날씨 데이터 배열 (서울, 수원, 부산, 제주)

## 2. 검색 도시 필터링 (computed)
- `filteredWeatherList`: 검색어가 도시 이름에 포함된 항목만 필터링
- 검색어가 비어 있으면 원본 `weatherList` 반환

## 3. 반응형 변수 변화 감시
- `watch(selectedCityInfo)`: 선택 도시가 바뀔 때마다 콘솔 로그 출력
- `watchEffect(searchQuery)`: 검색어 타이핑마다 콘솔 로그 출력

## 4. 검색 결과 표시 (Template)
- 검색어가 비었을 때: 전체 날씨 카드 출력
- 검색어와 일치하는 데이터가 있을 때: 필터링된 카드 출력
- 일치하는 데이터가 없을 때: "검색 결과와 일치하는 도시가 없습니다." 안내

## 5. 본인 추가 기능 (ref / computed / watch)
- `ref`: `highlightMode` (`temp` | `humidity`) — 최고 기온/습도 전환
- `computed`
  - `hottestCity`: 최고 기온 도시
  - `mostHumidCity`: 최고 습도 도시
  - `highlightCity`: 현재 모드에 따른 하이라이트 도시
- `watch(highlightCity)`: 하이라이트 도시 변경 시 콘솔 로그 출력
- 화면에 최고 기온 / 최고 습도 도시 버튼 및 결과 문구 표시
