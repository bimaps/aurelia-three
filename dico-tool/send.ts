import path from 'path';
import fs from 'fs';
import { parse, TextNode } from 'node-html-parser';
import yargs from 'yargs';
import https from 'https';
import http from 'http';
import chalk from 'chalk';

let localApiKey = '';
const globalApiKey = 'enterYourKey';
const protocol: 'http' | 'https' = yargs.argv.prod ? 'https' : 'http';
const port: 3000 | 443 = yargs.argv.prod ? 443 : 3000;
const host = yargs.argv.prod ? 'api.example.com' : 'localhost';
const pathPrefix = yargs.argv.prod ? '/prod' : '';

if (yargs.argv.help) {
  console.log(chalk.blue('--prod'), chalk.dim('Use this flag to ensure you run the tool with the prod api'));
  console.log(chalk.blue('--all'), chalk.dim('Display all occurences, event those already available in the dico api'));
  console.log(chalk.blue('--file'), chalk.dim('Display the results by file instead of unique occurences'));
  console.log(chalk.blue('--push'), chalk.dim('Push the missing values in the dico using the context to determine if global/local'), chalk.red('Not implemented'));
  console.log(chalk.blue('--push-local'), chalk.dim('Push the missing values in the local dico'), chalk.red('Not implemented'));
  console.log(chalk.blue('--push-global'), chalk.dim('Push the missing values in the global dico'), chalk.red('Not implemented'));
  console.log(chalk.blue('--verbose'), chalk.dim('Display detailed errors if any'));
  console.log(chalk.blue('--help'), chalk.dim('Display this help'), chalk.red('Not implemented'));
  process.exit(0);
}

const display: 'all' | 'missing' = yargs.argv.all ? 'all' : 'missing';
const displayType: 'unique' | 'by-file' = yargs.argv.file ? 'by-file' : 'unique';
const push = yargs.argv.push;
const verbose = yargs.argv.verbose;

try {
  const content = fs.readFileSync(path.join(__dirname, '../config/environment.json'), {encoding: 'utf-8'});
  const config = JSON.parse(content);
  localApiKey = config.swissdata.apiKey;
} catch (error) {
  // do nothing;
}

let howmany = 0;
const foundByFiles: {
  [key: string]: string[]
} = {};
const uniqueFounds: string[] = [];
const invalidKeys: string[] = [];
let globalBackend: any = null;
let localBackend: any = null;

async function findAllFilesRecursively(base: string, ext: string, files?: string[], result?: string[]): Promise<string[]> {
  files = files || (await fs.promises.readdir(base));
  result = result || [];

  for (const file of files) {
    const newbase = path.join(base, file)
    if ( fs.statSync(newbase).isDirectory() ) {
      const newFiles = await fs.promises.readdir(newbase);
      result = await findAllFilesRecursively(newbase, ext, newFiles, result);
    } else if ( file.substr(-1*(ext.length+1)) === '.' + ext ) {
      result.push(newbase)
    }
  }
  return result;
}

function isTranslatableExpression(text: string): false | string {

  if (typeof text !== 'string') {
    return false;
  }
  const matches = text.match(/^\${'(.*)'[\s]?\|[\s]?t}$/);
  if (matches?.length === 2) {
    return matches[1];
  }

  return false;
}

function isKeyValid(text: string): boolean {
  if (invalidKeys.includes(text)) {
    return false;
  }
  if (text.indexOf(':') !== -1) {
    invalidKeys.push(text);
    return false;
  }
  if (text.indexOf('${') !== -1) {
    invalidKeys.push(text);
    return false;
  }
  if (text.substr(-1, 1) === '.') {
    invalidKeys.push(text);
    return false;
  }
  const parts = text.split('.')  ;
  const last = parts.pop();
  const minChars = 'abcdefghijklmnopqrstuvwxyz';
  if (minChars.indexOf(last.substr(0, 1)) !== -1) {
    invalidKeys.push(text);
    return false;
  }
  for (const part of parts) {
    if (minChars.indexOf(part.substr(0, 1)) === -1) {
      invalidKeys.push(text);
    return false;
    }
  }
  return true;
}

function valueInObject(obj: any, path: string) {
  const args = path.split('.');
  return args.reduce((obj, level) => obj && obj[level], obj);
}

async function getBackend(apiKey: string): Promise<any> {
  return new Promise((resolve, reject) => {
    let resContent = '';
    const options = {
      hostname: host,
      port: port,
      path: `${pathPrefix}/dico/backend?apiKey=${apiKey}`,
      method: 'GET',
    }
    const service = protocol === 'https' ? https : http;
    service.request(options, (response) => {
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        resContent += chunk;
      });
      response.on('end', () => {
        try {
          const json = JSON.parse(resContent);
          resolve(json);
        } catch (error) {
          if (verbose) {
            console.error(error);
          }
          reject(error);
        }
      });
      response.on('error', (error) => {
        if (verbose) {
          console.error(error);
        }
        reject(error);
      })
    }).end();
  })
}

function addInUnique(text: string): void {
  if (uniqueFounds.indexOf(text) === -1) {
    uniqueFounds.push(text);
  }
}
function addInFoundByFiles(text: string, path: string) {
  if (!foundByFiles[path]) {
    foundByFiles[path] = [];
  }
  foundByFiles[path].push(text);
  addInUnique(text);
}

function processElementNode(path: string, elementNode: HTMLElement): void {
  if (elementNode.hasAttribute('t')) {
    const tValue = elementNode.getAttribute('t').replace('[html]', '').replace('[placeholder]', '').replace('[label]', '');
    addInFoundByFiles(tValue, path);
  }
  if (elementNode.hasAttribute('label')) {
    const labelValue = elementNode.getAttribute('label');
    const translatable = isTranslatableExpression(labelValue);
    if (translatable) {
      addInFoundByFiles(translatable, path);
    }
  }
  if (elementNode.hasAttribute('placeholder')) {
    const labelValue = elementNode.getAttribute('label');
    const translatable = isTranslatableExpression(labelValue);
    if (translatable) {
      addInFoundByFiles(translatable, path);
    }
  }
}

function processTextNode(path: string, textNode: TextNode, parent: Element): boolean {
  if (!textNode.isWhitespace && textNode.text) {
    const text = textNode.text.trim();
    const translatable = isTranslatableExpression(text);
    if (!translatable) {
      return false;
    }
    addInFoundByFiles(translatable, path);
    return true;
  }
  return false;
}


function parseNodeRecursively(path: string, parent: Element | HTMLElement) {
  // const nodes = node.querySelectorAll('*') as unknown as HTMLElement[];
  const nodes = parent.childNodes;
  mainLoop: for (const node of nodes) {
    const n: any = node;
    if (n.__parsed) {
      continue;
    }
    n.__parsed = true;
    if (node.nodeType === 1) {
      const elementNode: HTMLElement = node as HTMLElement;
      parseNodeRecursively(path, elementNode);
      processElementNode(path, elementNode);
    } else if (node.nodeType === 3) {
      const textNode: TextNode = node as unknown as TextNode;
      processTextNode(path, textNode, parent);
    }
  }
}

const globalContexts = ['', 'gettingStarted', 'shop', 'error', 'info', 'confirmation', 'admin', 'three', 'bcf'];
const isGlobalDico = (key: string) => {
  if (key.indexOf('.') === -1) {
    return true;
  }
  if (globalContexts.includes(key)) {
    return true;
  }
  if (globalContexts.some((context) => {
    return key.indexOf(context + '.') === 0
  })) {
    return true;
  }
  return false;
}

async function postNewKey(text: string): Promise<'global' | 'local'> {

  const parts = text.split('.');
  const value = parts.pop();
  const key = parts.join('.');

  const isGlobal = isGlobalDico(key)
  const apiKey = isGlobal ? globalApiKey : localApiKey;

  let multiLangValue: any = {};
  for (let language of ['fr', 'en', 'de', 'it']) {
    multiLangValue[language] = value;
  }

  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      key: text, value: multiLangValue, tags: ['dico-tool']
    });

    const options = {
      hostname: host,
      port: port,
      path: `${pathPrefix}/dico?apiKey=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length,
      },
    }

    const service = protocol === 'https' ? https : http;
    const req = service.request(options, (response) => {
      response.setEncoding('utf8');
      if (response.statusCode < 300) {
        return resolve(isGlobal ? 'global' : 'local');
      }
      
      console.log(chalk.red('Response code:', response.statusCode.toString()));
      reject(new Error('Push failed'));
    });
    req.write(body);
    req.end();
  });
}

new Promise(async (resolve, reject) => {
  try {
    const htmlFiles = await findAllFilesRecursively('./src', 'html');
    globalBackend = await getBackend(globalApiKey);
    if (localApiKey) {
      localBackend = await getBackend(localApiKey);
    }
    for (const file of htmlFiles) {
      const html = await fs.promises.readFile(file, {encoding: 'utf-8'}) as string;
      const dom = parse(html, {comment: true});
      parseNodeRecursively(file, dom as any);

      if (foundByFiles[file] && foundByFiles[file].length) {
        let headerDisplayed = false;
        for (const text of foundByFiles[file]) {
          const isValid = isKeyValid(text);
          const existsInGlobal = globalBackend ? valueInObject(globalBackend, text) !== undefined : false;
          const existsInLocal = localBackend ? valueInObject(localBackend, text) !== undefined : false;

          if (displayType !== 'by-file') {
            continue;
          }

          if (display === 'missing' && isValid && (existsInLocal || existsInGlobal)) {
            continue;
          }

          if (!headerDisplayed) {
            console.log(' ');
            console.log(chalk.blue(file));
            headerDisplayed = true;
          }

          const globalColor: 'dim' | 'green' = existsInGlobal ? 'green' : 'dim';
          const localColor: 'dim' | 'green' = existsInLocal ? 'green' : 'dim';
          const displayText = (existsInGlobal || existsInLocal) ? text : chalk.red.bold(text);
          console.log(' - ', chalk[globalColor]('[global]'), chalk[localColor]('[local]'), displayText);
        }
      }
    }

    if (displayType === 'unique') {
      console.log('display', display);
      uniqueFounds.sort();
      for (const text of uniqueFounds) {
        const existsInGlobal = globalBackend ? valueInObject(globalBackend, text) !== undefined : false;
        const existsInLocal = localBackend ? valueInObject(localBackend, text) !== undefined : false;
        const isValid = isKeyValid(text);

        if (display === 'missing' && isValid && (existsInLocal || existsInGlobal)) {
          continue;
        }

        const globalColor: 'dim' | 'green' = existsInGlobal ? 'green' : 'dim';
        const localColor: 'dim' | 'green' = existsInLocal ? 'green' : 'dim';
        const displayText = (existsInGlobal || existsInLocal) ? text : chalk.red.bold(text);
        const invalid = isValid ? '' : chalk.magenta('(invalid)');
        console.log(' - ', chalk[globalColor]('[global]'), chalk[localColor]('[local]'), displayText, invalid);
      }
    }

    if (invalidKeys.length) {
      console.log(chalk.bold.red('Found', invalidKeys.length.toString(), 'invalid keys'));
      for (const key of invalidKeys) {
        console.log('- ', key);
      }
    }

    if (push) {
      console.log(chalk.magentaBright('Pushing new dico keys ...'));
      for (const key of uniqueFounds) {
        const existsInGlobal = globalBackend ? valueInObject(globalBackend, key) !== undefined : false;
        const existsInLocal = localBackend ? valueInObject(localBackend, key) !== undefined : false;
        if (!isKeyValid(key) || existsInLocal || existsInGlobal) {
          continue;
        }
        try {
          const globalOrLocal = await postNewKey(key);
          console.log(' - ', key, chalk.green('pushed in ', globalOrLocal));
        } catch (error) {
          console.log(' - ', key, chalk.red.bold('failed to push'))
        }
      }
    }

    resolve(htmlFiles);
  } catch (error) {
    reject(error);
  }
}).then(() => {
  console.log('Done');
}).catch((error) => {
  console.error(error);
});
