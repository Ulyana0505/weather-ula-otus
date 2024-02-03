import { templater } from '../src/lib/templater'

test('templater', async () => {
    expect(templater('<h3>{{author}}</h3>', { author: 'author' })).toEqual(
        '<h3>author</h3>'
    )
    expect(
        templater('{{if author}}<h3>{{author}}</h3>{{end if}}', {
            author: 'author',
        })
    ).toEqual('<h3>author</h3>')

    expect(templater('{{if author}}<h3>{{author}}</h3>{{end if}}', {})).toEqual(
        ''
    )

    const tmpFor = `
  {{for tags as item}}
  <a class="tag" href="#tag{{item.id}}">{{item.title}}</a>
  {{if notIsLastElement}}, {{end if}}
  {{if isLast}}!{{end if}}
  {{end for}}`

    const dataFor = {
        tags: [
            { id: 1, title: 'title-1' },
            { id: 2, title: 'title-2' },
        ],
    }

    expect(templater(tmpFor, dataFor)).toEqual(
        `<a class="tag" href="#tag1">title-1</a> ,<a class="tag" href="#tag2">title-2</a> !`
    )

    expect(templater(`<h3>{{author}}</h3>`)).toEqual('<h3></h3>')

    expect(
        templater(`{{for tags as item}}<p>{{item.title}}</p>{{end for}}`)
    ).toEqual('')
})
