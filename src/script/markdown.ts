import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'

const options = {
  throwOnError: false
}
marked.use(markedKatex(options))

export function markdown(s: string) {
  // add blank at both side of '$' for '$$' symbol to let it be rendered
  const tmp = s.split('$$')
  for (let i = 0; i < tmp.length; i++) tmp[i] = tmp[i].split('$').join(' $ ')
  s = tmp.join(' $$ ')
  return marked.parse(s)
}
