import { NS } from "@ns";
import { getNewTarget, HostStats, binaries } from "/lib/utils";

const infect = (ns: NS, target: string) => {
  for(let b of binaries){
    if(ns.fileExists(b, "home")){
      switch(b){
        case "BruteSSH.exe":
          ns.brutessh(target)
          break
        case "FTPCrack.exe":
          ns.ftpcrack(target)
          break
        case "relaySMTP.exe":
          ns.relaysmtp(target)
          break
        case "HTTPWorm.exe":
          ns.httpworm(target)
          break
        case "SQLInject.exe":
          ns.sqlinject(target)
          break
      }
    }
  }
  ns.nuke(target)
  ns.tprint(`Rooted: ${target}`)
}

export async function main(ns: NS): Promise<void> {
  const { skills } = ns.getPlayer()
  const hackLevel = skills.hacking
  const targets: HostStats[] = JSON.parse(ns.read("hosts.txt"))
  let binCount = 0

  for(let b of binaries){
    if(ns.fileExists(b, "home")) binCount++
  }

  for(let t of targets) {
    const { id, hackReq, portsReq, rooted } = t
    if(hackReq <= hackLevel && portsReq <= binCount && !rooted){
      infect(ns, id)
    }
  }
  ns.run("/scripts/refresh_db.js")
}