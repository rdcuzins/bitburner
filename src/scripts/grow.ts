import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const port = ns.getPortHandle(1)
  const msg = ns.getPortHandle(2)

  while(true){
    await port.nextWrite()
    const pData = port.peek().toString()
    const {target, wTime} = JSON.parse(pData)

    const start = Date.now()
    msg.write(`Starting GROW w/ delay of ${wTime + 500}`)
    await ns.grow(target.id, {additionalMsec: wTime + 500})
      .then(() => msg.write(
        `GROW finished: ${Date.now() - start}`
      ))
  }
}