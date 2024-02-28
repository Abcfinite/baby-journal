export const dobToAge = (stringDate: string) => {
  const dateComp = stringDate.split('.')
  const dob = new Date(Date.parse(`${dateComp[1]}/${dateComp[0]}/${dateComp[2]} 11:11:11`)).getTime()

  var cur = new Date().getTime()

  var diff =  cur - dob
  var age = Math.round(diff/31557600000)
  return age
}