import axios from 'axios';
import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs';

const render_folder: string = '_site';
const verbose = false;

async function checkUrlStatus(url: string): Promise<number> {
  if (url.startsWith('file://')) {
    const filePath = url.replace('file://', '');
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      return 200;
    } catch {
      return 404;
    }
  } else {
    try {
      const response = await axios.get(url);
      return response.status;
    } catch (error: any) {
      if (error.response) {
        return error.response.status;
      } else {
        console.log(`Error fetching ${url}:`, error.message);
        return 0;
      }
    }
  }
}




function findHtmlFiles(dir: string): string[] {
  const pattern = path.join(dir, '**/*.html');
  return glob.sync(pattern);
}

async function checkUrlsInSiteFolder(): Promise<string> {
  const siteFolder = path.join(process.cwd(), '../', render_folder);
  const htmlFiles = findHtmlFiles(siteFolder);
  let errorMessage: string = '';

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const urls = content.match(/href="([^"]+)"/g);
    const fileShort = file.replace(process.cwd(), '');

    if (urls) {
      for (const url of urls) {
        const cleanUrl = url.replace(/href="|"/g, '');
        let fullUrl = cleanUrl;

        if (cleanUrl.startsWith('http')) {
          const status = await checkUrlStatus(fullUrl);
          if (status !== 200) {
            console.log(
              `File:${file}\nURL ${fullUrl} returned status ${status}`
            );
            errorMessage += `In file \x1b[2m${fileShort}\x1b[0m, url \x1b[2m${cleanUrl}\x1b[0m returned status \x1b[2m${status}\x1b[0m\n`;
          } else {
            if (verbose) {
              console.log(`URL ${fullUrl} is OK`);
            }
            continue;
          }
        } else if (
          cleanUrl.startsWith('#') ||
          cleanUrl.startsWith('/site_libs/')
        ) {
          continue;
        } else if (cleanUrl.startsWith('/')) {
          fullUrl = path.resolve(process.cwd(), cleanUrl);
          try {
            await fs.promises.access(render_folder, fs.constants.F_OK);
            if (verbose) {
              console.log(`\x1b[34mLocal file ${fullUrl} exists\x1b[0m`);
            }
          } catch {
            errorMessage += `In file \x1b[2m${fileShort}\x1b[0m, the local url \x1b[2m${cleanUrl}\x1b[0m did not exist\n`;
          }
        } else {
          fullUrl = path.resolve(path.dirname(file), cleanUrl);
          try {
            await fs.promises.access(fullUrl, fs.constants.F_OK);
          } catch {
            errorMessage += `In file \x1b[2m${fileShort}\x1b[0m, the local url \x1b[2m${cleanUrl}\x1b[0m does not exist\n`;
          }
        }
      }
    }
  }
  return errorMessage;
}

describe('URLs in site folder', () => {
  it('should return 200 for all URLs', async () => {
    const errorMessage = await checkUrlsInSiteFolder();

    if (errorMessage) {
      throw new Error(`The following url fails occurred:\n\n${errorMessage}`);
    }
  }, 100000);
});
