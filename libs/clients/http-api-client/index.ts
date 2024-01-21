import { HttpResponse } from './src/types/http-response';
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

    axiosResponse = await axios.get(baseUrl+path,{ headers, params })


    return response
  }
}