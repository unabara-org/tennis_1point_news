import { JsonApiMatchDataStore, createJsonApiMatchDataStore } from "./DataStore/MatchDataStore"

const jsonApiMatchDataStore = createJsonApiMatchDataStore()
jsonApiMatchDataStore
  .getUpdatedMatches(new Date())
  .then(response => {
    console.log(response)
  })
  .catch((err: Error) => {
    console.log(err)
  })
