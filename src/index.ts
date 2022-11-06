import "dotenv/config";

import { getGamelog } from "./gamelog-data";
import { formTeams } from "./player-data";
import { formTeamOverallData, getTeamNameAndHref } from "./team-data";
import { csvBool, jsonBool, saveData } from "./utils";

async function main() {
  const saveOptions = { csv: csvBool(), json: jsonBool() };

  const nameAndTeamRoute = await getTeamNameAndHref();

  const [overallTeamInfo, allPlayerInfo, gamelogInfo] = await Promise.all([
    formTeamOverallData(),
    formTeams(nameAndTeamRoute),
    getGamelog(nameAndTeamRoute),
  ]);

  await Promise.all([
    saveData(overallTeamInfo, "teamData", saveOptions),
    saveData(allPlayerInfo, "playerData", saveOptions),
    saveData(gamelogInfo, "gamelogData", saveOptions),
  ]);

  console.log({
    teamInfoCount: overallTeamInfo.length,
    playerInfoCount: allPlayerInfo.length,
    gamelogCount: gamelogInfo.length,
  });
}

main();
