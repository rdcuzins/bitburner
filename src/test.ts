import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const work = ns.getPortHandle(3);
  work.clear();
  const target = ns.args[0].toString();
  const tGrow = ns.getGrowTime(target);
  const tWeak = ns.getWeakenTime(target);
  const maxMoney = ns.getServerMaxMoney(target);
  const greed = 0.1;

  if (ns.getServerMaxMoney(target) > ns.getServerMoneyAvailable(target)) {
    let threads: number = 1;
    if (ns.fileExists("Formulas.exe")) {
      threads = ns.formulas.hacking.growThreads(
        ns.getServer(target),
        ns.getPlayer(),
        ns.getServerMaxMoney(target)
      );
    } else {
      const hackThreads = Math.floor(
        ns.hackAnalyzeThreads(target, maxMoney * greed)
      );
      const growth = Math.ceil(
        maxMoney / (maxMoney - ns.getServerMoneyAvailable(target))
      );
      threads = Math.ceil(ns.growthAnalyze(target, growth));
      ns.tprint(threads);
    }

    stat(ns, target, "grow", threads);
    ns.tprintf(
      "Growing for %.2fm with %f thread(s)...",
      tGrow / 60000,
      threads
    );
    ns.exec("rkit/grow.js", "p-1", { threads }, target, 0);

    while (work.peek() !== "FIN") {
      await work.nextWrite();
      ns.tprintf(work.read());
    }
    stat(ns, target, "grow", threads);
  }

  if (
    ns.getServerMinSecurityLevel(target) < ns.getServerSecurityLevel(target)
  ) {
    let wThreads = 1;
    while (
      ns.getServerSecurityLevel(target) - ns.weakenAnalyze(wThreads) >
      ns.getServerMinSecurityLevel(target)
    ) {
      wThreads++;
    }
    stat(ns, target, "weaken", wThreads);
    ns.tprintf(
      "Weakening for %.2fm with %f thread(s)...",
      tWeak / 60000,
      wThreads
    );

    ns.exec("rkit/weaken.js", "p-1", { threads: wThreads }, target, 0);

    while (work.peek() !== "FIN") {
      await work.nextWrite();
      ns.tprintf(work.read());
    }

    stat(ns, target, "weaken", wThreads);
  }
  stat(ns, target, "grow", 0);
  stat(ns, target, "weaken", 0);
}

const stat = (
  ns: NS,
  target: string,
  action: "grow" | "weaken",
  threads: number
): void => {
  if (action == "grow") {
    ns.tprintf(
      ns.vsprintf("[%s] - <%s> %ft (%s/%s)", [
        target,
        action,
        threads,
        parseInt(
          ns.getServerMoneyAvailable(target).toFixed(0)
        ).toLocaleString(),
        ns.getServerMaxMoney(target).toLocaleString(),
      ])
    );
  } else {
    ns.tprintf(
      ns.vsprintf("[%s] - <%s> %ft (%.2f/%d)", [
        target,
        action,
        threads,
        ns.getServerSecurityLevel(target),
        ns.getServerMinSecurityLevel(target),
      ])
    );
  }
};
