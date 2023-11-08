import { NS } from "@ns";
import type { HostStats } from "/lib/utils";

export async function main(ns: NS): Promise<void> {
  const db_file: string = "hosts.txt"
  const newHosts: string[] = ["home"]
  const scannedHosts: HostStats[] = []
  const hackLevel = ns.getHackingLevel()

  const updateStats = (h: string) => {
      const id = h
      const maxMoney = ns.getServerMaxMoney(h)
      const minSec   = ns.getServerMinSecurityLevel(h)
      const hackReq  = ns.getServerRequiredHackingLevel(h)
      const score    = (hackReq <= (hackLevel / 2)) ? (maxMoney / minSec) : -1
      const portsReq = ns.getServerNumPortsRequired(h)
      const rooted   = ns.hasRootAccess(h)
      const stats: HostStats = { id, maxMoney, minSec, hackReq, score, portsReq, rooted }
      scannedHosts.push(stats)
  }

  while(newHosts.length > 0){
    const host = newHosts.pop()
    for(let nh of ns.scan(host)){
      const exists = scannedHosts.find((h) => h.id === nh)
        if(!exists) {
          // NOTE: weird issue when trying to exclue '.' host name
          newHosts.push(nh)
          updateStats(nh)
        }
    }
  }

  ns.write(db_file, JSON.stringify(scannedHosts), "w")
}