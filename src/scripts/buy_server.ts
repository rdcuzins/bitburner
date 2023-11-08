import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const { money } = ns.getPlayer()
  const price = ns.getPurchasedServerCost(32)
  const servers = ns.getPurchasedServers()

  if(servers.length >= ns.getPurchasedServerLimit()) {
    ns.tprint("At Maximum Purchased Servers!")
    return
  }

  if(money >= price) {
    let s = ns.purchaseServer(`s${servers.length}`, 32)
    ns.tprint(`Purchased Server: ${s}`)
  } else {
    ns.tprint("Not enough money to purchase server.")
  }
}