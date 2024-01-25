import { crawlPage } from './modules/crawl'

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

    for (let [page, hits] of Object.entries(pages)) {
        console.log(`${page}, ${hits}`)
    }
}

main()
