import { HttpResponse } from './src/types/http-response';
import * as https from 'https';
import axios, { AxiosResponse } from 'axios'

export default class HttpApiClient {

  constructor() {}

  async get(
    baseUrl: string,
    path?: string,
    headers?: object,
    params: object = {},
  ):  Promise<HttpResponse> {
    let axiosResponse: AxiosResponse

    let response: HttpResponse = {
      value: null,
      status: null,
      statusText: null,
      hasValue: false,
      hasError: false,
      errorText: null,
    }

    try {
      let instance = axios.create()
      instance.defaults.timeout = 60000
      instance.defaults.signal = AbortSignal.timeout(60000),

      axiosResponse = await instance.get(
        baseUrl+path,
        { timeout: 60000, headers, params }
      )

      response.status = axiosResponse.status
      response.value = axiosResponse.data
      response.hasValue = axiosResponse.data !== undefined && axiosResponse.data !== null
    } catch (err) {
      console.error(err)
    }

    return response
  }
}