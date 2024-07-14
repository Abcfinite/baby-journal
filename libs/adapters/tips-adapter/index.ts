import _ from "lodash"
import { parse } from 'node-html-parser';
import S3ClientCustom from '@abcfinite/s3-client-custom'
import BetapiClient from "../../clients/betapi-client";
import { Prediction } from './src/types/prediction';

export default class TipsAdapter {
  async getTips() {
    const matchStatFile = await new S3ClientCustom().getFile('tennis-match-schedule-html', 'matchstat.html')

    let predictionCols: Array<Prediction> = []
    const matchStatHtml = parse(matchStatFile)
    const predictions = matchStatHtml.getElementsByTagName('div').filter(div => div.attributes.class === 'ms-prediction-table')

    predictions.forEach(pred => {
      const pTitle = pred.querySelector('.prediction-title a').getAttribute('href')
      const pName = pred.querySelector('.player-name-pt').text.trim();
      const pTimeStage = pred.querySelector('.prediction-time')
      const pTimeStageArray = pTimeStage.text.replaceAll(/\s/g,'').split('/')
      const aOdds = pred.querySelector('.odds-item.item-border')
      const predPercentage = pred.querySelector('.prediction-item.item-border')

      const linkSplitted = decodeURIComponent(pTitle).split('/')

      if  (pName.toLowerCase().includes('over')) {
        return
      }

      const prediction: Prediction = {
        date: pTimeStageArray[0],
        stage:  pTimeStageArray[1],
        player1: pName,
        player2: pName.toLowerCase() === linkSplitted[5].toLowerCase() ? linkSplitted[6] : linkSplitted[5],
        odds: ((Math.round(Number(aOdds.text.replaceAll(/\s/g,'')) * 100) / 100) - 1).toFixed(2),
        percentage: predPercentage.text.replaceAll(/\s/g,'').replaceAll(/\%/g,''),
      }

      if (!prediction.player1.includes('over')) {
        predictionCols.push(prediction)
      }
    })

    const events = await new BetapiClient().getEvents()

    predictionCols = predictionCols.map(p => {
      let e = events.find(e => e.player1.toLowerCase() === p.player1.toLowerCase() ||  e.player2.toLowerCase() === p.player1.toLowerCase())

      if (e !== undefined && e !== null) {
        p.date = new Date(Number(e.time) * 1000).toLocaleDateString()
        const localDateTime = new Date(Number(e.time) * 1000).toLocaleString('en-GB', {timeZone: 'Australia/Sydney'}).split(',')
        p.time = localDateTime[1]

        if (p.time !== null && p.time !== undefined ) {
          p.date = localDateTime[0]
        }
      }
      return p
    })

    return  predictionCols.map(p => {
      if (p.time != null) {
        return `${p.date},${p.time},${p.stage},${p.player1},${p.player2},${p.percentage},${p.odds}`
      }

      return `${p.date},00:00,${p.stage},${p.player1},${p.player2},${p.percentage},${p.odds}`
    }).join('\r\n')
    // return  [].map(p => `${p.time},${p.player1},${p.player2},${p.percentage},${p.odds}`).join('\r\n')
  }
}