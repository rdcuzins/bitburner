import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  if(ns.args.length < 1) {
    ns.tprint("Missing Required Parameter")
    return
  }
  const target: string = ns.args[0].toString()
  const scripts = [
    "infection",
    "grow",
    "weaken",
    "hack",
    "slave"
  ]
  ns.scp(scripts.map(s => `/scripts/${s}.js`), target)
  ns.exec('/scripts/slave.js', target)
}