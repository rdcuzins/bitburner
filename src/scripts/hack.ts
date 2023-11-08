import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const port = ns.getPortHandle(1)
  const msg = ns.getPortHandle(2)

  while(true){
    await port.nextWrite()
    const pData = port.peek().toString()
    const {target, hTime} = JSON.parse(pData)

    const start = Date.now()
    msg.write(`Starting Hack Now`)
    await ns.hack(target.id)
      .then(() => msg.write(
        `HACK finished: ${Date.now() - start}`
      ))
  }
}