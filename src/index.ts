import { JsonApiMatchDataStore } from "./DataStore/MatchDataStore"

const jsonApiMatchDataStore = new JsonApiMatchDataStore()
jsonApiMatchDataStore.getCurrentMatches().then(response => {
  console.log(response)
})
