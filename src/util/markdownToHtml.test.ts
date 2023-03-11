import url from 'node:url'
import {removeMD, Node} from './markdownToHtml'

describe('removeMD', () => {
  test('`./some/path.md[x]` will become `../some/path`', () => {
    let testUrl = url.parse('./some/path.md')
    expect(removeMD(testUrl, {tagName: 'a', properties: {}})).toEqual(
      '.././some/path/'
    )

    testUrl = url.parse('./some/path.mdx')
    expect(removeMD(testUrl, {tagName: 'a', properties: {}})).toEqual(
      '.././some/path/'
    )
  })

  test('`./some/path/index.md[x]` will become `../some/path/`', () => {
    let testUrl = url.parse('./some/path/index.md')
    expect(removeMD(testUrl, {tagName: 'a', properties: {}})).toEqual(
      '.././some/path/'
    )

    testUrl = url.parse('./some/path/index.mdx')
    expect(removeMD(testUrl, {tagName: 'a', properties: {}})).toEqual(
      '.././some/path/'
    )
  })

  test('If linked from an `index.md[x]`, we do not traverse up a level.', () => {
    const testUrl = url.parse('./some/path.md')
    expect(
      removeMD(testUrl, {tagName: 'a', properties: {}}, '/test/index.md')
    ).toEqual('./some/path/')

    expect(
      removeMD(testUrl, {tagName: 'a', properties: {}}, '/test/index.mdx')
    ).toEqual('./some/path/')
  })

  test('relative header links retain deep links', () => {
    let testUrl = url.parse('./some/path.md#anchor')
    expect(removeMD(testUrl, {tagName: 'a', properties: {}})).toEqual(
      '.././some/path/#anchor'
    )
    expect(
      removeMD(testUrl, {tagName: 'a', properties: {}}, '/test/index.md')
    ).toEqual('./some/path/#anchor')
    testUrl = url.parse('./some/path.mdx#anchor')
    expect(removeMD(testUrl, {tagName: 'a', properties: {}})).toEqual(
      '.././some/path/#anchor'
    )
    expect(
      removeMD(testUrl, {tagName: 'a', properties: {}}, '/test/index.mdx')
    ).toEqual('./some/path/#anchor')

    testUrl = url.parse('./some/path/index.md#anchor')
    expect(removeMD(testUrl, {tagName: 'a', properties: {}})).toEqual(
      '.././some/path/#anchor'
    )
    expect(
      removeMD(testUrl, {tagName: 'a', properties: {}}, '/test/index.md')
    ).toEqual('./some/path/#anchor')
    testUrl = url.parse('./some/path/index.mdx#anchor')
    expect(removeMD(testUrl, {tagName: 'a', properties: {}})).toEqual(
      '.././some/path/#anchor'
    )
    expect(
      removeMD(testUrl, {tagName: 'a', properties: {}}, '/test/index.mdx')
    ).toEqual('./some/path/#anchor')
  })

  test(`Adds styling and target='_blank' to external links`, () => {
    const testUrl = url.parse('https://github.com/')
    const node: Node = {tagName: 'a', properties: {}}
    removeMD(testUrl, node)
    expect(node).toEqual({
      tagName: 'a',
      properties: {target: '_blank', class: ' external-link'}
    })
  })
})
