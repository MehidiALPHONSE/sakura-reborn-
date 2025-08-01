const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const { getPrefix } = global.utils;
module.exports = {
  config: {
    name: 'Salahtime',
    version: '1.0',
    author: 'Arfan',
    countDown: 5,
    role: 0,
    shortDescription: 'Get prayer time information',
    longDescription: ' prayer time information for a given location.',
    category: 'Information',
    guide: {
			en:'{pn} <location>'},
  },

  onStart: async function ({ api, args, message, event }) {


		       const p = getPrefix(event.threadID);
  
    const location = args.join(' ');

    if (!location) {
      message.reply('Please provide a location.\n\n/SalahTime Dhaka');
      return;
    }

    try {
      const url = `https://www.google.com/search?q=prayer+time+in+${encodeURIComponent(location)}`;
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const cityAndDateText = $('.BNeawe.tAd8D.AP7Wnd').text();
      const cityAndDateMatch = cityAndDateText.match(/^(.*?)\s�\s(.*)$/);
      const cityName = cityAndDateMatch ? cityAndDateMatch[1].trim() : '';
      const date = cityAndDateMatch ? cityAndDateMatch[2].trim().replace(/View all/g, '') : '';

      const isFriday = moment(date, 'MMM D, YYYY').format('dddd') === 'Friday';

      const prayerTimesTable = $('.LnMnt tbody tr');

      const prayerTimes = {};
      prayerTimesTable.each((index, element) => {
        const prayerName = $(element).find('td:nth-child(1)').text().trim();
        const prayerTime = $(element).find('td:nth-child(2)').text().trim();
        prayerTimes[prayerName] = prayerTime;
      });

      const prayerNames = isFriday ? ['Fajr', 'Jummah', 'Asr', 'Maghrib', 'Isha'] : ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

      let replyMessage = `🕋 --- PRAYER TIME ---🕋\n🌍 Location: ${cityName}\n🗓️ Date: ${date}\n\n`;

      prayerNames.forEach((prayerName) => {
        if (prayerName !== 'Sunrise') {
          const prayerTime = prayerName === 'Jummah' ? prayerTimes['Dhuhr'] : prayerTimes[prayerName];
          replyMessage += `🤲${prayerName}: ${prayerTime}\n`;
        }
      });

      const currentTime = moment().utcOffset('+06:00').format('h:mm A');
      const nextPrayer = getNextPrayer(prayerTimes, currentTime);

      if (nextPrayer) {
        const nextPrayerTime = prayerTimes[nextPrayer];
        const remainingTime = calculateRemainingTime(currentTime, nextPrayerTime);

        replyMessage += `\n🕌 Next Prayer Start 🕌\nCurrent time: ${currentTime}\nNext prayer: ${nextPrayer}\nTime: ${nextPrayerTime}\nTime remaining: ${remainingTime}`;
      }

      const imageUrls = JSON.parse(fs.readFileSync(`${__dirname}/assist_json/salah_img.json`));
      const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
      const imageFileName = 'salah_image.jpg';
      const imagePath = `${__dirname}/${imageFileName}`;

      try {
        const response = await axios.get(randomImageUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));
      } catch (error) {
        console.error('Error downloading the image:', error);
        message.reply('Sorry, there was an error retrieving the image.');
        return;
      }

      message.reply(
        {
          body: replyMessage,
          attachment: fs.createReadStream(imagePath),
        },
        () => {
          fs.unlinkSync(imagePath);
        }
      );
    } catch (error) {
      console.error('Error retrieving prayer time information:', error);
      message.reply('Sorry, there was an error retrieving the prayer time information.');
    }
  },
};

function getNextPrayer(prayerTimes, currentTime) {
  const prayerNames = Object.keys(prayerTimes);

  const currentPrayerIndex = prayerNames.findIndex((prayerName) => {
    const prayerTime = prayerTimes[prayerName];
    return moment(prayerTime, 'h:mm A').isAfter(moment(currentTime, 'h:mm A'));
  });

  if (currentPrayerIndex !== -1) {
    return prayerNames[currentPrayerIndex];
  }

  return null;
}

function calculateRemainingTime(currentTime, nextPrayerTime) {
  const currentTimeObj = moment(currentTime, 'h:mm A');
  const nextPrayerTimeObj = moment(nextPrayerTime, 'h:mm A');
  const duration = moment.duration(nextPrayerTimeObj.diff(currentTimeObj));
  const hours = duration.hours();
  const minutes = duration.minutes();

  let remainingTime = '';
  if (hours > 0) {
    remainingTime += `${hours} hour${hours > 1 ? 's' : ''} `;
  }
  if (minutes > 0) {
    remainingTime += `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  return remainingTime;
}
