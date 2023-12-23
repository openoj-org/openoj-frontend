export class PostBaseInfo {
  title: string
  userId: string
  username: string
  time: number
  commentTime: number
  withProblem: boolean
  type?: 0 | 1
  problemId?: string
  problemTitle?: string
  count: number
  constructor(data: any) {
    this.title = data.title ?? ''
    this.userId = data.userId ?? ''
    this.username = data.username ?? ''
    this.time = data.time ?? 0
    this.commentTime = data.commentTime ?? 0
    this.withProblem = data.withProblem ?? false
    if (this.withProblem) {
      this.type = data.type ?? 0
      this.problemId = data.problemId ?? ''
      this.problemTitle = data.problemTitle ?? ''
    }
    this.count = data.count ?? 0
  }
}

export class PostListInfo extends PostBaseInfo {
  id: string
  constructor(data: any) {
    super(data)
    this.id = data.id ?? ''
  }
  static list(data: any[]) {
    const result: PostListInfo[] = []
    for (let i = 0; i < data.length; i++) result.push(new PostListInfo(data[i]))
    return result
  }
}

export class PostContent {
  userId: string
  username: string
  content: string
  time: number
  constructor(data: any) {
    this.userId = data.userId ?? ''
    this.username = data.username ?? ''
    this.content = data.content ?? ''
    this.time = data.time ?? 0
  }
  static list(data: any[]) {
    const result: PostContent[] = []
    for (let i = 0; i < data.length; i++) result.push(new PostContent(data[i]))
    return result
  }
}
