const fs = require("fs");
const log = console.log;

const saveEpisodeInfo = info => {
  const dataJSON = JSON.stringify(info);
  fs.writeFileSync("episode.json", dataJSON);
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

module.exports = {
  getSavedEpisode,
  saveEpisodeInfo
};
