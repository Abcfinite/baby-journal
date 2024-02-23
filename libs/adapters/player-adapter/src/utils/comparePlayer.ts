import { Player } from "@abcfinite/tennislive-client/src/types/player";

export const getHigherRanking = (player1: Player, player2: Player) : string => {
  if (player1.currentRanking === 0 && player2.currentRanking > 0) {
    return player2.name
  } else if (player1.currentRanking > 0 && player2.currentRanking === 0) {
    return player1.name
  } else {
    if (player1.currentRanking > player2.currentRanking) {
      return player2.name
    } else if (player2.currentRanking > player1.currentRanking) {
      return player1.name
    }
  }

  return 'both player no ranking'
}


export const getRankingDiff = (player1: Player, player2: Player) : number =>
  Math.abs(player1.currentRanking - player2.currentRanking)

export const winPercentage = (player1: Player, player2: Player) : any => {
  const player1winPercentage = ( player1.matchesWon / player1.matchesTotal ) * 100
  const player2winPercentage = ( player2.matchesWon / player2.matchesTotal ) * 100
  return {
    player1: player1.name + ' => ' + player1winPercentage+ '%',
    player2: player2.name + ' => ' + player2winPercentage+ '%',
    diff: Math.abs(player1winPercentage - player2winPercentage) + '%'
  }
}

export const wonL20 = (player1: Player, player2: Player) : any => {
  const p1w = player1.parsedPreviousMatches.filter(m => m.result === 'win')
  const p2w = player2.parsedPreviousMatches.filter(m => m.result === 'win')
  return {
    player1: player1.name + ' => ' + p1w.length,
    player2: player2.name + ' => ' + p2w.length
  }
}

export const beatenByLowerRanking = (player1: Player, player2: Player) : any => {
  const p1L = player1.parsedPreviousMatches.filter(m => m.result === 'lost')
  const p2L = player2.parsedPreviousMatches.filter(m => m.result === 'lost')
  const p1LLower = player1.currentRanking === 1000 ? [] : p1L.filter(p => p.player.currentRanking > player1.currentRanking)
  const p2LLower = player2.currentRanking === 1000 ? [] : p2L.filter(p => p.player.currentRanking > player2.currentRanking)
  return {
    player1: player1.name + ' => ' + p1LLower.length,
    player2: player2.name + ' => ' + p2LLower.length
  }
}

export const beatenByLowerRankingThanOpponent = (player1: Player, player2: Player) : any => {
  const p1L = player1.parsedPreviousMatches.filter(m => m.result === 'lost')
  const p2L = player2.parsedPreviousMatches.filter(m => m.result === 'lost')
  const p1LLower = player1.currentRanking === 1000 ? [] : p1L.filter(p => p.player.currentRanking > player2.currentRanking)
  const p2LLower = player2.currentRanking === 1000 ? [] : p2L.filter(p => p.player.currentRanking > player1.currentRanking)
  return {
    player1: player1.name + ' => ' + p1LLower.length,
    player2: player2.name + ' => ' + p2LLower.length
  }
}

export const winFromHigherRankingThanOpponent = (player1: Player, player2: Player) : any => {
  const m1W = player1.parsedPreviousMatches.filter(m => m.result === 'win')
  const m2W = player2.parsedPreviousMatches.filter(m => m.result === 'win')
  const mp1WHigher = m1W.filter(m => m.player.currentRanking < player2.currentRanking)
  const mp2WHigher = m2W.filter(m => m.player.currentRanking < player1.currentRanking)

  const mp1WHindex = []
  player1.parsedPreviousMatches.forEach((pm, index) => {
    if (mp1WHigher.map(m => m.date).includes(pm.date)) {
      mp1WHindex.push(index)
    }
  })

  const mp2WHindex = []
  player2.parsedPreviousMatches.forEach((pm, index) => {
    if (mp2WHigher.map(m => m.date).includes(pm.date)) {
      mp2WHindex.push(index)
    }
  })

  return {
    player1: {
      name: player1.name,
      number: mp1WHigher.length,
      order: mp1WHindex
    },
    player2: {
      name: player2.name,
      number: mp2WHigher.length,
      order: mp2WHindex
    },
  }
}