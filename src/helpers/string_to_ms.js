import stringToMs from 'ms'

const generousStringToMs = (str: string): number => {
  const minutes = +str

  if (!isNaN(minutes)) {
    return minutes * 60000
  }

  return stringToMs(str)
}

export default generousStringToMs
