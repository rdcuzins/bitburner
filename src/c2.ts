import { NS, Server } from "@ns";
import { Ports } from "./lib/globals";
import { ZNet } from "./lib/znet";

class RamNet {
  public servers: Server[] = [];

  constructor(private ns: NS) {}

  public add(s: Server) {
    const found = this.servers.indexOf(s);
    if (found !== -1) {
      this.servers[found] = s;
    } else {
      this.servers.push(s);
    }
  }

  public get total(): number {
    let total = 0;
    this.servers.forEach((s) => {
      total += s.maxRam - s.ramUsed;
    });
    return total;
  }
}

const PORT_LOGGER = 2;
const PORT_WORKER = 3;

const SCRIPTS = [
  "lib/hack.js",
  "lib/weaken.js",
  "lib/grow.js",
  "lib/weaken.js",
];

enum Types {
  Hack,
  Weaken1,
  Grow,
  Weaken2,
}
class Job {
  constructor(
    public type: Types,
    public target: string,
    public end: number,
    public report: number = PORT_WORKER,
    public threads: number = 1
  ) {}
}

export async function main(ns: NS): Promise<void> {
  let target = "n00dles";
  let threads = 1;
  const greed = 0.5;
  const log = ns.getPortHandle(Ports.Log);
  const work = ns.getPortHandle(Ports.Worker);
  work.clear();

  if (ns.args.length > 0) target = ns.args[0].toString();
  if (ns.args.length > 1) threads = parseInt(ns.args[1].toString());
  if (!ns.scriptRunning("logger.js", "home")) ns.exec("logger.js", "home");

  const maxMoney = ns.getServerMaxMoney(target);

  await ns.sleep(1000);

  let i = 1;
  let workCount = 0;
  while (true) {
    let tHack = ns.getHackTime(target);
    let tWeak = tHack * 4;
    let tGrow = tHack * 3.2;
    //const hacked = ns.hackAnalyze(target) * 100 * 100;
    //const percent = maxMoney - hacked;
    //ns.tprintf("hacked: %.2f, diff: %s", hacked, percent);
    //let tGrow = ns.getGrowTime(target);
    let pad = 20;

    let eTime = ((tWeak + pad) / (1000 * 60)).toFixed(2);
    log.write("==============================================");
    log.write(
      ns.vsprintf("(%sm)[%s] before batch [%s]: (%s/%s) - %s/%s", [
        eTime,
        target,
        i,
        ns.getServerSecurityLevel(target).toFixed(0),
        ns.getServerMinSecurityLevel(target),
        parseInt(
          ns.getServerMoneyAvailable(target).toFixed(2)
        ).toLocaleString(),
        parseInt(ns.getServerMaxMoney(target).toFixed(2)).toLocaleString(),
      ])
    );

    const hPercent = ns.hackAnalyze(target);
    const amount = maxMoney * greed;
    const hThreads = Math.max(
      Math.floor(ns.hackAnalyzeThreads(target, amount)),
      1
    );
    const tGreed = hPercent * hThreads;
    const gThreads = Math.ceil(
      ns.growthAnalyze(target, maxMoney / (maxMoney - maxMoney * tGreed))
    );
    const weaken1 = Math.max(Math.ceil((hThreads * 0.002) / 0.05), 1);
    const weaken2 = Math.max(Math.ceil((gThreads * 0.004) / 0.05), 1);

    let start = Date.now();
    ns.exec(
      "zed/hack.js",
      "p-1",
      { threads: hThreads },
      target,
      tWeak - tHack - pad
    );
    ns.exec("zed/weaken.js", "p-1", { threads: weaken1 }, target, 0);
    ns.exec("zed/grow.js", "p-1", { threads: gThreads }, target, tWeak - tGrow);
    ns.exec("zed/weaken.js", "p-1", { threads: weaken2 }, target, pad);

    while (workCount < 4) {
      await work.nextWrite();
      while (work.read() !== "NULL PORT DATA") {
        workCount++;
      }
    }
    log.write(
      ns.vsprintf("Batch %d completed in %ss", [i, (Date.now() - start) / 1000])
    );
    i++;
    workCount = 0;
  } // End Loop
}
const fTime = (ns: NS, t: number): String => {
  return `${t.toFixed(2)}s`;
};
