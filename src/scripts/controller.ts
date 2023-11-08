import { NS } from "@ns";
import { getNewTarget, HostStats } from "/lib/utils";
import Job from "/lib/job"

export async function main(ns: NS): Promise<void> {
  const port = ns.getPortHandle(1)
  const msg = ns.getPortHandle(2)
  const player = ns.getPlayer()
  const hosts: HostStats[] = JSON.parse(ns.read('hosts.txt'))
  const target = getNewTarget(hosts, player)

  const wTime = ns.getWeakenTime(target.id)
  const hTime = wTime / 4
  const gTime = hTime * 3.2
  const spacer = 50

  const hackDelay = wTime - spacer - hTime;
  const weaken1delay = 0;
  const growDelay = wTime + spacer - gTime;
  const weaken2delay = spacer * 2;

  port.clear()
  msg.clear()

  ns.tprint({wTime, hTime, gTime})
  const batch = [
    new Job({type: "hack", target: target.id, delay: ((wTime - hTime) - 50)}),
    new Job({type: "weaken", target: target.id}),
    // new Job("grow", target.id),
    // new Job("weaken", target.id)
  ]

  for(let b of batch){
    port.write(JSON.stringify(b))
  }
  // port.write(JSON.stringify(new Job()))

  // HWGW
  while(true){
    await msg.nextWrite()
    const m = msg.read()
    ns.tprint(m)
  }
}
