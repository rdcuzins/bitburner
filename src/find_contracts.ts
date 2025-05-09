import { NS } from "@ns";
import { getTargets } from "./lib/scan";
import { solveRLE } from "./lib/cct";

export async function main(ns: NS): Promise<void> {
  const targets = getTargets(ns);

  targets.forEach((t) => {
    const contracts = ns.ls(t, ".cct");
    contracts.forEach((c) => {
      const contract = ns.codingcontract.getContract(c, t);
      if (contract.type == "Compression I: RLE Compression") {
        const solution = solveRLE(ns, contract.data);
        const msg = contract.submit(solution);
        ns.tprintf(msg);
      } else {
        ns.tprintf("Found Contract %s on %s type %s", c, t, contract.type);
      }
    });
  });
}
