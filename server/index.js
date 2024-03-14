// server/index.js
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

app.get('/scrape', async (req, res) => {
  console.log('Scraping data...')
  const startTime = Date.now();
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://worldle.teuteuf.fr/');

  const el = await page.$('.text-green-600');
  const text = await el.getProperty('textContent');
  const rawText = await text.jsonValue();
  console.log('Browser clossing', rawText);
  await browser.close();
  console.log('Browser closed, Data scraped:', rawText);
  const endTime = Date.now();
  console.log('Time elapsed:', endTime - startTime);
  res.send(rawText);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});