const fs = require('fs')
const csv = fs.createWriteStream('produtos.csv')
const Crawler = require('crawler')
const callback = (err, res, done) => {
    if (err) throw err

    const $ = res.$
    const pageNo = $('.pageNo').children('span').text()
    const pageProducts = $('.prodDetail').map((i, el) => {
	const product = $(el)
	const title = product.children('.tit').text()
	const location = product.children('.comLoca').text()
	const categories = product.children('.prodCat').text()
	const booth = product.children('.boothDetail').children('span').children('a').text()

	return `${pageNo};${title};${location};${categories};${booth};\n`
    }).get().join(' ')
    console.log(pageProducts)
    csv.write(pageProducts)
    done()
}

const c = new Crawler({
    maxConnections: 10,
    callback
})

const tasks = Array.from({length: 133} , (el, i) => {
    return {
	uri: `http://m.hktdc.com/fair/exlist/hklightingfairae-en/HKTDC-Hong-Kong-International-Lighting-Fair-Autumn-Edition/List-Of-Exhibitors.htm?bookmark=true&query=&breadcrumb=&advanced=false&code=hklightingfairae&language=en&page=${i + 1}`
    }
})

csv.write('Page;Name;Location;Categories;Booth No.;\n')

c.on('drain', () => {
    csv.close()
})

c.queue(tasks)
