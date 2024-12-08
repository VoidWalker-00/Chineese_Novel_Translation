import { fs } from "fs";
import { readline } from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function processNovels() {
  try {
    const data = JSON.parse(fs.readFileSync('training_novels.json', 'utf8'));
    const novels = data.novels;
    let modified = false;

    for (const novel of novels) {
      console.log(`\nProcessing: ${novel.title}`);
      console.log(`Raw Name: ${novel.raw_name}`);

      if (!novel.url || novel.url === '') {
        novel.url = await new Promise(resolve => {
          rl.question('Enter URL (press Enter to skip): ', answer => {
            resolve(answer.trim());
          });
        });
        modified = true;
      } else {
        console.log(`URL already exists: ${novel.url}`);
      }

      if (!novel.raw_url || novel.raw_url === '') {
        novel.raw_url = await new Promise(resolve => {
          rl.question('Enter Raw URL (press Enter to skip): ', answer => {
            resolve(answer.trim());
          });
        });
        modified = true;
      } else {
        console.log(`Raw URL already exists: ${novel.raw_url}`);
      }
    }

    if (modified) {
      fs.writeFileSync('training_novels.json', JSON.stringify(data, null, 2));
      console.log('\nJSON file has been updated with new URLs');
    }

    rl.close();
  } catch (error) {
    console.error('Error:', error.message);
    rl.close();
  }
}

processNovels();
