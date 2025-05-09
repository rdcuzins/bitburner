import { NS } from "@ns";
import { ZNet, ZNetPortData, Actions } from "./lib/znet";
import type { Action } from "./lib/znet";
import { Ports } from "./lib/globals";

let flags;
export async function main(ns: NS): Promise<void> {
  const help = (ns: NS) => {
    const txt = `
    znet.js is a tool used to interact with the ZombieNet.

    Usage: znet.js [-d] [-p] [-i <host>] [-a <action>]
    
    Flags:

      -d, --daemon          Runs script in a loop listening to Ports.Znet for commands. 
                            Also runs pestilence every 5 minutes trying to infect more servers.
      -p, --pestilence      Searches for all Servers and roots them. They're added to zombies collection and copies files.
      -i, --infect <host>   Infects <host>, fully rooting and copying files.
      -a, --action <action> Runs a specific action.
      -T, --target          Displays optimal target in Znet collection.
      -h, --help            Display this information.


    Actions:

      - prep [target]   Prepares target for optimal state for HWGW batches. If target is ommited, uses optimal target.
      - rot             Consumes all of Zombie memory to run ns.share() forever.
      - kill            Kills all scripts running on all zombies.

    Examples:

    Run znet in daemon mode (this also runs znet.pestilence() every minute):
      znet.js -d
  `;
    ns.tprint(txt);
    ns.exit();
  };

  ns.disableLog("ALL");
  let pZnet = ns.getPortHandle(Ports.Znet);

  flags = ns.flags([
    ["help", false],
    ["h", false],
    ["d", false],
    ["daemon", false],
    ["i", ""],
    ["infect", ""],
    ["p", false],
    ["pestilence", false],
    ["a", []],
    ["action", []],
    ["T", false],
    ["target", false],
  ]);

  if (flags["help"] || flags["h"]) help(ns);

  const zNet = new ZNet(ns);
  let intervalID: number = -1;
  ns.atExit(() => {
    zNet.save();
    if (intervalID) clearInterval(intervalID);
  });

  if (flags["i"] || flags["infect"]) {
    const host = flags["i"] || flags["infect"];
    zNet.infect(host.toString());
  } // End Infectiong

  if (flags["p"] || flags["pestilence"]) {
    zNet.pestilence();
  }

  // BUG: cant seem to pass target
  if ((flags["a"] as string[]).length || (flags["action"] as string[]).length) {
    const flag = (flags["a"] as string[]) || (flags["a"] as string[]);
    const action: string = flag[0];
    switch (action) {
      case Actions.Rot: {
        zNet.rot();
        break;
      }
      case Actions.Prep:
        if (flag.length > 1) {
          // BUG: flag.length is never > 1 for some reason.
          await zNet.prep(zNet.getZombie("joesguns"));
        } else {
          await zNet.prep(zNet.getZombie("joesguns"));
        }
        break;

      case Actions.Kill:
        if (!zNet.kill())
          ns.tprintf("ERROR: Something went wrong killing all scripts.");
        break;
      default:
        ns.tprintf("ERROR: znet action '%s' not found.", action);
    }
  } // End Actions

  if (flags["T"] || flags["target"]) {
    ns.tprintf("Optimal target: %s", zNet.getZombie("joesguns")?.toString());
  }
  if (flags["d"] || flags["daemon"]) {
    intervalID = setInterval(() => {
      zNet.pestilence();
    }, 1000 * 60 * 5);
    ns.tprint("ZNet Running in Daemon Mode.");
    while (true) {
      await pZnet.nextWrite();
      while (pZnet.peek() !== "NULL PORT DATA") {
        const portData: ZNetPortData = JSON.parse(pZnet.read());
        ns.tprint("Not Implemented.");
      }
    }
  } // End Daemon Mode

  ns.tprintf(zNet.toString());
}
