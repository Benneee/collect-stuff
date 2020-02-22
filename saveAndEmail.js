const fs = require("fs");
const nodemailer = require("nodemailer");
const log = console.log;
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const addNewEpisode = ({ episodeLink, episodeTitle }) => {
  //  Get all existing episodes first
  const episodes = loadEpisodes();

  const duplicateEpisode = episodes.find(
    episode => episode.episodeTitle === episodeTitle
  );

  if (!duplicateEpisode) {
    episodes.push({
      episodeLink,
      episodeTitle
    });
    saveEpisodeInfo(episodes);
    log(`episodeInfo saved to file`);
  } else {
    log("episode saved previously!");
  }
};

const getAllEpisodes = () => {
  const episodes = loadEpisodes();
  return episodes;
};

const loadEpisodes = () => {
  try {
    const episodeBuffer = fs.readFileSync("episodes.json");
    const episodeJSON = episodeBuffer.toString();
    return JSON.parse(episodeJSON);
  } catch (e) {
    return [];
  }
};

const saveEpisodeInfo = info => {
  const dataJSON = JSON.stringify(info);
  fs.writeFileSync("episodes.json", dataJSON);
};

// episode info object will be passed in and destructured from here
const sendDownloadLinkEmail = (seriesName, episodeTitle, episodeLink) => {
  sgMail.send({
    to: "benedictiknkeonye@gmail.com",
    from: "ikcyprian@ymail.com",
    subject: `New ${seriesName} episode has just been released!`,
    html: `<p>Hiya champ! There's a new episode of ${seriesName}.</p> <br />
          Download ${episodeTitle} <a href=${episodeLink}>here</a>`
  });
};

const getSavedEpisode = () => {
  const episode = loadEpisode();
  return episode;
};

const loadEpisode = () => {
  try {
    const episodeBuffer = fs.readFileSync("episode.json");
    const episodeJSON = episodeBuffer.toString();
    return JSON.parse(episodeJSON);
  } catch (e) {
    return {};
  }
};

const transporter = nodemailer.createTransport({
  service: "yahoomail",
  auth: {
    user: process.env.MAIL,
    password: process.env.MAILPASSWORD
  }
});

module.exports = {
  getSavedEpisode,
  saveEpisodeInfo,
  transporter
};
