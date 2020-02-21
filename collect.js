const puppeteer = require("puppeteer");
const {
  addNewEpisode,
  getAllEpisodes,
  sendDownloadLinkEmail
} = require("./saveAndEmail");
const faveSeries = ["Chicago-Med-8"];
const cron = require("node-cron");
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

  //   Write to file
  episodeInfo = { episodeTitle, episodeLink };
  addNewEpisode(episodeInfo);

  browser.close();
}

collectEpisodeInfo(
  `https://o2tvseries.com/${faveSeries[0]}/Season-05/index.html`
);

const episodes = getAllEpisodes();

if (episodes !== null) {
  const { episodeTitle, episodeLink } = episodes[0];

  try {
    sendDownloadLinkEmail("Chicago Med", episodeTitle, episodeLink);
    log("Mail sent!");
  } catch (error) {
    log(error);
  }
} else {
  log("episodes is null");
}

/**
 * ToDos
 * Write the results of the scraping to a file in this directory
 * Whenever the code is run, check for differences between the latest search and the saved episodeTitle
 * If there's a difference, send a mail to me to say there is a new episode of "Chicago Med"
 * Bring in other urls to check for updates regularly
 *
 * API KEY for sendgrid not being seen
 */
