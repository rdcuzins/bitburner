import { NS, BasicHGWOptions } from "@ns";
import { PORT_LOGGER } from "/logger";
import { Ports } from "/lib/globals";

export async function main(ns: NS): Promise<void> {
  const log = ns.getPortHandle(Ports.Log);
  const work = ns.getPortHandle(Ports.Worker);
  if (ns.args.length < 2) {
    ns.tprint("Usage: weaken.js <target> <delay>");
    return;
  }

  const target = ns.args[0].toString();
  const delay: number = parseInt(ns.args[1].toString());

  const opts = <BasicHGWOptions>{
    additionalMsec: delay,
  };

  log.write(Date.now() + " - run weaken with delay " + delay);
  await ns.weaken(target, opts);
  log.write(Date.now() + " - weaken finished");
  work.write("FIN");
}
