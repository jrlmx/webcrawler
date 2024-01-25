import { test, expect } from 'bun:test'
import { normalizeURL, getURLsFromHTML } from '../modules/crawl'

test('normalizeURL protocol', () => {
    const input = 'http://blog.example.com/path'
    const actual = normalizeURL(input)
    expect(actual).toBe('blog.example.com/path')
})

test('normalizeURL www', () => {
    const input = 'http://www.example.com/path'
    const actual = normalizeURL(input)
    expect(actual).toBe('example.com/path')
})

test('normalizeURL trailing slash', () => {
    const input = 'http://example.com/path/'
    const actual = normalizeURL(input)
    expect(actual).toBe('example.com/path')
})

test('normalizeURL trailing space', () => {
    const input = 'http://example.com/path '
    const actual = normalizeURL(input)
    expect(actual).toBe('example.com/path')
})

test('normalizeURL capitals', () => {
    const input = 'http://Example.com/Path'
    const actual = normalizeURL(input)
    expect(actual).toBe('example.com/path')
})

test('normalizeURL empty', () => {
    const input = ''
    const actual = normalizeURL(input)
    expect(actual).toBe(null)

    const input2 = null
    const actual2 = normalizeURL(input2)
    expect(actual2).toBe(null)
})

test('getURLsFromHTML absolute', async () => {
    const inputHTML = `<html><body><a href="https://example.com">link</a></body></html>`
    const actual = await getURLsFromHTML(inputHTML, 'https://example.com')
    expect(actual).toEqual(['https://example.com/'])
})

test('getURLsFromHTML relative', async () => {
    const inputHTML = `<html><body><a href="/path/">link</a></body></html>`
    const actual = await getURLsFromHTML(inputHTML, 'https://example.com')
    expect(actual).toEqual(['https://example.com/path/'])
})

test('getURLsFromHTML both', async () => {
    const inputHTML = `<html>
<body>
    <a href="https://example.com/">link</a>
    <a href="/path/">link</a>
</body>
</html>`
    const actual = await getURLsFromHTML(inputHTML, 'https://example.com')
    expect(actual).toEqual([
        'https://example.com/',
        'https://example.com/path/',
    ])
})

test('getURLsFromHTML invalid', async () => {
    const inputHTML = `<html><body><a href="invalid">link</a></body></html>`
    const actual = await getURLsFromHTML(inputHTML, 'https://example.com')
    expect(actual).toEqual([])
})
