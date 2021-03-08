import path from 'path';
import fs from 'fs';
import { parse, TextNode } from 'node-html-parser';
import yargs from 'yargs';
import chalk from 'chalk';

if (yargs.argv.help) {
  console.log(chalk.blue('--force'), chalk.dim('Re-translate texts that already have a related to-translate="" attribute'));
  console.log(chalk.blue('--help'), chalk.dim('Display this help'));
  process.exit(0);
}

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

const ignoreIfContains = ['<', '>', '${'];
const ignoreIfEquals = ['&nbsp;', '&nbsp;&nbsp;', '&nbsp;&nbsp;&nbsp;'];
const ignoreIfAttribute = ['t=', 'ignore-dico'];
const mustAddSpanInTags = ['template', 'ux-button', 'ux-list-item']; // must be in lowercase
const translatableAttributes = ['label', 'placeholder'];
const fixes = [
  {from: 'click delegate', to: 'click.delegate'},
];


if (!yargs.argv.force) {
  ignoreIfAttribute.push('to-translate');
}
let howmany = 0;
const foundByFiles: {
  [key: string]: string[]
} = {};

function generateKeyFromText(text: string): string {
  text = text.trim();
  if (text.substr(-1, 1) === '.') {
    text = text.substr(0, text.length - 1);
  }
  text = text.replace(/\./g, ',');
  text = text.substr(0, 1).toUpperCase() + text.substr(1);
  return text;
}

function setTattribute(node: any, text: string, attribute = 'to-translate') {
  node.rawAttrs+= ` ${attribute}="${text}"`;
}

function processElementNode(path: string, elementNode: HTMLElement): boolean {
  if (!elementNode.innerHTML.trim()) {
    return false;
  }
  for(const test of ignoreIfContains) {
    if (elementNode.innerHTML.indexOf(test) !== -1) {
      return false;
    }
  }
  for(const test of ignoreIfEquals) {
    if (elementNode.innerHTML.trim() === test) {
      return false;
    }
  }
  for(const test of ignoreIfAttribute) {
    if (elementNode.outerHTML.indexOf(test) !== -1) {
      return false;
    }
  }
  const key = generateKeyFromText(elementNode.innerHTML)
  setTattribute(elementNode, key);
  if (!foundByFiles[path]) {
    foundByFiles[path] = [];
  }
  foundByFiles[path].push(key);
  howmany++;
  return true;
}

function processElementNodeAttributes(path: string, elementNode: HTMLElement): boolean {
  for (const attr of translatableAttributes) {
    if (elementNode.hasAttribute('ignore-dico')) {
      return false;
    }
    if (elementNode.hasAttribute(attr)) {
      if (elementNode.hasAttribute(`${attr}-to-translate`) && !yargs.argv.force) {
        return false;
      }
      const attrValue = elementNode.getAttribute(attr).trim();
      if (attrValue.indexOf('${') !== -1) {
        return false;
      }
      if (attrValue.length === 0) {
        return false;
      }
      const key = generateKeyFromText(attrValue);
      const translatedValue = "${'" + key.replace(/'/g, '') + "' | t}";
      setTattribute(elementNode, translatedValue, `${attr}-to-translate`);
      if (!foundByFiles[path]) {
        foundByFiles[path] = [];
      }
      foundByFiles[path].push(key);
      howmany++;
    }
  }
  return true;
}

function processTextNode(path: string, textNode: TextNode, parent: Element): boolean {
  if (!textNode.isWhitespace && textNode.text) {
    for(const test of ignoreIfContains) {
      if (textNode.text.trim().indexOf(test) !== -1) {
        return false;
      }
    }
    for(const test of ignoreIfEquals) {
      if (textNode.text.trim() === test) {
        return false;
      }
    }
    if (parent.hasAttribute('ignore-dico')) {
      return false;
    }
    if (parent.hasAttribute('to-translate')) {
      return false;
    }
    if (parent.hasAttribute('t')) {
      return false;
    }
    const key = generateKeyFromText(textNode.text)
    if (parent.childNodes.length === 1 && !mustAddSpanInTags.includes(parent.tagName.toLowerCase())) {
      setTattribute(parent, key);
    } else {
      const childNodes: any = parent.childNodes;
      const isAtTheStart = childNodes[0] === textNode;
      const isAtTheEnd = childNodes[childNodes.length - 1] === textNode;
      if (isAtTheStart) {
        const attr = key.replace(/"/g, '\"');
        parent.removeChild(textNode as unknown as Node);
        parent.insertAdjacentHTML('afterbegin', `<span to-translate="${attr}">${textNode.text.trim()}</span>`)
      } else if (isAtTheEnd) {
        const attr = key.replace(/"/g, '\"');
        parent.removeChild(textNode as unknown as Node);
        parent.insertAdjacentHTML('beforeend', `<span to-translate="${attr}">${textNode.text.trim()}</span>`)
      } else {
        return false;
      }
    }
    if (!foundByFiles[path]) {
      foundByFiles[path] = [];
    }
    foundByFiles[path].push(key);
    howmany++;
  }
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
      processElementNodeAttributes(path, elementNode);
    } else if (node.nodeType === 3) {
      const textNode: TextNode = node as unknown as TextNode;
      processTextNode(path, textNode, parent);
    }
  }
}



new Promise(async (resolve, reject) => {
  try {
    const htmlFiles = await findAllFilesRecursively('./src', 'html');
    for (const file of htmlFiles) {
      const html = await fs.promises.readFile(file, {encoding: 'utf-8'}) as string;
      const dom = parse(html, {comment: true});
      parseNodeRecursively(file, dom as any);

      if (foundByFiles[file] && foundByFiles[file].length) {
        console.log(' ');
        console.log(file, ': found', foundByFiles[file].length, 'elements');
        for (const text of foundByFiles[file]) {
          console.log(' - ', text);
        }
        let newDom = dom.toString();
        for (const fix of fixes) {
          newDom = newDom.replace(new RegExp(fix.from, 'g'), fix.to);
        }
        await fs.promises.writeFile(file, newDom, {encoding: 'utf-8'});
      }
    }

    console.log('Found', howmany, 'texts in total');
    resolve(htmlFiles);
  } catch (error) {
    reject(error);
  }
}).then(() => {
  console.log('Done');
}).catch((error) => {
  console.error(error);
});
