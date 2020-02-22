const puppeteer = require("puppeteer");
const {
  getSavedEpisode,
  saveEpisodeInfo,
  transporter
} = require("./saveAndEmail");
const log = console.log;
const episode1 = "Chicago-Med-8";
const seriesName = "Chicago Med";
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

collectEpisodeInfo(`https://o2tvseries.com/${episode1}/Season-05/index.html`)
  .then(() => {
    const episode = getSavedEpisode();
    // log("data: ", episode);
    const { episodeTitle, episodeLink } = episode;
    let mailOptions = {
      from: process.env.MAIL,
      to: "benedictiknkeonye@gmail.com",
      subject: `New ${episode1} has just been released`,
      html: `<p>Hiya champ! There's a new episode of ${seriesName}.</p> <br />
      Download ${episodeTitle} <a href=${episodeLink}>here</a>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        log("error: ", error);
      } else {
        log("sent: ", info);
      }
    });
  })
  .catch(err => {
    log(err);
  });

/**
 * ToDos
 * Write the results of the scraping to a file in this directory
 * Whenever the code is run, check for differences between the latest search and the saved episodeTitle
 * If there's a difference, send a mail to me to say there is a new episode of "Chicago Med"
 * Bring in other urls to check for updates regularly
 */
