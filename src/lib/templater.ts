export function templater(
    input: string,
    data: Record<string, any> = {}
): string {
    return template(input, data)
}

function template(
    input: string,
    data: Record<string, any>,
    iterationData?: TemplateIteration
): string {
    let result: string = input
    result = result.replace(
        /{{for (\w+) as (\w+)}}((\s|\S)+?){{end for}}/gm,
        function (_, collection, loopVar, internalTemplate) {
            return data[collection] && Array.isArray(data[collection])
                ? (data[collection] as unknown[])
                      .map(
                          (
                              item: unknown,
                              _index: number,
                              arr: Array<unknown>
                          ) => {
                              if (iterationData === undefined) {
                                  iterationData = templateIteration(arr.length)
                              } else {
                                  iterationData.increment()
                              }

                              const updatedItem = Object.fromEntries(
                                  Object.entries(
                                      item as Record<string, unknown>
                                  ).map(([k, v]) => [loopVar + '.' + k, v])
                              )

                              if (iterationData.isLast) {
                                  updatedItem.isLast = true
                              } else {
                                  updatedItem.notIsLastElement = true
                              }

                              return template(
                                  internalTemplate,
                                  updatedItem,
                                  iterationData
                              )
                          }
                      )
                      .join('')
                : ''
        }
    )

    result = result.replace(
        /{{if (\w+)}}((\s|\S)+?){{end if}}/gm,
        (_, conditionToken: keyof TemplateIteration, innerTemplate) => {
            let result = ''

            result +=
                conditionToken in data && data[conditionToken] !== undefined
                    ? template(innerTemplate, data)
                    : ''
            return result
        }
    )

    result = result.replace(/{{([\w.]+)}}/gm, (_, token) =>
        token in data ? (data[token] as string) : ''
    )

    return result
        .replace(/\n/g, ' ')
        .replace(/\r/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

type TemplateIteration = {
    index: number
    isLast: boolean
    isFirst: boolean
    increment(): void
}

function templateIteration(last: number): TemplateIteration {
    return {
        isFirst: true,
        index: 0,
        isLast: false,
        increment() {
            this.isFirst = false
            this.index += 1
            this.isLast = last - 1 === this.index
        },
    }
}
