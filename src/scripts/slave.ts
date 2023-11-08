import { NS } from '@ns'
import Job from '/lib/job'

export async function main(ns: NS): Promise<void> {
  const port = ns.getPortHandle(1)
  const msg = ns.getPortHandle(2)

  while(true){
    if(port.empty()) await port.nextWrite()
    const job: Job = JSON.parse(port.read().toString())
    const opts = JSON.stringify({target: job.target, delay: job.delay})
    const pid = ns.run(`/scripts/${job.type}.js`, 1, opts)
  }
}