export type JobParams = {
  type: 'hack' | 'weaken' | 'grow'
  target: string
  delay?: number 
  threads?: number
}

export default class Job {
  type
  target
  delay
  threads

  constructor({type, target, delay = 1, threads = 1}: JobParams){
    this.type = type
    this.target = target
    this.delay = delay
    this.threads = threads
  }
}