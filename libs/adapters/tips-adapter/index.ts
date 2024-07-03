import _ from "lodash"
import { parse } from 'node-html-parser';
import S3ClientCustom from '@abcfinite/s3-client-custom'
import BetapiClient from "../../clients/betapi-client";
import { Prediction } from './src/types/prediction';

export default class TipsAdapter {
  async getTips() {
    const matchStatFile = await new S3ClientCustom().getFile('tennis-matchstat', 'matchstat.html')

    const predictionCols: Array<Prediction> = []
    const matchStatHtml = parse(matchStatFile)
    const predictions = matchStatHtml.getElementsByTagName('div').filter(div => div.attributes.class === 'ms-prediction-table')

    predictions.forEach(pred => {
      const pTime = pred.querySelector('.prediction-time');
      const pName = pred.querySelector('.player-name-pt');
      const aOdds = pred.querySelector('.odds-item.item-border');
      const predPercentage = pred.querySelector('.prediction-item.item-border');

      const prediction: Prediction = {
        time: pTime.text.replaceAll(/\s/g,'').split('/')[0],
        player1: pName.text.trim(),
        odds: ((Math.round(Number(aOdds.text.replaceAll(/\s/g,'')) * 100) / 100) - 1).toFixed(2),
        percentage: predPercentage.text.replaceAll(/\s/g,'').replaceAll(/\%/g,''),
      }

      if (!prediction.player1.includes('over')) {
        predictionCols.push(prediction)
      }
    })

    const events = await new BetapiClient().getEvents()

    console.log('>>>events')
    console.log(events.length)

    return  predictionCols.map(p => `${p.time},${p.player1},${p.percentage},${p.odds}`).join('\r\n')
  }
}