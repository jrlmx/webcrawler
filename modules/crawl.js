/**
 * @param {string} url
 * @returns {string}
 */
export function normalizeURL(url) {
    if (!url) return null
    const { hostname, pathname } = new URL(url.toLowerCase())
    const domain = hostname.replace(/^www\./, '')
    const path = pathname.replace(/[/ ]$/, '')
    return domain + path
}

/**
 * @param {string} html
 * @returns {string[]}
 */
export async function getURLsFromHTML(html, baseURL) {
    const rewriter = new HTMLRewriter()
    let urls = []

    rewriter
        .on('a', {
            element(el) {
                const href = el.getAttribute('href')
                if (href.startsWith('/')) {
                    try {
                        urls.push(new URL(href, baseURL).toString())
                    } catch (e) {
                        console.log(`error with relative url: ${e.message}`)
                    }
                } else {
                    try {
                        urls.push(new URL(href).toString())
                    } catch (e) {
                        console.log(`error with absolute url: ${e.message}`)
                    }
                }
            },
        })
        .transform(
            new Response(html, { headers: { 'content-type': 'text/html' } }),
        )

    return urls
}

/**
 * @param {string} url
 * @param {string} baseURL
 * @returns {any}
 */
export async function crawlPage(baseURL, currentURL, pages) {
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages
    }

    const normalizedCurrentURL = normalizeURL(currentURL)

    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1

    console.log(`currently crawling ${currentURL}`)

    try {
        const response = await fetch(currentURL)

        if (!response.ok) {
            console.log(
                `error fetching ${currentURL} with status: ${response.status}`,
            )
            return pages
        }

        const contentType = response.headers.get('content-type')

        if (!contentType.includes('text/html')) {
            console.log(
                `non html response with ${currentURL} with content-type: ${contentType}`,
            )
            return pages
        }

        const html = await response.text()

        const nextURLs = await getURLsFromHTML(html, baseURL)

        for (let url of nextURLs) {
            pages = await crawlPage(baseURL, url, pages)
        }
    } catch (e) {
        console.log(`error fetching ${currentURL} with error: ${e.message}`)
    }

    return pages
}
