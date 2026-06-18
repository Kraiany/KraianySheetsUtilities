/** Convert western calendar year to Japanese era 
 * 3 eras: showa, heisei, reiwa
 * @param {number} year - Wester year number
 * @param {string} output - type of output, Can be: `era` for Era name only (平成, 昭和, 令和), `number` - only year number in era. If empty - returns full year (昭和37年)
 * @return {string} Japanese era year, Returns NaN for year == 0 or year == 1899 (empty)
 * @customFunction
*/
function JAPANESE_YEAR(year,output) {
  const heisei = "平成"
  const showa = '昭和'
  const reiwa = '令和'
  let era
  let number

  if(year === 1899 || year === "") { return "NaN"}
  if(year<1926) {return "Before Showa"}
  if(year<1989) {
    era = showa
    number = year-1925
  } else if (year < 2019) {
    era = heisei
    number = year-1988
  } else {
    era = reiwa
    number = year-2018
  }

  switch (output) {
    case 'era':
      return era
    case 'number':
      return number
    default:
      return `${era} ${number}年`
  }
}