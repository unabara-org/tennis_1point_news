export function zeroPad(num: string, length: number): string {
  return ('00000000000000000000000' + num).slice(-length)
}