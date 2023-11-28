export interface LinkBody {
  head: string
  idName: string
}

export interface ColumnMeta {
  name: string
  showName?: string
  sortable: boolean
  type?: string
  linkbody?: LinkBody
}

// 修改官方题库题目的表单类型
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

export class WorkInfoInput extends ProblemInfoInput {}

// 创建官方题库题目的表单类型
export class ProblemInfoCreateInput extends ProblemInfoInput {
  id: number
  constructor(data: any) {
    super(data)
    this.id = 0
  }
}

export class WorkInfoCreateInput extends WorkInfoInput {}

// 修改官方题库题目的请求参数类型
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

export class WorkInfoQuery extends ProblemInfoQuery {
  constructor(data: WorkInfoInput) {
    super(data)
  }
}

// 创建官方题库题目的请求参数类型
export class ProblemInfoCreateQuery extends ProblemInfoQuery {
  id: number
  constructor(data: ProblemInfoCreateInput) {
    super(data)
    this.id = data.id
  }
}

export class WorkInfoCreateQuery extends WorkInfoQuery {
  constructor(data: WorkInfoCreateInput) {
    super(data)
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

export class WorkBaseInfo extends ProblemBaseInfo {
  userId: string
  username: string
  recommendation: number
  constructor(data: any) {
    super(data)
    this.userId = data.userId == undefined ? '' : data.userId
    this.username = data.username == undefined ? '' : data.username
    this.recommendation = data.recommendation == undefined ? 0 : data.recommendation
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

export class WorkListInfo extends WorkBaseInfo {
  id: string
  constructor(data: any) {
    super(data)
    this.id = data.id == undefined ? '' : data.id
  }
  static list(data: any[]) {
    const result: WorkListInfo[] = []
    for (let i = 0; i < data.length; i++) result.push(new WorkListInfo(data[i]))
    return result
  }
}

export interface Sample {
  display: boolean
  input?: string
  output?: string
}

function convertTimeLimit(data: number) {
  if (data >= 1000) return `${data / 1000}s`
  return `${data}ms`
}
function convertMemoryLimit(data: number) {
  if (data >= 1024) return `${data / 1024}GB`
  return `${data}MB`
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
  constructor(data: any) {
    super(data)
    this.titleEn = data.titleEn == undefined ? '' : data.titleEn
    this.type = data.type == undefined ? 0 : data.type
    this.timeLimit = data.timeLimit == undefined ? '' : convertTimeLimit(data.timeLimit)
    this.memoryLimit = data.memoryLimit == undefined ? '' : convertMemoryLimit(data.memoryLimit)
    if (data.background != undefined) this.background = data.background
    this.statement = data.statement == undefined ? '' : data.statement
    this.inputStatement = data.inputStatement == undefined ? '' : data.inputStatement
    this.outputStatement = data.outputStatement == undefined ? '' : data.outputStatement
    this.rangeAndHint = data.rangeAndHint == undefined ? '' : data.rangeAndHint
    this.samples = data.samples == undefined ? [] : data.samples
  }
}

export class WorkInfo extends WorkBaseInfo {
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
  constructor(data: any) {
    super(data)
    this.titleEn = data.titleEn == undefined ? '' : data.titleEn
    this.type = data.type == undefined ? 0 : data.type
    this.timeLimit = data.timeLimit == undefined ? '' : convertTimeLimit(data.timeLimit)
    this.memoryLimit = data.memoryLimit == undefined ? '' : convertMemoryLimit(data.memoryLimit)
    if (data.background != undefined) this.background = data.background
    this.statement = data.statement == undefined ? '' : data.statement
    this.inputStatement = data.inputStatement == undefined ? '' : data.inputStatement
    this.outputStatement = data.outputStatement == undefined ? '' : data.outputStatement
    this.rangeAndHint = data.rangeAndHint == undefined ? '' : data.rangeAndHint
    this.samples = data.samples == undefined ? [] : data.samples
  }
}
