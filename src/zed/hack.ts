import { NS, BasicHGWOptions } from "@ns";
import { Ports } from "/lib/globals";

export async function main(ns: NS): Promise<void> {
  const log = ns.getPortHandle(Ports.Log);
  const work = ns.getPortHandle(Ports.Worker);

  if (ns.args.length < 2) {
    ns.tprint(ns.args);
    ns.tprint("Usage: hack.js <target> <delay>");
    return;
  }

  const target = ns.args[0].toString();
  const delay: number = parseInt(ns.args[1].toString());

  const opts = <BasicHGWOptions>{
    additionalMsec: delay,
  };

  log.write(Date.now() + " - run hack with delay " + delay);
  const stolen = await ns.hack(target, opts);
  log.write(
    Date.now() +
      " - hack finished, stole " +
      parseInt(stolen.toFixed(0)).toLocaleString()
  );
  work.write("FIN");
}
