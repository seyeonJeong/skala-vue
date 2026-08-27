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
  },
]

export function findCityById(cityId) {
  return weatherList.find((city) => city.id === cityId) ?? null
}
