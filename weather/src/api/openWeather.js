import axios from 'axios'
import { CITY_META, weatherList as mockList } from '../data/weatherMock'

const BASE_URL = 'https://api.openweathermap.org/data/2.5'

function getApiKey() {
  return import.meta.env.VITE_OPENWEATHER_API_KEY
}

export function hasOpenWeatherKey() {
  const key = getApiKey()
  return Boolean(key && key !== 'your_api_key_here')
}

/** Axios/API 오류를 사람이 읽기 쉬운 문자열로 변환 */
export function getApiErrorDetail(error) {
  if (!error) return '알 수 없는 오류'

  const status = error.response?.status
  const apiMessage =
    error.response?.data?.message ||
    error.response?.data?.cod ||
    null

  if (status === 401) {
    return `HTTP 401 Invalid API key${apiMessage ? ` — ${apiMessage}` : ''} (키가 잘못됐거나 아직 활성화되지 않았을 수 있습니다)`
  }
  if (status === 404) {
    return `HTTP 404 Not Found${apiMessage ? ` — ${apiMessage}` : ''}`
  }
  if (status === 429) {
    return `HTTP 429 Too Many Requests — API 호출 한도 초과`
  }
  if (status) {
    return `HTTP ${status}${apiMessage ? ` — ${apiMessage}` : ''}`
  }
  if (error.code === 'ECONNABORTED') {
    return '요청 시간 초과 (timeout)'
  }
  if (error.message) {
    return error.message
  }
  return String(error)
}

const weatherApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

function mapCurrentWeather(meta, data) {
  return {
    id: meta.id,
    name: meta.name,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    wind: data.wind?.speed ?? 0,
    status: data.weather?.[0]?.description ?? '-',
    icon: data.weather?.[0]?.icon ?? null,
    observation: `OpenWeatherMap 실측 · ${data.weather?.[0]?.main ?? ''}`,
    countryCode: data.sys?.country ?? 'KR',
    lat: meta.lat,
    lon: meta.lon,
    updatedAt: data.dt ? new Date(data.dt * 1000).toLocaleString('ko-KR') : null,
  }
}

/** 1) Current Weather API — 도시 현재 날씨 */
export async function fetchCurrentWeather(meta) {
  const { data } = await weatherApi.get('/weather', {
    params: {
      lat: meta.lat,
      lon: meta.lon,
      appid: getApiKey(),
      units: 'metric',
      lang: 'kr',
    },
  })
  return mapCurrentWeather(meta, data)
}

/** 대시보드용: 등록된 도시 전체 현재 날씨 */
export async function fetchAllCurrentWeather() {
  if (!hasOpenWeatherKey()) {
    return { source: 'mock', list: [...mockList], error: null }
  }

  const errors = []
  let successCount = 0

  const results = await Promise.all(
    CITY_META.map(async (meta) => {
      try {
        const city = await fetchCurrentWeather(meta)
        successCount += 1
        return city
      } catch (error) {
        const detail = getApiErrorDetail(error)
        console.error(`${meta.name} 날씨 조회 실패:`, detail, error)
        errors.push(`${meta.name}: ${detail}`)
        const fallback = mockList.find((c) => c.id === meta.id)
        return fallback ?? null
      }
    }),
  )

  const allFailed = successCount === 0 && errors.length > 0

  return {
    source: allFailed ? 'mock' : 'openweather',
    list: results.filter(Boolean),
    error: errors.length
      ? {
          summary: allFailed
            ? 'OpenWeatherMap 호출 실패 → Mock으로 대체했습니다.'
            : `일부 도시(${errors.length}곳) 조회 실패 → 해당 도시는 Mock입니다.`,
          details: errors,
        }
      : null,
  }
}

/** 2) 5 Day / 3 Hour Forecast API — 추가 OpenWeatherMap API */
export async function fetchForecast(lat, lon) {
  if (!hasOpenWeatherKey()) return []

  const { data } = await weatherApi.get('/forecast', {
    params: {
      lat,
      lon,
      appid: getApiKey(),
      units: 'metric',
      lang: 'kr',
    },
  })

  const daily = []
  for (const item of data.list ?? []) {
    if (!item.dt_txt?.includes('12:00:00')) continue
    daily.push({
      time: item.dt_txt,
      temp: Math.round(item.main.temp),
      status: item.weather?.[0]?.description ?? '-',
      humidity: item.main.humidity,
      icon: item.weather?.[0]?.icon ?? null,
    })
    if (daily.length >= 5) break
  }
  return daily
}

/** 3) Air Pollution API — 추가 OpenWeatherMap API */
export async function fetchAirPollution(lat, lon) {
  if (!hasOpenWeatherKey()) return null

  const { data } = await weatherApi.get('/air_pollution', {
    params: {
      lat,
      lon,
      appid: getApiKey(),
    },
  })

  const aqi = data.list?.[0]?.main?.aqi
  const components = data.list?.[0]?.components ?? {}
  const labels = {
    1: '좋음',
    2: '보통',
    3: '민감군 나쁨',
    4: '나쁨',
    5: '매우 나쁨',
  }

  return {
    aqi,
    label: labels[aqi] ?? '-',
    pm2_5: components.pm2_5,
    pm10: components.pm10,
    o3: components.o3,
  }
}
