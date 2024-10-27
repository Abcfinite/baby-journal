import _ from "lodash"

export const toCsv = (jsonString: string) : string => {
  const csvHeader = [
    'id',
    'date',
    'time',
    'stage',
    'f h2h',
    'nf h2h',
    'f lostToLowerRankingThanOpponent',

    'f winFromHigherRankingThanOpponent',
    'nf lostToLowerRankingThanOpponent',
    'nf winFromHigherRankingThanOpponent',
    'f winFromHigherRanking',
    'nf winFromHigherRanking',
    'f lostFromHigherRanking',
    'nf lostFromHigherRanking',
    'f higher win%',
    'f match-no lower',

    'nf has less than half match no f',
    'f 3set% bigger',
    'f 3set win%',
    'nf 3set win%',
    'fav BM',

    'non fav BM',
    'BM gap',
    'fav p',
    'just retired',
    'just won fin',
    'f just Lost From Lower Ranking',
    'highest stage last 3 comp',
    'f match total',

    'f win%',
    'highest win ranking current comp',
    'fav form',
    'non fav p',
    'nf just Lost From Lower Ranking',
    'highest stage last 3 comp',
    'nf match total',

    'nf win%',
    'highest win ranking current comp',
    'non fav form',
    'form gap',
    'f c ranking',
    'f win highest',
    'f lost lowest',
    'nf c ranking',

    'nf h ranking',
    'nf win highest',
    'nf lost lowest',
    'f lost lowest below nf c ranking',
    'nf win highest on top of f c ranking',
    'ranking gap',
    'fav WL score',
    'non fav WL score',
    'WL score gap',

    'r',
  ].join(',')

  var resultArray = [csvHeader]

  var jsonArray = JSON.parse(jsonString)

  jsonArray.forEach(m => {
    var fav1 = m['player1']['currentRanking'] < m['player2']['currentRanking']

    resultArray.push([
      '',
      m['date'],
      m['time'],
      m['stage'],
      '',
      '',
      fav1? _.get(m, "['lostToLowerRankingThanOpponent']['player1']['number']", 'not found') :
        _.get(m, "['lostToLowerRankingThanOpponent']['player2']['number']", 'not found'),

      fav1? _.get(m, "['winFromHigherRankingThanOpponent']['player1']['number']", 'not found'):
        _.get(m, "['winFromHigherRankingThanOpponent']['player2']['number']", 'not found'),
      fav1? _.get(m, "['lostToLowerRankingThanOpponent']['player2']['number']", 'not found'):
        _.get(m, "['lostToLowerRankingThanOpponent']['player1']['number']", 'not found'),
      fav1? _.get(m, "['winFromHigherRankingThanOpponent']['player2']['number']", 'not found'):
        _.get(m, "['winFromHigherRankingThanOpponent']['player1']['number']", 'not found'),
      fav1? _.get(m, "['winfromHigherRanking']['player1']['number']" , 'not found'):
        _.get(m, "['winfromHigherRanking']['player2']['number']" , 'not found'),
      fav1? _.get(m, "['winfromHigherRanking']['player2']['number']", 'not found') :
        _.get(m, "['winfromHigherRanking']['player1']['number']", 'not found'),
      fav1? _.get(m, "['lostToLowerRanking']['player1']['number']", 'not found') :
       _.get(m, "['lostToLowerRanking']['player2']['number']", 'not found'),
      fav1? _.get(m, "['lostToLowerRanking']['player2']['number']", 'not found') :
        _.get(m, "['lostToLowerRanking']['player1']['number']", 'not found'),
      '',
      '', // f match-no lower

      '',
      '',
      fav1? _.get(m, "['analysis']['win3setRate']['player1']", 'not found') :
        _.get(m, "['analysis']['win3setRate']['player2']", 'not found')
      ,
      fav1? _.get(m, "['analysis']['win3setRate']['player2']", 'not found') :
        _.get(m, "['analysis']['win3setRate']['player1']", 'not found')
      ,
      fav1? _.get(m, "['analysis']['benchmarkPlayer']['bothPlayed']['player1Score']", 'not found') :
        _.get(m, "['analysis']['benchmarkPlayer']['bothPlayed']['player2Score']", 'not found'),

      // fav1? m['analysis']['benchmarkPlayer']['bothPlayed']['player2Score'] : m['analysis']['benchmarkPlayer']['bothPlayed']['player1Score'],
      // '',
      // fav1? m['player1']['name'] : m['player2']['name'],
      // '',
      // '', // just won fin
      // fav1? m['analysis']['redFlag']['justLostFromLowerRanking']['player1'] : m['analysis']['redFlag']['justLostFromLowerRanking']['player2'], // f just Lost From Lower Ranking
      // '',
      // fav1? m['winPercentage']['player1']['matchTotal'] : m['winPercentage']['player2']['matchTotal'],

      // fav1? m['winPercentage']['player1']['winPercentage'] : m['winPercentage']['player2']['winPercentage'],
      // '',
      // '',
      // fav1? m['player2']['name'] : m['player1']['name'],
      // fav1? m['analysis']['redFlag']['justLostFromLowerRanking']['player2'] : m['analysis']['redFlag']['justLostFromLowerRanking']['player1'], // nf just Lost From Lower Ranking
      // '',
      // fav1? m['winPercentage']['player2']['matchTotal'] : m['winPercentage']['player1']['matchTotal'],

      // fav1? m['winPercentage']['player2']['winPercentage'] : m['winPercentage']['player1']['winPercentage'],
      // '',
      // '',
      // '',
      // fav1? m['player1']['currentRanking'] : m['player2']['currentRanking'], // f c ranking
      // fav1? m['analysis']['highLowRanking']['player1']['winHighest'] : m['analysis']['highLowRanking']['player2']['winHighest'],
      // fav1? m['analysis']['highLowRanking']['player1']['lostLowest'] : m['analysis']['highLowRanking']['player2']['lostLowest'],
      // fav1? m['player2']['currentRanking'] : m['player1']['currentRanking'], // nf c ranking

      // fav1? m['player2']['highestRanking'] : m['player1']['highestRanking'],
      // fav1? m['analysis']['highLowRanking']['player2']['winHighest'] : m['analysis']['highLowRanking']['player1']['winHighest'],
      // fav1? m['analysis']['highLowRanking']['player2']['lostLowest'] : m['analysis']['highLowRanking']['player1']['lostLowest'],
      // '',
      // '',
      // '',
      // fav1? m['analysis']['winLoseRanking']['player1'] : m['analysis']['winLoseRanking']['player2'],
      // fav1? m['analysis']['winLoseRanking']['player2'] : m['analysis']['winLoseRanking']['player1'],
      // '',

      // ''
    ].join(','))
  })

  return resultArray.join('\r\n')
}