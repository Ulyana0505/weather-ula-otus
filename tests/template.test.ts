import { templater } from "../src/templater";

/*const source = `
<h2>{{title.9}}</h2>
{{if author}}
<h3>{{author}}</h3>
{{end if}}
{{if author}}
<h3>{{author}}</h3>
{{end if}}
<div class="tags">
  {{for tags as item}}
  <a class="tag" href="#tag{{item.id}}">{{item.title}}</a>
  {{if notIsLastElement}}, {{end if}}
  {{if isLast}}!{{end if}}
  {{end for}}
</div>
`;*/
//{{if isLast}}! {{end if}}
test("templater", async () => {
  /*const title = "title";
  const r = templater(source, {
    "title.9": title,
    author: "author",
    tags: [
      { id: 1, title: "title-1" },
      { id: 2, title: "title-2" },
    ],
  });
  console.log(r);*/
  expect(templater("<h3>{{author}}</h3>", { author: "author" })).toEqual(
    "<h3>author</h3>",
  );
  expect(
    templater("{{if author}}<h3>{{author}}</h3>{{end if}}", {
      author: "author",
    }),
  ).toEqual("<h3>author</h3>");

  expect(templater("{{if author}}<h3>{{author}}</h3>{{end if}}", {})).toEqual(
    "",
  );

  const tmpFor = `
  {{for tags as item}}
  <a class="tag" href="#tag{{item.id}}">{{item.title}}</a>
  {{if notIsLastElement}}, {{end if}}
  {{if isLast}}!{{end if}}
  {{end for}}`;

  const dataFor = {
    tags: [
      { id: 1, title: "title-1" },
      { id: 2, title: "title-2" },
    ],
  };

  expect(templater(tmpFor, dataFor)).toEqual(
    `<a class="tag" href="#tag1">title-1</a> ,<a class="tag" href="#tag2">title-2</a> !`,
  );
});
