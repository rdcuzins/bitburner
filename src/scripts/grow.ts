import { NS } from "@ns"

export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL")
    const target = ns.peek(1).toString()
    await ns.grow(target)
    ns.spawn('/scripts/listener.js')
}