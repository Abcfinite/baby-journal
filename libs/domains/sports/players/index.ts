import BetapiClient from '@abcfinite/betapi-client'
import { Handler } from 'aws-lambda';

export const getPlayer: Handler = async (event: any) => {
  const { player1Id, player2Id } = event.queryStringParameters

  const player1Matches = await new BetapiClient().getPlayerEndedMatches(player1Id, '92')
  const player2Matches = await new BetapiClient().getPlayerEndedMatches(player2Id, '92')

  const responseText = `player 1 matches: ${player1Matches.length}, player 2 matches: ${player2Matches.length}`

  const h2h = player1Matches.filter(p1m => p1m.player1.id === player2Id || p1m.player2.id === player2Id).splice(0, 8)

  console.log('p1 name : ', player1Matches.find(p => p.player1.id === player1Id).player1.name)
  console.log('p2 name : ', player2Matches.find(p => p.player1.id === player2Id).player1.name)

  console.log('>>>h2h matches : ', h2h.length)
  console.log('p1 won : ', h2h.filter(h => h.player1won).length)

  console.log('>>>>>last h2h P1 won : ', h2h[0].player1won)

  const player1Last8 = player1Matches.slice(0, 8)
  const player2Last8 = player2Matches.slice(0, 8)

  console.log('>>>>>>>BM')
  const player1matchesP1ids = player1Last8.map(p1l8 => p1l8.player1.id)
  const player1matchesP2ids = player1Last8.map(p1l8 => p1l8.player2.id)
  const player2matchesP1ids = player2Last8.map(p1l8 => p1l8.player1.id)
  const player2matchesP2ids = player2Last8.map(p1l8 => p1l8.player2.id)

  const uniquePlayerIds1 = player1matchesP1ids.concat(player1matchesP2ids).filter((e, i, self) => i === self.indexOf(e))
  const uniquePlayerIds2 = player2matchesP1ids.concat(player2matchesP2ids).filter((e, i, self) => i === self.indexOf(e))

  const bmPlayerIds = uniquePlayerIds1.filter(
    (element) => uniquePlayerIds2.includes(element))

  const bmPlayerIdsClean = bmPlayerIds.filter(arrayItem => arrayItem !== player1Id)
    .filter(arrayItem => arrayItem !== player2Id)

  console.log(bmPlayerIdsClean)
  console.log('>>>>>P1 BM :')
  console.log(player1Last8.filter(p1l8 => (bmPlayerIdsClean.includes(p1l8.player1.id) && !p1l8.player1won) || (bmPlayerIdsClean.includes(p1l8.player2.id) && p1l8.player1won)).length)
  console.log('>>>>>P2 BM :')
  console.log(player2Last8.filter(p2l8 => (bmPlayerIdsClean.includes(p2l8.player1.id) && !p2l8.player1won) || (bmPlayerIdsClean.includes(p2l8.player2.id) && p2l8.player1won)).length)


  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: responseText,
        input: event,
      },
      null,
      2
    ),
  };

  return new Promise((resolve) => {
    resolve(response)
  })
}

