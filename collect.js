const puppeteer = require("puppeteer");
const { saveEpisodeInfo } = require("./saveAndEmail");
const log = console.log;

let episodeInfo = {};

async function collectEpisodeInfo(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const [el2] = await page.$x("/html/body/div[1]/div[12]/div[1]/a");
  const txt = await el2.getProperty("textContent");
  const episodeTitle = await txt.jsonValue();

  const [el] = await page.$x("/html/body/div[1]/div[12]/div[1]/a");
  const href = await el.getProperty("href");
  const episodeLink = await href.jsonValue();

  episodeInfo = { episodeTitle, episodeLink };

  //   Write to file
  saveEpisodeInfo(episodeInfo);

  //   log(episodeInfo);
  browser.close();
}

collectEpisodeInfo("https://o2tvseries.com/Chicago-Med-8/Season-05/index.html");

/**
 * ToDos
 * Write the results of the scraping to a file in this directory
 * Whenever the code is run, check for differences between the latest search and the saved episodeTitle
 * If there's a difference, send a mail to me to say there is a new episode of "Chicago Med"
 * Bring in other urls to check for updates regularly
 */
