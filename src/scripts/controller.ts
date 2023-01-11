import { NS } from "@ns"

export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL")
        // Infinite loop that continously hacks/grows/weakens the target server
    const localhost = ns.getHostname()
    const pHandlerTarget = ns.getPortHandle(1)
    const pHandlerAction = ns.getPortHandle(2)
    let lastAction = ''

    while(true) {
        let target = localhost
        if(!pHandlerTarget.empty()) target = pHandlerTarget.peek().toString()
        const moneyThresh = ns.getServerMaxMoney(target) * 0.75;
        const securityThresh = ns.getServerMinSecurityLevel(target) + 5;


        if (ns.getServerSecurityLevel(target) > securityThresh) {
        // If the server's security level is above our threshold, weaken it
            pHandlerAction.clear()
            pHandlerAction.write('weaken')
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
        // If the server's money is less than our threshold, grow it
            pHandlerAction.clear()
            pHandlerAction.write('grow')
        } else {
        // Otherwise, hack it
            pHandlerAction.clear()
            pHandlerAction.write('hack')
        }

        let newAction = pHandlerAction.peek()
        if(newAction != lastAction) {
            lastAction = newAction.toString()
            ns.toast(`Action: ${pHandlerAction.peek()} | Target: ${pHandlerTarget.peek()}`)
        }
        await ns.sleep(2000)
    } 
}