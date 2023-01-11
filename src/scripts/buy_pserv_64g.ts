import { NS } from "@ns"

export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL")
    const ram = 64
    const cost = ns.getPurchasedServerCost(ram)
    let count = ns.getPurchasedServers().length

    while(ns.getPlayer().money >= cost && ns.getPurchasedServerLimit() > count) {
        ns.purchaseServer(`pserv-${count++}`, ram)
    }
}