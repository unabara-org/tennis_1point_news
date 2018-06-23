import { JsonApiMatchDataStore, createJsonApiMatchDataStore } from "./DataStore/MatchDataStore"
import { SlackApiPostMatchService } from "./Service/SlackApiService";

const jsonApiMatchDataStore = createJsonApiMatchDataStore()
jsonApiMatchDataStore
  .getUpdatedMatches(new Date())
  .then(matches => {
    console.log(matches)
    const slackApiPostMatchService = new SlackApiPostMatchService();
    matches.forEach(match => {
      slackApiPostMatchService.execute(match);
    })
  })
  .catch((err: Error) => {
    console.log(err)
  })
