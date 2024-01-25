/**
 * @param {Object} pages
 * @returns {void}
 */
export function printReport(pages) {
    console.log('=====================')
    console.log('REPORT')
    console.log('=====================')

    const sortedPages = sortPages(pages)

    for (let [url, hits] of sortedPages) {
        console.log(`Found ${hits} links to page ${url}`)
    }

    console.log('=====================')
    console.log('END REPORT')
    console.log('=====================')

    return
}

/**
 * @param {Object} pages
 * @returns {Array}
 */
export function sortPages(pages) {
    return Object.entries(pages).sort((a, b) => b[1] - a[1])
}
