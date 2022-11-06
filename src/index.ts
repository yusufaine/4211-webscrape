import "dotenv/config";

import { getSchoolNameAndHref } from "./mainpage";
import { formTeams } from "./schoolpage";
import { csvBool, jsonBool, saveData } from "./utils";

async function main() {
  const nameAndHref = await getSchoolNameAndHref();
  const allPlayerInfo = await formTeams(nameAndHref);
  console.log({ playerCount: allPlayerInfo.length });
  await saveData(allPlayerInfo, csvBool(), jsonBool());
}

main();
