export interface ColumnMeta {
  name: string
  showName?: string
  sortable: boolean
  type?: string
}

export class ProblemInfoInput {
  title: string
  titleEn: string
  type: 0
  timeLimit: number
  memoryLimit: number
  background: string
  statement: string
  inputStatement: string
  outputStatement: string
  rangeAndHint: string
  source: string
  constructor(data: any) {
    this.title = data.title == undefined ? '' : data.title
    this.titleEn = data.titleEn == undefined ? '' : data.titleEn
    this.type = data.type == undefined ? 0 : data.type
    this.timeLimit = data.timeLimit == undefined ? 0 : data.timeLimit
    this.memoryLimit = data.memoryLimit == undefined ? 0 : data.memoryLimit
    this.background = data.background == undefined ? '' : data.background
    this.statement = data.statement == undefined ? '' : data.statement
    this.inputStatement = data.inputStatement == undefined ? '' : data.inputStatement
    this.outputStatement = data.outputStatement == undefined ? '' : data.outputStatement
    this.rangeAndHint = data.rangeAndHint == undefined ? '' : data.rangeAndHint
    this.source = data.source == undefined ? '' : data.source
  }
}

export class ProblemInfoQuery {
  title: string
  titleEn: string
  type: 0
  timeLimit: number
  memoryLimit: number
  background?: string
  statement: string
  inputStatement: string
  outputStatement: string
  rangeAndHint: string
  source: string
  constructor(data: ProblemInfoInput) {
    this.title = data.title
    this.titleEn = data.titleEn
    this.type = data.type
    this.timeLimit = data.timeLimit
    this.memoryLimit = data.memoryLimit
    if (data.background != '') this.background = data.background
    this.statement = data.statement
    this.inputStatement = data.inputStatement
    this.outputStatement = data.outputStatement
    this.rangeAndHint = data.rangeAndHint
    this.source = data.source
  }
}

export class ProblemBaseInfo {
  title: string
  source: string
  submit: number
  pass: string
  score?: number
  grade?: number
  tags?: string[]
  constructor(data: any) {
    this.title = data.title == undefined ? '' : data.title
    this.source = data.source == undefined ? '' : data.source
    this.submit = data.submit == undefined ? '' : data.submit
    this.pass = data.pass == undefined ? '' : `${data.pass * 100}%`
    if (data.score != undefined) this.score = data.score
    if (data.grade != undefined) this.grade = data.grade
    if (data.tags != undefined) this.tags = data.tags
  }
}

export class ProblemListInfo extends ProblemBaseInfo {
  id: string
  constructor(data: any) {
    super(data)
    this.id = data.id == undefined ? '' : data.id
  }
  static list(data: any[]) {
    const result: ProblemListInfo[] = []
    for (let i = 0; i < data.length; i++) result.push(new ProblemListInfo(data[i]))
    return result
  }
}

export interface Sample {
  display: boolean
  input?: string
  output?: string
}

export class ProblemInfo extends ProblemBaseInfo {
  titleEn: string
  type: 0
  timeLimit: string
  memoryLimit: string
  background?: string
  statement: string
  inputStatement: string
  outputStatement: string
  rangeAndHint: string
  samples: Sample[]
  static convertTimeLimit(data: number) {
    if (data >= 1000) return `${data / 1000}s`
    return `${data}ms`
  }
  static convertMemoryLimit(data: number) {
    if (data >= 1024) return `${data / 1024}GB`
    return `${data}MB`
  }
  constructor(data: any) {
    super(data)
    this.titleEn = data.titleEn == undefined ? '' : data.titleEn
    this.type = data.type == undefined ? 0 : data.type
    this.timeLimit = data.timeLimit == undefined ? '' : ProblemInfo.convertTimeLimit(data.timeLimit)
    this.memoryLimit =
      data.memoryLimit == undefined ? '' : ProblemInfo.convertMemoryLimit(data.memoryLimit)
    if (data.background != undefined) this.background = data.background
    this.statement = data.statement == undefined ? '' : data.statement
    this.inputStatement = data.inputStatement == undefined ? '' : data.inputStatement
    this.outputStatement = data.outputStatement == undefined ? '' : data.outputStatement
    this.rangeAndHint = data.rangeAndHint == undefined ? '' : data.rangeAndHint
    this.samples = data.samples == undefined ? [] : data.samples
  }
}
