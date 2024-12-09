const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function formatForURL(title) {
  return title
    .toLowerCase()
    .replace(/[']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function saveData(data) {
  try {
    fs.writeFileSync('training_novels.json', JSON.stringify(data, null, 2));
    console.log('Progress saved.');
  } catch (error) {
    console.error('Error saving file:', error.message);
  }
}

async function questionAsync(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function processNovels() {
  try {
    const data = JSON.parse(fs.readFileSync('training_novels.json', 'utf8'));
    const novels = data.novels;

    for (const novel of novels) {
      console.log(`\nProcessing: ${novel.title}`);
      console.log(`Raw Name: ${novel.raw_name}`);

      if (!novel.url || novel.url === '') {
        const baseUrl = `https://novelbin.com/b/${formatForURL(novel.title)}`;
        console.log(`Suggested URL: ${baseUrl}`);

        const useBase = await questionAsync('Use this URL? (Y/n): ');

        if (useBase.toLowerCase() !== 'n') {
          novel.url = baseUrl;
        } else {
          novel.url = await questionAsync('Enter custom URL: ');
        }
        await saveData(data);
      } else {
        console.log(`URL already exists: ${novel.url}`);
      }

      if (!novel.raw_url || novel.raw_url === '') {
        novel.raw_url = await questionAsync('Enter Raw URL (press Enter to skip): ');
        await saveData(data);
      } else {
        console.log(`Raw URL already exists: ${novel.raw_url}`);
      }
    }

    console.log('\nAll novels processed');
    rl.close();
  } catch (error) {
    console.error('Error:', error.message);
    rl.close();
  }
}

processNovels();
