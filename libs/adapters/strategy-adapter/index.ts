// steps
// 1. check all rows has winning percentage
// 2. remove DO NOT BET true
// 3. remove BM 1 v 1
// 4. remove BM 0 v 1 unless winning percentage below 1000

import S3ClientCustom from "@abcfinite/s3-client-custom";
import * as csv from 'fast-csv'
import { Readable } from 'stream'

export default class StrategyAdapter {
  constructor() {}

  async runIt() {
    await this.getStrategyResult()
  }

  async getStrategyResult() {
    const csvFile = await new S3ClientCustom().getFile('tennis-match-schedule', 'today.csv') as any
    const rows = []

    return new Promise((resolve, reject) => {
      Readable.from(csvFile)
      .pipe(csv.parse({ headers: true }))
      .on('error', error => reject(error))
      .on('data', row => this.dataReceived(row, rows))
      .on('end', _ => {
        resolve(this.strategyResult(rows))
      });
    })
  }

  async dataReceived(row, rows) {
    rows.push(row)
  }

  async strategyResult(rows) {

    console.log('>>>>strategy result')

  }
}