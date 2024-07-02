import _ from "lodash"
import { parse } from 'node-html-parser';
import S3ClientCustom from '@abcfinite/s3-client-custom'

export default class TipsAdapter {
  async getTips() {
    const matchStatFile = await new S3ClientCustom().getFile('tennis-matchstat', 'matchstat.html')

    const matchStatHtml = parse(matchStatFile)
    const predictions = matchStatHtml.getElementsByTagName("div").filter(div => div.attributes.class === "prediction-table-container")

    console.log('>>>>>predictions>>>', predictions.length)

    return  'success'


  }
}