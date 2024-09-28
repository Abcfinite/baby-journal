import { HttpResponse } from './src/types/http-response';
import axios, { AxiosResponse } from 'axios'
import { https } from 'follow-redirects';
import { IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';

export default class HttpApiClient {

  constructor() {}

  async getNative(
    path: string
  ): Promise<HttpResponse> {

    var options = {
      'method': 'GET',
      'hostname': 'www.tennislive.net',
      'path': encodeURI(path),
      'headers': {
        'Host': 'www.tennislive.net',
        'Referer': 'https://www.tennislive.net',
        'Cookie': uuidv4()
      },
      'maxRedirects': 20
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res: IncomingMessage) => {
        let data = '';

        // A chunk of data has been received.
        res.on('data', (chunk: Buffer) => {
          data += chunk.toString();
        });

        // The whole response has been received.
        res.on('end', () => {
          const response: HttpResponse = {
            status: res.statusCode,
            value: data,
            statusText: '',
            hasValue: false,
            errorText: '',
            hasError: false
          };
          resolve(response);   // Resolve the promise with the full response data
        });
      });

      // Handle any potential errors
      req.on('error', (error: Error) => {
        reject(error);  // Reject the promise if an error occurs
      });

      // End the request
      req.end();
    });
  }

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


    const agent = new https.Agent({
      rejectUnauthorized: false
    });

    try {
      let instance = axios.create()
      instance.defaults.timeout = 60000
      instance.defaults.signal = AbortSignal.timeout(60000),

      axiosResponse = await instance.get(
        baseUrl+path,
        { httpsAgent: agent, timeout: 60000, headers, params }
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