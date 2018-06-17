import { getQueryParams, mapToScore } from "./MatchDataStore"

test("getQueryParams", () => {
  const date1 = new Date(2018, 5, 17) // Unix Time は 1529161200
  const date2 = new Date(2019, 5, 17) // Unix Time は 1560697200

  expect(getQueryParams(date1)).toEqual({
    _: "152916120",
  })

  expect(getQueryParams(date2)).toEqual({
    _: "156069720",
  })
})

test("mapToScore", () => {
  const responseScore1 = {
    current: 1,
    point: 30,
    period1: 3,
    period2: 6,
    period3: 4,
  }

  const responseScore2 = {
    current: 0,
    point: 0,
    period1: 1,
  }

  expect(mapToScore(responseScore1)).toEqual({
    winnerSet: 1,
    game: [3, 6, 4],
    point: 30,
  })

  expect(mapToScore(responseScore2)).toEqual({
    winnerSet: 0,
    game: [1],
    point: 0,
  })
})
