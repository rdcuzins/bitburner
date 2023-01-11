import { NS } from "@ns"

export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL")
    const pHandleTarget = ns.getPortHandle(1)
    const pHandleAction = ns.getPortHandle(2)
    const localhost = ns.getHostname()

    while(true) {
        await ns.sleep(3000)
        if(pHandleTarget.empty() || pHandleAction.empty()) continue 
        const action = pHandleAction.peek()
        const script = `/scripts/${action}.js`
        const threads = Math.floor(ns.getServerMaxRam(localhost)/ns.getScriptRam(script))

        await ns.spawn(`/scripts/${action}.js`, threads)
    }
}