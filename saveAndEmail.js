const fs = require("fs");
const log = console.log;

const saveEpisodeInfo = info => {
  const episodeJSON = JSON.stringify(info);
  fs.writeFileSync("episode.json", episodeJSON);
  log(`episodeInfo saved to file`);
};

module.exports = {
  saveEpisodeInfo
};
