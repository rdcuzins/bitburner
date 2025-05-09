import { NS } from "@ns";

export const PORT_LOGGER = 2;
export const LOG_FILE = "log.txt";

export async function main(ns: NS): Promise<void> {
  const port = ns.getPortHandle(PORT_LOGGER);
  port.clear();

  ns.disableLog("ALL");
  ns.clearLog();
  if (!ns.fileExists(LOG_FILE)) ns.write(LOG_FILE, "", "w");
  ns.ui.openTail();

  ns.print("Initialized Logger");
  port.write("init"); // Not sure why first port write is ignored. This is a fix
  while (true) {
    await port.nextWrite();
    while (port.peek() !== "NULL PORT DATA") {
      const data = port.read();
      ns.print(data);
    }
  }
}
