import {
  HREF_LINK,
  INVALID_SCHOOL,
  MainPageType,
  MAINPAGE_ROUTE,
  SCHOOL_HREF_NAME_SELECTOR,
} from "./constant";
import { axiosInstance, cheerioInstance } from "./utils";

async function getMainPageHtml() {
  const { data } = await axiosInstance.get(MAINPAGE_ROUTE);

  if (!data) {
    throw new Error("unable to fetch main page html");
  }

  return data;
}

export async function getSchoolNameAndHref(): Promise<MainPageType[]> {
  const namesAndHrefs: MainPageType[] = [];
  const htmlData = await getMainPageHtml();
  const $ = cheerioInstance(htmlData);
  $(SCHOOL_HREF_NAME_SELECTOR).each((_id, el) => {
    const name = $(el).text();
    if (!name) {
      throw new Error("unable to get school name");
    }

    // Ignore school with all "-"
    if (INVALID_SCHOOL.has(name.trim())) {
      return;
    }

    const href = $(el).attr("href");
    if (!href) {
      throw new Error("unable to get school href");
    }
    namesAndHrefs.push({ name, href: HREF_LINK(href) });
  });
  return namesAndHrefs;
}
