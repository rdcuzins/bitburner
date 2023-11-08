import { Player } from "/../NetscriptDefinitions"

export type HostStats = {
  id:       string,
  maxMoney: number,
  minSec:   number,
  hackReq:  number,
  score:    number,
  portsReq: number,
  rooted:   boolean
}

export type JobItem = {
  target: HostStats,
  wTime: number,
  hTime: number,
  gTime: number
}

export const getNewTarget = (hosts: HostStats[], player: Player): HostStats => {
    let target: HostStats = hosts[0]
    for(let h of hosts) {
      if(h.score > target.score && h.rooted) target = h
    }
    return target
}

export const seconds = (t: number): number => {
  return Math.round((t/1000) * 100)/100
}

export const binaries: string[] = [
  "BruteSSH.exe",
  "FTPCrack.exe",
  "relaySMTP.exe",
  "HTTPWorm.exe",
  "SQLInject.exe"
]