import { createMatchRepository } from "../Repository/MatchRepository"
import { createPostedMatchRepository } from "../Repository/PostedMatchRepository"
import { createMatchImageRepository } from "../Repository/MatchImageRepository"

export const executeCleanUpPostedMatchData = async (): Promise<void> => {
  const matchImageRepository = createMatchImageRepository()
  const jsonApiMatchDataStore = createMatchRepository()
  const liveMatches = await jsonApiMatchDataStore.getInProgressOrFinishedMatches(new Date())

  const postedMatchRepository = createPostedMatchRepository()
  const postedMatches = await postedMatchRepository.findAllPostedMatches()

  for (const postedMatch of postedMatches) {
    const isFinishedMatch = liveMatches.every(liveMatch => {
      return liveMatch.id !== postedMatch.matchId
    })

    if (isFinishedMatch) {
      await postedMatchRepository.deleteByPostedMatch(postedMatch)
      await matchImageRepository.deleteByMatchId(postedMatch.matchId)
    }
  }
}
