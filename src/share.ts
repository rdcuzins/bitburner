import { NS } from "@ns";
import { getTargets } from "./lib/scan";

export async function main(ns: NS): Promise<void> {
  let scripts = 0;
  const targets = getTargets(ns);
  targets.forEach((t) => {
    if (ns.hasRootAccess(t)) {
      const mem = ns.getServerMaxRam(t);
      let threads = Math.floor(mem / 4);
      if (threads == 0) threads = 1;
      if (mem % 4) threads = threads - 1;

      for (let i = 0; i < threads; i++) {
        ns.exec("rkit/share.js", t);
        scripts++;
      }
    }
  });
  ns.tprintf("Number of scripts running: %d", scripts);
}
