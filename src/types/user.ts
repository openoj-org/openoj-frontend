export class LoginInfo {
  id: string
  username: string
  character: number
  cookie: string
  constructor(data: any) {
    this.id = data.id ?? ''
    this.username = data.username ?? ''
    this.character = data.character ?? -1
    this.cookie = data.cookie ?? ''
  }
}
