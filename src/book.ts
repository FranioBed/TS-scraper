export class Book {
    title: string;
    price: number;
    url: string;

    constructor(title: string, price: number, url: string){
        this.title = title;
        this.price = price;
        this.url = url;
    }
}