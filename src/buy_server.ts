import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const examples =  `64 128 256 512 1024 2048 4096 8192 16384 32768 65536`
  ns.tprintf("Possible Examples: %s", examples)
  let serverCount = ns.getPurchasedServers().length;
  let ram = 64
  if (ns.args.length > 0) ram = parseInt(ns.args[0].toString())

  const cost = ns.getPurchasedServerCost(ram);
  let host = ""
  if (ns.getPlayer().money > cost) {
    if (serverCount == 25) {
      ns.tprint("Max Servers Reached");
      const foundReplace = ns.getPurchasedServers().find(s => {
        return ns.getServerMaxRam(s) < ram
      })
      if (foundReplace !== undefined) {
        ns.tprintf("deleting %s", foundReplace)
        ns.deleteServer(foundReplace)
        host = ns.purchaseServer(foundReplace, ram)
      }
    } else {
      host = ns.purchaseServer(`p-${++serverCount}`, ram);
    }
    if (host !== "") ns.scp("lib/share.js", host);
    ns.tprintf("Purchased Server [%s ram]%s for %s", ram, host, parseInt(cost.toFixed(0)).toLocaleString('en-US'))
  } else {
    ns.tprintf("Not enough money. Need %s for %s ram", parseInt(cost.toFixed(0)).toLocaleString('en-US'), ram)
  }
}
