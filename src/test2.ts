import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  let memAvail = 10;
  let cost = 2.9;
  while (memAvail % cost > 0 && memAvail - cost > 0) {
    memAvail -= cost;
    ns.tprintf("Mem Left: %s", memAvail);
    await ns.sleep(500);
  }
}
