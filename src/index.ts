import "dotenv/config";

import { formTeamOverallData, getTeamNameAndHref } from "./team-data/mainpage";
import { formTeams } from "./player-data/teampage";
import { csvBool, jsonBool, saveData } from "./utils";

async function main() {
  const saveOptions = { csv: csvBool(), json: jsonBool() };
  const overallTeamInfo = await formTeamOverallData();
  await saveData(overallTeamInfo, "teamData", saveOptions);

  const nameAndHref = await getTeamNameAndHref();
  const allPlayerInfo = await formTeams(nameAndHref);
  console.log({ playerCount: allPlayerInfo.length });
  await saveData(allPlayerInfo, "playerData", saveOptions);
}

main();
