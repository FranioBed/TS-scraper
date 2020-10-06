import cheerio from "cheerio"
import fs from "fs";

import {Book} from "./book";
import {log} from "./decorators";

export class BookManager{

    books: Book[] = [];

    @log
    parseBooks(content: string){
        let $ = cheerio.load(content);

        $('li .product_pod').each((i, e) => {
            let title = $(e).find('h3 a').attr("title");
            let url = $(e).find('h3 a').attr("href");
            let price = parseFloat($(e).find('.product_price .price_color').text().match(/[\d\.]+/g)[0]);

            this.books.push(new Book(title, price, url));
        });
    }

    @log
    saveBooksToJSON(){
        fs.writeFile("result.json", JSON.stringify(this.books, null, "\t"), (err) =>{
            if (err) {
                return console.error(err);
            }
            console.log("File created!");
        });
    }

    @log
    saveBooksToExcel(){
        var excel = require('excel4node');
    
        let workbook = new excel.Workbook();
    
        var worksheet = workbook.addWorksheet();
        var style = workbook.createStyle({
            font: {
              color: '#000800',
              size: 12
            },
            numberFormat: '$#,##0.00; ($#,##0.00); -'
          });
        
        worksheet.cell(1,1).string('title').style(style);
        worksheet.cell(1,2).string('price').style(style);
        worksheet.cell(1,3).string('url').style(style);
    
        this.books.forEach((val, i) =>{
            worksheet.cell(i+2,1).string(val.title).style(style);
            worksheet.cell(i+2,2).number(val.price).style(style);
            worksheet.cell(i+2,3).string(val.url).style(style);
        })
    
        workbook.write('result.xlsx', (err, stats) =>{
            if(err){
                console.error(err);
            }
            else {
                console.log("Excel file created successfully.");
            }
        });
    }

}