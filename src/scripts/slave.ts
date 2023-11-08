import { NS } from '@ns'
import Job from '/lib/job'

export async function main(ns: NS): Promise<void> {
  const port = ns.getPortHandle(1)
  const msg = ns.getPortHandle(2)

  while(true){
    await msg.nextWrite()
    const job: Job = JSON.parse(port.read().toString())
    const pid = ns.run(`${job.type}`)
  }
}