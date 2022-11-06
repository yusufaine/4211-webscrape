import { getSchoolNameAndHref } from "./mainpage";
import { formTeams } from "./schoolpage";
import { saveData } from "./utils";

async function main() {
  const nameAndHref = await getSchoolNameAndHref();
  const allPlayerInfo = await formTeams(nameAndHref);
  console.log(allPlayerInfo.length);
  await saveData(allPlayerInfo, true, true);
}

main();
