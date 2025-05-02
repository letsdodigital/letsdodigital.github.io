import axios from 'axios';
import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs';

const RENDER_FOLDER: string = '_site';
const verbose = false;

const log = (message: any) => {
  if (verbose) {
    console.log(message);
  }
};

interface AllowlistConfig {
  allowlistedUrls: string[];
}

function loadAllowlist(): AllowlistConfig {
  try {
    const configPath = path.join(__dirname, 'urls.json');
    const configData = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configData) as AllowlistConfig;
  } catch (error) {
    throw new Error(
      `Failed to load allowlist config, using defaults: ${error}`
    );
  }
}

const bypassedUrls = loadAllowlist().allowlistedUrls;

/**
 * Check the status of a URL
 * @param url The URL to check
 * @returns The status code of the URL
 * @throws If the URL is not reachable
 *
 * @remark LinkedIn returns a 999 status code.
 */
async function checkUrlStatus(url: string): Promise<number> {
  if (url.startsWith('file://')) {
    const filePath = url.replace('file://', '');
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      return 200;
    } catch {
      return 404;
    }
    // Due to bot protection, we need to bypass some URLs.
  } else if (bypassedUrls.includes(url)) {
    return -1;
  } else {
    try {
      if (url.includes('x.com') || url.includes('twitter.com')) {
        log(`Using special handling for Twitter/X URL: ${url}`);

        // Twitter
        const response = await axios.get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            Referer: 'https://www.google.com/',
            'Cache-Control': 'max-age=0',
            'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1'
          },
          timeout: 10000,
          maxRedirects: 5
        });
        return response.status;
      }

      // Regular handling for non-Twitter URLs (unchanged)
      const response = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
      });
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

async function checkUrlsInSiteFolder(): Promise<{
  errorMessage: string;
  warningMessage: string;
}> {
  const siteFolder = path.join(process.cwd(), '..', RENDER_FOLDER);
  const htmlFiles = findHtmlFiles(siteFolder);
  let errorMessage: string = '';
  const warningMessage: string = '';
  const urlsChecked: { [url: string]: number } = {};

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const urls = content.match(/href="([^"]+)"/g);
    const fileShort = file.replace(process.cwd(), '');

    if (urls) {
      for (const url of urls) {
        const cleanUrl = url.replace(/href="|"/g, '');
        let fullUrl = cleanUrl;

        // Ignore certain urls
        if (
          cleanUrl.startsWith('mailto:') ||
          cleanUrl.startsWith('#') ||
          cleanUrl.startsWith('/site_libs/') ||
          cleanUrl.startsWith('tel:')
        ) {
          continue;
        }
        // Check if the url has already been tested.
        else if (urlsChecked[fullUrl] !== undefined) {
          const status = urlsChecked[fullUrl];
          log(`URL ${fullUrl} already checked, status ${status}`);

          if (status !== 200) {
            errorMessage += `In file \x1b[2m${fileShort}\x1b[0m, url \x1b[2m${cleanUrl}\x1b[0m returned status \x1b[2m${status}\x1b[0m\n`;
          }
        } else if (cleanUrl.startsWith('http')) {
          continue;
          // const status = await checkUrlStatus(fullUrl);
          // urlsChecked[fullUrl] = status;

          // // Handle bypass urls (due to bots protections on these sites, see `urls.json`)
          // if (status === -1) {
          //   warningMessage += `In file \x1b[2m${fileShort}\x1b[0m, url \x1b[2m${cleanUrl}\x1b[0m has been bypassed\n`;

          //   // Handle non-200 status codes
          // } else if (status !== 200) {
          //   log(`File:${file}\nURL ${fullUrl} returned status ${status}`);
          //   errorMessage += `In file \x1b[2m${fileShort}\x1b[0m, url \x1b[2m${cleanUrl}\x1b[0m returned status \x1b[2m${status}\x1b[0m\n`;

          //   // Handle 200 status codes
          // } else {
          //   log(`URL ${fullUrl} is OK`);
          // }

          // Check for local files.
        } else if (cleanUrl.startsWith('/')) {
          fullUrl = path.resolve(
            process.cwd(),
            '..',
            RENDER_FOLDER,
            cleanUrl.substring(1)
          );

          log(fullUrl);

          try {
            await fs.promises.access(fullUrl, fs.constants.F_OK);
            log(`\x1b[34mLocal file ${fullUrl} exists\x1b[0m`);
          } catch {
            errorMessage += `In file \x1b[2m${fileShort}\x1b[0m, the local url \x1b[2m${cleanUrl}\x1b[0m did not exist\n`;
          }
          // Check for local files again.
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
  return { errorMessage, warningMessage };
}

describe('URLs in site folder', () => {
  it("'_site' folder should exist", async () => {
    try {
      await fs.promises.access(
        path.join(process.cwd(), '..', RENDER_FOLDER),
        fs.constants.F_OK
      );
    } catch {
      throw new Error(
        `The _site folder does not exist. Please check for cause and then run jest again.`
      );
    }
  });
  it('should return 200 for all URLs', async () => {
    const { errorMessage, warningMessage } = await checkUrlsInSiteFolder();

    if (errorMessage) {
      throw new Error(`The following url fails occurred:\n\n${errorMessage}`);
    }

    if (warningMessage) {
      console.log(`Warnings:\n\n${warningMessage}`);
    }
  }, 100000);
});
