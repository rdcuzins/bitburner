import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const msg = ns.getPortHandle(2)
  const { target, delay } = JSON.parse(ns.args[0].toString())

  const start = Date.now()
  msg.write(`${start}: Starting WEAKEN w/ delay of ${delay}`)
  await ns.weaken(target, {additionalMsec: delay})
    .then(() => msg.write(
      `Weaken finished: ${Date.now() - start}`
    ))
}