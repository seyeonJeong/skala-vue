import axios from 'axios'

/**
 * 기타 외부 API 1: Open-Meteo Geocoding
 * - API Key 불필요
 * - 도시 인구/타임존/좌표 보강
 */
export async function fetchCityGeo(cityName) {
  if (!cityName) return null

  try {
    const { data } = await axios.get(
      'https://geocoding-api.open-meteo.com/v1/search',
      {
        params: {
          name: cityName,
          count: 1,
          language: 'ko',
          format: 'json',
        },
        timeout: 8000,
      },
    )

    const place = data.results?.[0]
    if (!place) return null

    return {
      name: place.name,
      country: place.country,
      countryCode: place.country_code,
      timezone: place.timezone,
      population: place.population ?? null,
      latitude: place.latitude,
      longitude: place.longitude,
      elevation: place.elevation ?? null,
    }
  } catch (error) {
    console.error('Open-Meteo Geocoding 실패', error)
    return null
  }
}

/**
 * 기타 외부 API 2: Wikipedia REST Summary
 * - API Key 불필요
 * - 도시 소개 문구/썸네일
 */
export async function fetchCityWikipedia(cityName) {
  if (!cityName) return null

  try {
    const title = encodeURIComponent(cityName)
    const { data } = await axios.get(
      `https://ko.wikipedia.org/api/rest_v1/page/summary/${title}`,
      {
        timeout: 8000,
        headers: {
          Accept: 'application/json',
        },
      },
    )

    return {
      title: data.title ?? cityName,
      extract: data.extract ?? '',
      thumbnail: data.thumbnail?.source ?? null,
      url: data.content_urls?.desktop?.page ?? null,
    }
  } catch (error) {
    console.error('Wikipedia 조회 실패', error)
    return null
  }
}
