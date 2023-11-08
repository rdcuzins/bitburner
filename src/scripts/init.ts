import { NS } from "@ns";
import { getNewTarget, HostStats, seconds } from "/lib/utils";

// HWGW
export async function main(ns: NS): Promise<void> {
  ns.disableLog("ALL")
  const player = ns.getPlayer()
  if(!ns.fileExists('hosts.txt')) ns.run("/scripts/refresh_db.js")
  const hosts: HostStats[] = JSON.parse(ns.read('hosts.txt'))
  const target = getNewTarget(hosts, player)
  ns.tprint(`Targeting ${target.id}`)

  let loopfix = 9999
  const available = () => ns.getServerMoneyAvailable(target.id)
  const secLevel = () => ns.getServerSecurityLevel(target.id)

  while(available() < target.maxMoney && loopfix){
    const time = seconds(ns.getGrowTime(target.id))

    ns.print(`Target too poor (${Math.floor(available())}/${target.maxMoney}):\n  Growing (${time}s)...`)
    await ns.grow(target.id)
    loopfix--
  }

  while(secLevel() > target.minSec && loopfix){
    const time = seconds(ns.getGrowTime(target.id))

    ns.print(`Target too secure (${Math.floor(secLevel())}/${target.minSec}):\n  Weakening (${time}s)...`)
    await ns.weaken(target.id)
    loopfix--
  }

  ns.print(`Prep complete on target: ${target.id}`)

// HWGW
  while(loopfix) {
    const t1 = seconds(ns.getHackTime(target.id))
    ns.print(`Hacking... (${t1}s)`)
    await ns.hack(target.id)
    const t2 = seconds(ns.getWeakenTime(target.id))
    ns.print(`Weakening_1... (${t2}s)`)
    await ns.weaken(target.id)
    const t3 = seconds(ns.getGrowTime(target.id))
    ns.print(`Growing... (${t3}s)`)
    await ns.grow(target.id)
    const t4 = seconds(ns.getWeakenTime(target.id))
    ns.print(`Weakening_2... (${t4}s)`)
    await ns.weaken(target.id)
    loopfix--
  }

  if(!loopfix) ns.tprint("LoopFixed")
}