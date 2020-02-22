const fs = require("fs");
const nodemailer = require("nodemailer");
const log = console.log;

const saveEpisodeInfo = info => {
  const episodeJSON = JSON.stringify(info);
  fs.writeFileSync("episode.json", episodeJSON);
  log(`episodeInfo saved to file`);
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
