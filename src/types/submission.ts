export const languages = [
  {
    value: 'C++11',
    label: 'C++11'
  },
  {
    value: 'Python3',
    label: 'Python3'
  }
]

export type Language = 'Python3' | 'C++11'

export const status = [
  {
    value: 'AC',
    label: 'Accepted'
  },
  {
    value: 'WA',
    label: 'Wrong Answer'
  },
  {
    value: 'TLE',
    label: 'Time Limit Exceeded'
  },
  {
    value: 'MLE',
    label: 'Memory Limit Exceeded'
  },
  {
    value: 'RE',
    label: 'Runtime Error'
  },
  {
    value: 'CE',
    label: 'Compilation Error'
  },
  {
    value: 'UKE',
    label: 'Unknown Error'
  },
  {
    value: 'Judging',
    label: 'Judging'
  }
]

export type Status = 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE' | 'CE' | 'UKE' | 'Judging'

export function statusTransform(value: Status) {
  switch (value) {
    case 'AC':
      return 'Accepted'
    case 'WA':
      return 'Wrong Answer'
    case 'TLE':
      return 'Time Limit Exceeded'
    case 'MLE':
      return 'Memory Limit Exceeded'
    case 'RE':
      return 'Runtime Error'
    case 'CE':
      return 'Compilation Error'
    case 'UKE':
      return 'Unknown Error'
    case 'Judging':
      return 'Judging'
  }
}

export interface JudgeBaseResult {
  status: Status
  score: number
  timeCost: number
  memoryCost: number
}

export class SubmissionBaseInfo implements JudgeBaseResult {
  type: 0 | 1
  problemId: string
  problemTitle: string
  userId: string
  username: string
  language: Language
  time: number
  status: Status
  score: number
  timeCost: number
  memoryCost: number
  constructor(data: any) {
    this.type = data.type ?? 0
    this.problemId = data.problemId ?? ''
    this.problemTitle = data.problemTitle ?? ''
    this.userId = data.userId ?? ''
    this.username = data.username ?? ''
    this.language = data.language ?? 'Python3'
    this.time = data.time ?? 0
    this.status = data.status ?? 'AC'
    this.score = data.score ?? 0
    this.timeCost = data.timeCost ?? 0
    this.memoryCost = data.memoryCost ?? 0
  }
}

export class SubmissionListInfo extends SubmissionBaseInfo {
  id: string
  constructor(data: any) {
    super(data)
    this.id = data.id ?? ''
  }
  static list(data: any[]) {
    const result: SubmissionListInfo[] = []
    for (let i = 0; i < data.length; i++) result.push(new SubmissionListInfo(data[i]))
    return result
  }
}

export class JudgeResult implements JudgeBaseResult {
  id: string
  status: Status
  score: number
  timeCost: number
  memoryCost: number
  constructor(data: any) {
    this.id = data.id ?? ''
    this.status = data.status ?? 'AC'
    this.score = data.score ?? 0
    this.timeCost = data.timeCost ?? 0
    this.memoryCost = data.memoryCost ?? 0
  }
  static list(data: any[]) {
    const result: JudgeResult[] = []
    for (let i = 0; i < data.length; i++) result.push(new JudgeResult(data[i]))
    return result
  }
}

export class SubmissionInfo extends SubmissionBaseInfo {
  sourceCode: string
  subtask: boolean
  subtaskInfo?: JudgeResult[]
  dataInfo?: JudgeResult[]
  constructor(data: any) {
    super(data)
    this.sourceCode = data.sourceCode ?? ''
    this.subtask = data.subtask ?? true
    this.subtaskInfo = data.subtaskInfo ?? []
    this.dataInfo = data.dataInfo ?? []
  }
}
