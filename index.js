import {httpClient} from '@digitalbazaar/http-client';
import {generateContent} from './ai.js';
import { http } from '@google-cloud/functions-framework';

import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

// Resolve the directory this script is in (handy when running from elsewhere)
const __filename = fileURLToPath(import.meta.url);
const __dirname  = join(__filename, '..');
const htmlHeaderPath = join(__dirname, 'header.html');
const htmlFooterPath = join(__dirname, 'footer.html');

let htmlHeader;
let htmlFooter;
try {
  htmlHeader = await readFile(htmlHeaderPath, 'utf8');
  htmlFooter = await readFile(htmlFooterPath, 'utf8');
} catch (err) {
  console.error(`Failed to read ${htmlPath}:`, err);
}

const OPENSTATES_API_KEY = process.env.OPENSTATES_API_KEY;
const headers = {'X-API-KEY': OPENSTATES_API_KEY};

const client = httpClient.extend({headers});
const unauthenticateClient = httpClient.create({});

const baseURL = 'https://v3.openstates.org'

// const result = await client.get(`${baseURL}/jurisdictions?classification=state`);

const VA_ID = 'ocd-jurisdiction/country:us/state:va/government';

http('myHttpFunction', async (req, res) => {

    const bills = await client.get(`${baseURL}/bills?jurisdiction=${VA_ID}`);

    const billsList = bills.data.results.map(b => `<li><a href="openstates1/${b.id}"><strong>${b.identifier}</strong> ${b.title}<a></li>`);

    // remove leading slash from path
    const billId = req.path !== '/' ? req.path.replace(/^\/+/, '') : bills.data.results[0].id;

    const result = await client.get(`${baseURL}/bills/${billId}?include=versions`);

    const {versions} = result.data;
    const latestVersion = versions[versions.length - 1];
    const htmlLink = latestVersion.links[0];
    //console.log(latestVersion);
    //console.log(htmlLink.url);

    // do no pass api key headers to public gov't website
    const billResult = await unauthenticateClient.get(htmlLink.url);
    const billText = await billResult.text();

    //console.log(billText);

    // const {openstates_url} = result.data;
    // const billText = await client.get(openstates_url);

    // console.log(JSON.stringify(result.data, null, 2));
    // console.log(billText.data);

    const billSummary = await generateContent(billText);

    // Send an HTTP response

    // let response = htmlHeader + formatColumn({content: JSON.stringify(bills.data, null, 2)});
    let response = htmlHeader + formatColumn({content: billsList.join('\n')});
    response = response + formatColumn({content: billText});
    response = response + formatColumn({content: billSummary}); 
    response = response + htmlFooter;

    res.send(response);
});

function formatColumn({content}) {
  let result = `<section class="col">`;
  result = result + content;
  result = result + `</section>`;
  return result;
}
