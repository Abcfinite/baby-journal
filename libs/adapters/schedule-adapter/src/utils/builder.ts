export const toCsv = (jsonString: string) : string => {
  const csvHeader = [
    'id',
    'date',
    'time',
    'stage',
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
    'just won fin',
    'f just Lost From Lower Ranking',
    'highest level last 3 comp',
    'f match total',

    'f win%',
    'highest win ranking current comp',
    'fav form',
    'non fav p',
    'nf just Lost From Lower Ranking',
    'nf match total',

    'nf win%',
    'non fav form',
    'form gap',
    'f c ranking',
    'nf c ranking',

    'nf h ranking',
    'ranking gap',
    'fav WL score',
    'non fav WL score',
    'WL score gap',

    'last won gap',
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
      fav1? m['lostToLowerRankingThanOpponent']['player1']['number']: m['lostToLowerRankingThanOpponent']['player2']['number'],

      fav1? m['winFromHigherRankingThanOpponent']['player1']['number']: m['winFromHigherRankingThanOpponent']['player2']['number'],
      fav1? m['lostToLowerRankingThanOpponent']['player2']['number']: m['lostToLowerRankingThanOpponent']['player1']['number'],
      fav1? m['winFromHigherRankingThanOpponent']['player2']['number']: m['winFromHigherRankingThanOpponent']['player1']['number'],
      fav1? m['winfromHigherRanking']['player1'] : m['winfromHigherRanking']['player2'],
      fav1? m['winfromHigherRanking']['player2'] : m['winfromHigherRanking']['player1'],
      fav1? m['lostToLowerRanking']['player1'] : m['lostToLowerRanking']['player2'],
      fav1? m['lostToLowerRanking']['player2'] : m['lostToLowerRanking']['player1'],
      '',
      '', // f match-no lower

      '',
      '',
      fav1? m['analysis']['win3setRate']['player1'] : m['analysis']['win3setRate']['player2'],
      fav1? m['analysis']['win3setRate']['player2'] : m['analysis']['win3setRate']['player1'],
      fav1? m['analysis']['benchmarkPlayer']['bothPlayed']['player1Score'] : m['analysis']['benchmarkPlayer']['bothPlayed']['player2Score'],

      fav1? m['analysis']['benchmarkPlayer']['bothPlayed']['player2Score'] : m['analysis']['benchmarkPlayer']['bothPlayed']['player1Score'],
      '',
      fav1? m['player1']['name'] : m['player2']['name'],
      '', // just won fin
      fav1? m['redFlag']['justLostFromLowerRanking']['player1'] : m['redFlag']['justLostFromLowerRanking']['player2'], // f just Lost From Lower Ranking
      '',
      fav1? m['winPercentage']['player1']['matchTotal'] : m['winPercentage']['player2']['matchTotal'],

      fav1? m['winPercentage']['player1']['winPercentage'] : m['winPercentage']['player2']['winPercentage'],
      '',
      '',
      fav1? m['player2']['name'] : m['player1']['name'],
      fav1? m['redFlag']['justLostFromLowerRanking']['player2'] : m['redFlag']['justLostFromLowerRanking']['player1'], // nf just Lost From Lower Ranking
      fav1? m['winPercentage']['player2']['matchTotal'] : m['winPercentage']['player1']['matchTotal'],

      fav1? m['winPercentage']['player2']['winPercentage'] : m['winPercentage']['player1']['winPercentage'],
      '',
      '',
      fav1? m['player1']['currentRanking'] : m['player2']['currentRanking'],
      fav1? m['player2']['currentRanking'] : m['player1']['currentRanking'],

      fav1? m['player2']['highestRanking'] : m['player1']['highestRanking'],
      '',
      fav1? m['analysis']['winLoseRanking']['player1'] : m['analysis']['winLoseRanking']['player2'],
      fav1? m['analysis']['winLoseRanking']['player2'] : m['analysis']['winLoseRanking']['player1'],
      '',

      m['analysis']['gap'],
      ''
    ].join(','))
  })

  return resultArray.join('\r\n')
}