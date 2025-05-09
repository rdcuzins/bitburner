import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const places = ns.infiltration.getPossibleLocations();
  places.forEach((p) => {
    ns.tprintf("%s in %s", p.name, p.city);
    ns.tprint(ns.infiltration.getInfiltration(p.name));
  });
}
