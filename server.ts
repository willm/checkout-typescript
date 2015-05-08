declare function require(name:string);
var http = require('http');
var queryString = require('query-string');
http.createServer(function (req, res) {
	var requestData:string = '';
	if(req.method === 'POST') {
		req.on('data', function (data) {
			requestData += data;
		});
		req.on('end', function () {
			var items = queryString.parse(requestData).items;
			res.writeHead(200, {'Content-Type': 'text/plain' });
			return res.end(getPrice(items).toString());
		});
	} else {
		res.writeHead(404);
		res.end();
	}
}).listen(3000);

function getPrice (items: string): number {
	if(!items) {return 0};
	var parsedItems:Array<string> = items.split('');
	var catalogue:Array<Product> = [
	{
		price: {id: 'A', value: 50},
		discount: {multiple: 3, amount: 30}
	},
	{
		price: {id: 'B', value: 70},
		discount: {multiple: 3, amount: 30}
	},
	{
		price: {id: 'C', value: 40},
		discount: {multiple: 2, amount: 10}
	}];
	return catalogue.reduce(function (accumulator, product: Product) {
		var amountOfProduct:number = parsedItems.filter(function (i: string) {
			return i === product.price.id;
		}).length;
		var discount:Discount = product.discount;
		var calculatedDiscount:number = amountOfProduct %
			discount.multiple === 0 ?
				(amountOfProduct / discount.multiple) *
				discount.amount :
			0;
		return accumulator + (amountOfProduct * product.price.value) - calculatedDiscount;
	}, 0);
}

interface Product{
	price: Price;
	discount: Discount;
}

interface Discount{
	multiple: number;
	amount: number;
}

interface Price{
	id: string;
	value: number;
}
