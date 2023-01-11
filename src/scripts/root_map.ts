import { NS } from "@ns"

export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL")
    const args = ns.flags([['loop', false]])
    const servers = new Set(['home'])
    const pwned: string[] = []
    let properTarget = 'n00dles'
    const pHandler = ns.getPortHandle(1)

    const files = [
        '/scripts/weaken.js',
        '/scripts/grow.js',
        '/scripts/hack.js',
        '/scripts/listener.js'
    ]

    scanAll(ns, 'home', servers)

    do {
        for(const s of servers){
            if (s == 'home') continue
            if(await bruteNuke(ns, s)) {
                if(!pwned.includes(s)) {
                    await ns.scp(files, s)
                    ns.exec('/scripts/listener.js', s)
                    pwned.push(s)
                }
            }
        }
    
        for(const s of pwned) {
            const {
                moneyMax,
                requiredHackingSkill
            } = ns.getServer(s)
    
            if(requiredHackingSkill > (ns.getHackingLevel() / 2)) continue
            if(moneyMax > ns.getServer(properTarget).moneyMax) {
                properTarget = s
                ns.toast(`Target Set: ${properTarget}`)
                pHandler.clear()
                pHandler.write(s)
            }
        }
    
        if(ns.fileExists('hosts.txt')) ns.rm('hosts.txt')
        for(let i = 0; i < pwned.length; i++){
            ns.write('hosts.txt', `${pwned[i]}\n`, 'a')
        }

        if(pHandler.empty()) pHandler.write(properTarget)
        await ns.sleep(3000)
    } while(args.loop)
}

async function bruteNuke(ns: NS, target: string) {
    const info = ns.getServer(target)    
    const hackingLevel = ns.getHackingLevel()
    let openPorts = 0
    const {
        hasAdminRights,
        requiredHackingSkill,
        numOpenPortsRequired
    } = info

    if (hackingLevel < requiredHackingSkill) return false
    if (hasAdminRights) return true

    if(ns.fileExists('BruteSSH.exe')){
        await ns.brutessh(target)
        openPorts++
    }

    if(ns.fileExists('FTPCrack.exe')){
        await ns.ftpcrack(target)
        openPorts++
    }

    if(ns.fileExists('HTTPWorm.exe')){
        await ns.httpworm(target)
        openPorts++
    }

    if(ns.fileExists('SQLInject.exe')){
        await ns.sqlinject(target)
        openPorts++
    }

    if(ns.fileExists('relaySMTP.exe')){
        await ns.relaysmtp(target)
        openPorts++
    }

    if(openPorts >= numOpenPortsRequired){
        await ns.nuke(target)
    }

    return ns.getServer(target).hasAdminRights
}

function scanAll(ns: NS, host: string, servers: Set<string>) {
    const neighbors = ns.scan(host)
    for(let i = 0; i < neighbors.length; i++){
        if(!servers.has(neighbors[i])){
            servers.add(neighbors[i])
            scanAll(ns, neighbors[i], servers)
        }
    }
}