import { NS } from "@ns";
import { Target, getTargets } from "lib/scan";
import { nuke } from "lib/nuke";

export async function main(ns: NS): Promise<void> {
  const items = getTargets(ns);
  items.forEach((i) => nuke(ns, i));
  const rootedTargets = items.filter((i) => ns.hasRootAccess(i));
  let bestTarget = new Target(ns, "n00dles").update();
  rootedTargets.forEach((t) => {
    const newTarget: Target = new Target(ns, t).update();
    if (bestTarget.score && newTarget.score)
      if (bestTarget.score < newTarget.score) bestTarget = newTarget;
  });
  ns.tprintf("Best Target: %s", bestTarget.name);
}
