export const toQuery = (number: number): string => {
  switch (number) {
    case 0:
      return '= 0';
    case 1000:
      return '= 1000';
    case -1000:
      return '= -1000';
    default:
      return number < 0 ? '< 0' : '> 0';
  }
}

export const formatResult = (result: any): any => {
  const fp = result.rows.filter((row: any) => row['match_result'] === '1').length
  const nfp = result.rows.filter((row: any) => row['match_result'] === '-1').length
  const more = fp > nfp ? fp : nfp
  return `query-1 (${more}of${result.rowCount})`
}

export const prediction = (result: any): any => {
  const fp = result.rows.filter((row: any) => row['match_result'] === '1').length
  const nfp = result.rows.filter((row: any) => row['match_result'] === '-1').length
  return fp > nfp ? 1 : -1
}