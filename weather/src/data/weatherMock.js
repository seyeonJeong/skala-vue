// 대시보드에 표시할 도시 목록 (좌표는 OpenWeatherMap용)
export const CITY_META = [
  {
    id: 'city_01',
    name: '서울',
    query: 'Seoul,KR',
    wikiTitle: '서울특별시',
    lat: 37.5665,
    lon: 126.978,
  },
  {
    id: 'city_02',
    name: '수원',
    query: 'Suwon,KR',
    wikiTitle: '수원시',
    lat: 37.2636,
    lon: 127.0286,
  },
  {
    id: 'city_03',
    name: '부산',
    query: 'Busan,KR',
    wikiTitle: '부산광역시',
    lat: 35.1796,
    lon: 129.0756,
  },
  {
    id: 'city_04',
    name: '제주',
    query: 'Jeju,KR',
    wikiTitle: '제주특별자치도',
    lat: 33.4996,
    lon: 126.5312,
  },
]

export function findCityMetaById(cityId) {
  return CITY_META.find((city) => city.id === cityId) ?? null
}

// API 키 없을 때 / 실패 시 폴백 Mock
export const weatherList = [
  {
    id: 'city_01',
    name: '서울',
    temp: 28,
    status: '맑음',
    humidity: 65,
    wind: 3.2,
    feelsLike: 30,
    observation: '도심 열섬 영향으로 체감온도가 다소 높게 나타납니다.',
    pressure: 1012,
    countryCode: 'KR',
  },
  {
    id: 'city_02',
    name: '수원',
    temp: 24,
    status: '비',
    humidity: 80,
    wind: 4.5,
    feelsLike: 23,
    observation: '약한 비가 이어지며 습도가 높은 상태입니다.',
    pressure: 1008,
    countryCode: 'KR',
  },
  {
    id: 'city_03',
    name: '부산',
    temp: 26,
    status: '구름',
    humidity: 70,
    wind: 5.1,
    feelsLike: 27,
    observation: '해안가 구름이 많으나 강수 확률은 낮습니다.',
    pressure: 1010,
    countryCode: 'KR',
  },
  {
    id: 'city_04',
    name: '제주',
    temp: 23,
    status: '바람',
    humidity: 75,
    wind: 7.8,
    feelsLike: 21,
    observation: '강한 바람이 불어 체감온도가 낮게 느껴질 수 있습니다.',
    pressure: 1005,
    countryCode: 'KR',
  },
]

export function findCityById(cityId) {
  return weatherList.find((city) => city.id === cityId) ?? null
}
