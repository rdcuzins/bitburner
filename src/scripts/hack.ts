import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const msg = ns.getPortHandle(2)
  const { target, delay } = JSON.parse(ns.args[0].toString())
  const start = Date.now()

  msg.write(`${start}: Starting Hack Now`)
  await ns.hack(target, { additionalMsec: delay})
    .then(() => msg.write(
      `HACK finished: ${Date.now() - start}`
    ))
  }