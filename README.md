# skala-vue

Vue.js 실습 제출용 저장소입니다.  
이후 실습 내용도 **이 README 하나만** 계속 업데이트합니다.

## 폴더 구조

```text
skala-vue/
└── weather/
    └── src/
        ├── main.js
        ├── App.vue
        ├── api/
        │   ├── openWeather.js      # OpenWeatherMap (Axios)
        │   └── external.js         # REST Countries (외부 API)
        ├── router/
        │   └── index.js
        ├── stores/
        │   └── configStore.js
        ├── data/
        │   └── weatherMock.js
        ├── components/
        │   └── exercise/
        │       ├── BaseDashboardCard.vue
        │       ├── SearchBar.vue
        │       ├── WeatherCard.vue
        │       └── UnitToggler.vue
        └── views/
            ├── WeatherHomeView.vue
            ├── WeatherAboutView.vue
            ├── WeatherDetailView.vue
            ├── WeatherStatsView.vue
            └── NotFoundView.vue
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
(1일차 Mockup 기능을 Composition API로 정리한 단계)

## 1. 반응형 상태 관리 (ref)
- `searchQuery`: 도시 검색어
- `selectedCityInfo`: 선택된 도시 정보
- `weatherList`: 지역별 날씨 데이터 배열 (서울, 수원, 부산, 제주)

## 2. 검색 도시 필터링 (computed)
- `filteredWeatherList`: 전체 날씨 리스트 중 검색어가 도시 이름에 포함된 항목만 필터링
- 검색어가 비어 있으면 원본 `weatherList` 반환

## 3. 반응형 변수 변화 감시 (watch, watchEffect)
- `watch(selectedCityInfo)`: 상태바 문구가 바뀔 때마다 콘솔 로그 출력
- `watchEffect`: 검색어(`searchQuery`) 타이핑마다 콘솔 로그 출력

## 4. 검색 결과 표시 (Template)
- 검색어가 비었을 때: 원본 데이터 출력
- 검색어와 일치하는 데이터가 있을 때: 해당 데이터 출력
- 검색어와 일치하는 데이터가 없을 때: "검색 결과와 일치하는 도시가 없습니다." 안내

## 5. 본인 추가 기능 (ref / computed / watch)
- `ref`: `highlightMode` (`temp` | `humidity`) — 최고 기온/습도 전환
- `computed`
  - `hottestCity`: 최고 기온 도시
  - `mostHumidCity`: 최고 습도 도시
  - `highlightCity`: 현재 모드에 따른 하이라이트 도시
- `watch(highlightCity)`: 하이라이트 도시 변경 시 콘솔 로그 출력
- 화면에 최고 기온 / 최고 습도 도시 버튼 및 결과 문구 표시

---

# Hands on - Weather Components

Composition 실습 이후, 단일 파일을 컴포넌트로 분리한 단계입니다.  
(현재는 `components/exercise/` + `WeatherHomeView`로 이어짐)

## 1. WeatherParent → WeatherHomeView
- 모든 반응형 데이터·computed·watch 유지
- 자식 컴포넌트 조립 및 이벤트 처리

## 2. BaseDashboardCard.vue
- 검색박스와 리스트박스 디자인 공통화
- `<slot>` (`#search`, `#status`, `#list`)으로 부모가 도시 검색·상태·날씨 현황 주입

## 3. SearchBar.vue
- 부모로부터 검색어 반응형 데이터를 전달받아 표시 (props: `searchQuery`)
- 도시 검색 시 `update-query` 이벤트로 검색어를 부모에게 전달 (emits)

## 4. WeatherCard.vue
- 도시 객체를 전달받아 표시 (props: `city`)
- 카드 선택(`select-card`)과 상세보기(`click-detail`)를 부모에게 전달 (emits)

## 데이터 흐름
- 부모 → 자식: **props** (`searchQuery`, `city`)
- 자식 → 부모: **emits** (`update-query`, `select-card`, `click-detail`)

---

# Hands on - Weather Router

Vue Router를 적용한 페이지 라우팅 실습입니다.

## 1. Vue Router 설정
- `main.js`에서 `.use(router)`로 전역 주입
- `router/index.js`에서 **Lazy Loading** (`() => import(...)`) 적용
- Catch-all Route (`/:pathMatch(.*)*`) → `NotFoundView`

## 2. App.vue
- Navigation Bar (`RouterLink`: 대시보드 / 통계 / 소개)
- 메인 콘텐츠 영역 (`RouterView`)

## 3. WeatherHomeView.vue (`/`)
- 기존 WeatherParent 역할을 페이지 View로 이전
- 상세보기 시 `window.alert` 제거
- Programmatic Navigation: `router.push('/weather/' + id)`

## 4. WeatherDetailView.vue (`/weather/:cityId`)
- 동적 경로 `cityId`로 Mock Data에서 도시 객체 선택 (`onMounted`)
- 지역별 상세 기상관측 정보 표시 (체감온도, 풍속, 관측 메모 등)

## 5. WeatherAboutView.vue (`/about`)
- 서비스 소개 문구 작성
- 메인 대시보드로 돌아가기 버튼

## 6. 본인 추가 View — WeatherStatsView.vue (`/stats`)
- 평균 기온 / 평균 습도 / 최대 풍속 도시 통계 페이지
- 라우팅 연결 및 내비 메뉴에 추가

## 라우트 요약

| 경로 | View |
|---|---|
| `/` | WeatherHomeView |
| `/about` | WeatherAboutView |
| `/stats` | WeatherStatsView (추가) |
| `/weather/:cityId` | WeatherDetailView |
| `/*` (미정의 경로) | NotFoundView |

---

# Hands on - Weather Store

Pinia를 활용한 전역 기온 단위(섭씨/화씨) 설정 실습입니다.

## 1. configStore.js (`stores/configStore.js`)
- **State**: `unit` (기본값 `'celsius'`), 본인 추가 `toggleCount`
- **Getters**
  - `unitSymbol`: `°C` / `°F`
  - `unitLabel` (본인 추가): `섭씨(°C)` / `화씨(°F)`
- **Actions**
  - `toggleUnit`: 섭씨 ↔ 화씨 전환 (+ `toggleCount` 증가)
  - `convertTemp` (본인 추가): 섭씨 원본을 현재 단위로 변환

## 2. UnitToggler.vue
- 현재 단위 라벨 표시 + **단위변경** 버튼
- Navigation Bar 옆에 배치 (`App.vue`)

## 3. 메인 / 상세 View에 단위 반영
- `WeatherCard.vue`: `displayTemp`로 카드 기온 표시
- `WeatherDetailView.vue`: 기온·체감온도 단위 반영
- `WeatherHomeView` / `WeatherStatsView`: 최고 기온·평균 기온도 동일 Store 사용
- 원본 Mock 데이터는 섭씨 유지, 화면에서만 변환

## 4. 본인 추가
- `unitLabel` getter, `convertTemp` action, `toggleCount` state

---

# Hands on - Weather Axios

Axios로 OpenWeatherMap / 외부 API를 연동한 실습입니다.

## 1. 준비
- `npm install axios`
- OpenWeatherMap 가입 후 API Key 발급
- `weather/.env` 파일 생성:

```sh
VITE_OPENWEATHER_API_KEY=발급받은_키
```

- `.env.example` 참고, `.env`는 git에 올리지 않음
- Key 설정 후 `npm run dev` **재시작** 필요

## 2. OpenWeatherMap 실데이터 적용
- `src/api/openWeather.js` — Axios 기반 Current Weather 호출
- `WeatherHomeView`에서 서울/수원/부산/제주 현재 날씨 로드
- Key가 없으면 Mock 데이터로 폴백 + 안내 배너

## 3. OpenWeatherMap 추가 API (기능 확장)
- **5 Day / 3 Hour Forecast** — 상세 페이지 예보 목록
- **Air Pollution** — 상세 페이지 대기질(AQI, PM2.5, PM10)

## 4. 기타 외부 API (기능 확장)
- **Open-Meteo Geocoding API** — 도시 인구/타임존/좌표
- **Wikipedia REST API** — 도시 소개 문구/썸네일
- 상세 페이지(`WeatherDetailView`) 하단에 표시
- API Key 불필요

## 주요 파일

```text
src/api/openWeather.js   # OWM Current / Forecast / Air Pollution
src/api/external.js      # Open-Meteo + Wikipedia
src/views/WeatherHomeView.vue
src/views/WeatherDetailView.vue
```
---

# Hands on - Weather UI Library

외부 UI Library **Element Plus**를 선정해 3일차(Axios 연동) 화면에 적용한 실습입니다.

## 1. 선정 라이브러리
- [Element Plus](https://element-plus.org/)
- 설치: `npm install element-plus @element-plus/icons-vue`
- `main.js`에서 전역 등록 (`app.use(ElementPlus)`)

## 2. 적용 컴포넌트
- `App.vue`: `el-menu` 내비게이션
- `UnitToggler.vue`: `el-tag`, `el-button`
- `SearchBar.vue`: `el-input`, `el-icon`
- `WeatherCard.vue`: `el-card`, `el-tag`, `el-button`
- `BaseDashboardCard.vue`: `el-card`, `el-row`
- `WeatherHomeView.vue`: `el-alert`, `el-radio-group`, `el-skeleton`, `el-empty`
- `WeatherDetailView.vue`: `el-descriptions`, `el-table`, `el-divider`, `el-image`
- `WeatherStatsView` / `About` / `NotFound`: `el-card`, `el-result` 등

## 3. 참고
- OpenWeatherMap / 외부 API 연동 로직은 Axios 실습과 동일하게 유지
- UI만 Element Plus로 교체하여 사용성·시각적 완성도 향상

---

# Source Code 품질관리

## 1. ESLint 점검
- 실행 명령:

```sh
cd weather
npm run lint
```

- Oxlint + ESLint로 점검하며, **제출 과제 Error 0건**을 목표로 한다.
- 현재 프로젝트 기준 lint 통과 (Error 없음)

## 2. API Key 환경 변수 관리
- OpenWeatherMap API Key는 `.env`에 저장

```env
VITE_OPENWEATHER_API_KEY=발급받은_키
```

- `.env`는 `.gitignore`에 포함되어 **Git에 업로드되지 않음**
- 저장소에는 `.env.example`만 제공
- Vercel 배포 시에도 Environment Variable로 동일 키를 등록한다

---

# Build & Deployment

## 1. Project Build

```sh
cd weather
npm run build
```

- 빌드 결과물: `weather/dist/` (정적 파일)
- 로컬 확인: `npm run preview`

## 2. Hosting (Vercel)
- 대상: Vue 앱 폴더 `weather/`
- SPA 라우팅을 위해 `weather/vercel.json` rewrite 설정
- Vercel Project Settings
  - **Root Directory**: `weather`
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
  - **Environment Variable**: `VITE_OPENWEATHER_API_KEY`
- 배포 후 발급된 URL로 대시보드/상세/통계 동작 확인
