let allowedUrls = [];

async function getUrls() {
    const response = await fetch('http://localhost:3002/allowedUrls.json');
    const data = await response.json();
    allowedUrls = data;
  }

getUrls();
setInterval(getUrls, 1000 * 60 * 60);