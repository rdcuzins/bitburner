import { NS } from "@ns"

export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL")
    ns.tail()

    const target = getTarget(ns)

    while (true) {
        let {
            moneyAvailable,
            moneyMax,
            serverGrowth,
        } = ns.getServer(target)

        let minSec = ns.getServerMinSecurityLevel(target)
        let secLvl = ns.getServerSecurityLevel(target)

        ns.clearLog()
        ns.print(`
        TARGET: ${target}\n
        mAvailable: ${moneyAvailable}\n
        mMax: ${moneyMax}\n
        growth: ${serverGrowth}\n
        secLvl: ${secLvl}\n
        minSec: ${minSec}\n
        `)

        let reqThreads = (secLvl - minSec) / .05
        ns.print(reqThreads)
        await ns.sleep(1000)
    }

}

function getTarget(ns: NS) {
    const data = ns.read('hosts.txt')
    const hosts = data.split('\n')
    let bestTarget = 'n00dles'
    for (let i = 0; i < hosts.length; i++) {
        const target = hosts[i]
        if (target == '') continue
        const {
            moneyMax,
            requiredHackingSkill
        } = ns.getServer(target)

        if (requiredHackingSkill > (ns.getHackingLevel() / 2)) continue
        if (moneyMax > ns.getServer(bestTarget).moneyMax) {
            bestTarget = target
        }
    }

    return bestTarget
   
}