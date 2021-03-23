export function randomInt (a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a
}

export function pickRandom(arr){
  return arr[randomInt(0,arr.length-1)]
}
