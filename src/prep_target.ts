import { NS } from "@ns";
import { getRootedTargets } from "./lib/scan";

export async function main(ns: NS): Promise<void> {
  let target = "n00dles";
  const log = ns.getPortHandle(2);
  if (ns.args.length > 0) {
    target = ns.args[0].toString();
  }
  const maxMoney = ns.getServerMaxMoney(target);
  const minSec = ns.getServerMinSecurityLevel(target);

  let growthThreads = 0;
  let time = 0;
  while (true) {
    const moneyAvail = ns.getServerMoneyAvailable(target);
    const secLv = ns.getServerSecurityLevel(target);

    if (moneyAvail >= maxMoney && secLv <= minSec) {
      ns.tprintf(
        "[%s] prepped: (%s/%s) - %s / %s",
        target,
        secLv,
        minSec,
        parseInt(moneyAvail.toFixed(2)).toLocaleString(),
        maxMoney.toLocaleString()
      );
      break;
    }

    log.write("prepping...");
    if (moneyAvail < maxMoney || secLv > minSec) {
      growthThreads = Math.ceil(
        ns.growthAnalyze(target, maxMoney / moneyAvail)
      );
      time = ns.getGrowTime(target);

      const rooted = getRootedTargets(ns);
      rooted.forEach((r) => {
        let mem = Math.floor(
          (ns.getServerMaxRam(r.name) - ns.getServerUsedRam(r.name)) / 2
        );
        if (mem < 1) mem = 1;

        if (growthThreads <= 0) {
          // Weaken
          ns.exec("rkit/weaken.js", r.name, { threads: mem }, target, 0);
        } else {
          // Growth
          if (growthThreads - mem < 0) {
            mem = growthThreads;
          }
          ns.exec("rkit/grow.js", r.name, { threads: mem }, target, 0);
          growthThreads -= mem;
        }
      });
      ns.tprintf("Threads Left: %s", growthThreads);
      ns.tprintf(
        "Money: %s / %s",
        parseInt(
          ns.getServerMoneyAvailable(target).toFixed(2)
        ).toLocaleString(),
        maxMoney.toLocaleString()
      );
    }
    ns.tprintf(
      "(%sm)[%s] - %s/%s",
      (time / (1000 * 60)).toFixed(2),
      target,
      parseInt(moneyAvail.toFixed(0)).toLocaleString(),
      maxMoney.toLocaleString()
    );
    await ns.sleep(time);
  }
}
