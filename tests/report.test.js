import { test, expect } from 'bun:test'
import { sortPages } from '../modules/report'

test('sortPages', () => {
    const input = {
        'https://example.com/': 1,
        'https://example.com/path/subpath/subsubpath/': 4,
        'https://example.com/path/subpath/': 3,
        'https://example.com/path/': 2,
    }

    const actual = sortPages(input)

    expect(actual).toEqual([
        ['https://example.com/path/subpath/subsubpath/', 4],
        ['https://example.com/path/subpath/', 3],
        ['https://example.com/path/', 2],
        ['https://example.com/', 1],
    ])
})
