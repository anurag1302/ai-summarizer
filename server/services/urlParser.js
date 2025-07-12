const axios = require("axios");
const cheerio = require("cheerio");

async function fetchAndCleanURL(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const articleText = $("p").text(); // Basic content extraction
  return articleText.replace(/\s+/g, " ").trim();
}

module.exports = { fetchAndCleanURL };
