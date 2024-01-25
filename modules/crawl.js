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
                if (
                    href.startsWith('/') ||
                    href.startsWith('http://') ||
                    href.startsWith('https://')
                ) {
                    try {
                        urls.push(new URL(href, baseURL).toString())
                    } catch (e) {
                        console.log(`error with url ${href}: ${e.message}`)
                    }
                } else {
                    console.log(`skipping invalid url: ${href}`)
                }
            },
        })
        .transform(
            new Response(html, { headers: { 'content-type': 'text/html' } }),
        )

    return urls
}
