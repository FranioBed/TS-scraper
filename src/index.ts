import puppeteer from "puppeteer";
import fetch from "node-fetch";
import cheerio from "cheerio";

import {BookManager} from "./bookManager";

const url = "http://books.toscrape.com/";
const bookManager = new BookManager();

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    let content = await page.content();
    let $ = cheerio.load(content);

    bookManager.parseBooks(content);

    do {
        await Promise.all([
            page.waitForNavigation(),
            page.click('.pager .next a'),
            ]);

        content = await page.content();
        bookManager.parseBooks(content);
    }while(await page.$('.pager .next a'));

    bookManager.saveBooksToJSON();
    bookManager.saveBooksToExcel();

    await browser.close();
})();