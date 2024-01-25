import { crawlPage } from './modules/crawl'
import { printReport } from './modules/report'

/**
 * @return {void}
 */
async function main() {
    if (Bun.argv.length < 3) {
        console.log('no url provided')
        process.exit(1)
    }

    if (Bun.argv.length > 3) {
        console.log('too many arguments provided')
        process.exit(1)
    }

    const baseURL = Bun.argv[2]

    console.log(`crawling ${baseURL}`)

    const pages = await crawlPage(baseURL, baseURL, {})

    printReport(pages)
}

main()
