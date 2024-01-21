import { HttpResponse } from './src/types/http-response';
import axios, { AxiosResponse } from 'axios'

export default class HttpApiClient {

  constructor() {}

  async get(
    baseUrl: string,
    path?: string,
    accessToken?: string,
    header?: object,
    query: object = {},
  ):  Promise<HttpResponse> {

    let response: HttpResponse = {
      value: null,
      status: null,
      statusText: null,
      hasValue: false,
      hasError: false,
      errorText: null,
    }


    return response
  }
}