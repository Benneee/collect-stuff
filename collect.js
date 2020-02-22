const puppeteer = require("puppeteer");
const { getSavedEpisode, saveEpisodeInfo } = require("./saveAndEmail");
const nodemailer = require("nodemailer");

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

  //   Write to file
  episodeInfo = { episodeTitle, episodeLink };
  saveEpisodeInfo(episodeInfo);

  browser.close();
}

collectEpisodeInfo(`https://o2tvseries.com/${episode1}/Season-05/index.html`)
  .then(() => {
    const episode = getSavedEpisode();
    const { episodeTitle, episodeLink } = episode;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAILPASSWORD
      }
    });

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
        log("info: ", info);
      }
    });
  })
  .catch(err => {
    log(err);
  });

/**
 * ToDos
 * Create an array of various shows
 * Check that they have the same markup to ensure scraping method can just collect array values as parameters
 * Create the cron job
 * Deploy the script
 */
