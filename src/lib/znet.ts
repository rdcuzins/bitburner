import { NS } from "@ns";
import { Col } from "./globals";

export interface ZNetPortData {
  action: string;
}

export type Action = Actions | string;

export enum Actions {
  Prep = "prep",
  Rot = "rot",
  Kill = "kill",
}

export enum Files {
  Share = "zed/share.js",
  Hack = "zed/hack.js",
  Grow = "zed/grow.js",
  Weaken = "zed/weaken.js",
  Globals = "lib/globals.js",
}
/**
 * List of files that should be coppied from home server to the Zombified machine.
 */
const INFECTION_FILES: string[] = [
  Files.Share,
  Files.Hack,
  Files.Grow,
  Files.Weaken,
  Files.Globals,
];

/**
 * Znet is a ZombieNet which stores and manages RAM across all zombies.
 */
export class ZNet {
  /**
   * Stored Rooted Servers i.e Zombies.
   */
  public zombies: Zombie[] = [];
  public totalMaxRam: number = 0;

  constructor(
    private ns: NS,
    public db: string = "db/znet.json",
    loadDB: boolean = true
  ) {
    ns.disableLog("ALL");
    if (loadDB) {
      if (!ns.fileExists(db)) return;
      const data: Zombie[] | "" = JSON.parse(ns.read(db));
      if (data)
        for (let i in data) {
          this.zombies.push(new Zombie(this.ns, data[i].name));
        }
    }

    for (let i in this.zombies) {
      this.totalMaxRam += this.zombies[i].maxRam;
    }
  }

  /**
   * Wrapper property to return player's current hack level.
   */
  public get hackLvl(): number {
    return this.ns.getHackingLevel();
  }

  /**
   * Returns the best Zombie for targeting with HWGW batches.
   */
  public get target(): Zombie {
    if (this.zombies.length === 0) return new Zombie(this.ns, "n00dles");
    let t: Zombie = this.zombies[0];
    this.zombies.forEach((z) => {
      if (z.score > t.score) t = z;
    });
    return t;
  }

  /**
   * Add zombie to ZombieNet. Keeps track of available ram and other usage.
   * @param newZombie Server Name as a string or an already zombified server.
   */
  public add(newZombie: Zombie) {
    const zExists = this.zombies.find((z) => {
      if (typeof newZombie === "string") return z.name === newZombie;
      return z.name === newZombie.name;
    });
    if (zExists) return;
    if (this.zombies.indexOf(newZombie) === -1) {
      this.zombies.push(newZombie);
      this.totalMaxRam += newZombie.maxRam;
      this.ns.tprintf("Zombified Host: %s", newZombie.toString());
    }
  }

  /**
   * Gets a Zombie if it exists in the horde.
   * @param host Hostname of server to find.
   * @returns Zombie if it exists, undefined otherwise.
   */
  public getZombie(host: string): Zombie | undefined {
    return this.zombies.find((z) => z.name === host);
  }

  /**
   * Save zombies to Znet.db file. Intended to use with ns.atExit().
   */
  public save() {
    const data = JSON.stringify(this.zombies);
    this.ns.write(this.db, data, "w");
  }

  /**
   * Spreads Zombie apocolypse. Will scan all machines and ensure all possible servers
   * are rooted and infected with INFECTION_FILES. This will also insure Zombie collection
   * is up to date.
   */
  public pestilence() {
    const allServers = this.findAllServers();
    allServers.forEach((s) => this.infect(s));
  }

  /**
   * Rot is just an alias for the ns.share() that gets ran on all
   * Zombies that exist in Znet collection.
   *
   * @Remarks
   * This WILL use the remaining RAM on ALL zombies.
   */
  public rot() {
    for (let i in this.zombies) {
      this.zombies[i].rot();
    }
  }

  /**
   * Infects target host. This runs all available exploits including NUKE.exe.
   * Then a new Zombie is created which causes Zombie.fester() to take place to copy
   * all INFECTION_FILES to newly rooted Zombie server.
   *
   * This will also add the newly created Zombie to the Zombies zerg collection.
   *
   * @param host Hostname of target server to fully Root using NUKE.exe.
   * @returns Zombie if infection was success otherwise false.
   */
  public infect(host: string): Zombie | false {
    if (this.hackLvl < this.ns.getServerRequiredHackingLevel(host))
      return false;
    if (this.ns.hasRootAccess(host)) {
      const zExists = this.zombies.find((z) => z.name === host);
      if (zExists) return zExists;
      const zed = new Zombie(this.ns, host);
      this.add(zed);
      return zed;
    }

    if (this.exploits(host) >= this.ns.getServerNumPortsRequired(host)) {
      this.ns.nuke(host);
      const zed = new Zombie(this.ns, host);
      this.add(zed);
      return zed;
    }

    return false;
  }

  /**
   * Exploits the target host based on available binaries on home.
   * @param host Name of server to run exploits on.
   * @returns The number of successful exploits ran on host.
   */
  private exploits(host: string): number {
    let exploits = 0;
    if (this.ns.fileExists("BruteSSH.exe")) {
      this.ns.brutessh(host);
      exploits++;
    }

    if (this.ns.fileExists("FTPCrack.exe")) {
      this.ns.ftpcrack(host);
      exploits++;
    }

    if (this.ns.fileExists("relaySMTP.exe")) {
      this.ns.relaysmtp(host);
      exploits++;
    }

    if (this.ns.fileExists("HTTPWorm.exe")) {
      this.ns.httpworm(host);
      exploits++;
    }

    if (this.ns.fileExists("SQLInject.exe")) {
      this.ns.sqlinject(host);
      exploits++;
    }

    return exploits;
  }

  public async prep(zombie?: Zombie) {
    let t = zombie || this.target;
    this.ns.tprintf(
      "<%.2fm> Prepping Target: %s",
      t.growTime / 60000,
      t.toString()
    );

    await this.weakenToMin(t);
    await this.growToMax(t);
    await this.weakenToMin(t, t.growTime - t.weakenTime + 1000);
  }

  private async weakenToMin(t: Zombie, delay: number = 0) {
    let threadsLeft = Math.ceil(t.weakenLeft / t.weakenAmmount);
    const wRamCost = this.ns.getScriptRam(Files.Weaken);

    while (threadsLeft > 0) {
      this.zombies.forEach((z) => {
        if (threadsLeft <= 0) return;
        let threads = Math.floor(z.ramAvailable / wRamCost);
        if (threads < 1) threads = 1;
        if (delay < 0) delay = 0;
        z.weaken(t, threads, delay);
        threadsLeft -= threads;
      });

      if (threadsLeft <= 0) break;
      this.ns.tprintf(
        "%s weaken threads left. Sleeping for %.2fm",
        threadsLeft,
        (t.weakenTime + 1000) / 60000
      );

      await this.ns.sleep(t.weakenTime + 1000);
    }
  }

  private async growToMax(t: Zombie, delay: number = 0) {
    const gRamCost = this.ns.getScriptRam(Files.Grow);
    //const growthAmmount = Math.ceil(t.maxMoney / (t.maxMoney - t.money));
    const growthAmmount = Math.ceil(
      t.maxMoney / this.ns.getServerGrowth(t.name)
    );

    this.ns.tprintf("growthAmmount: %s", growthAmmount);
    let gThreads = Math.ceil(this.ns.growthAnalyze(t.name, growthAmmount));

    while (gThreads > 0) {
      this.zombies.forEach((z) => {
        if (gThreads <= 0) return;
        if (z.ramAvailable >= gRamCost) {
          let threads = Math.floor(z.ramAvailable / gRamCost);
          if (threads < 1) threads = 1;
          z.feed(t, gThreads < threads ? gThreads : threads, delay);
          gThreads -= gThreads < threads ? gThreads : threads;
        }
      });

      if (gThreads <= 0) break;
      this.ns.tprint(t.toString());
      this.ns.tprintf(
        "%s grow threads left. Sleeping for %.2fm",
        gThreads,
        (t.growTime + 1000) / 60000
      );
      // TODO: use port response instead of raw sleep
      await this.ns.sleep(t.growTime + 1000);
    }
  }

  private findAllServers(): string[] {
    const allServers: string[] = [];

    const should_scan = (item: string | undefined): boolean => {
      if (item == undefined) return false;
      if (item == "home" || item == "." || allServers.indexOf(item) > -1) {
        return false;
      }
      return true;
    };

    let found: string[] = this.ns.scan("home");

    while (found.length > 0) {
      const item = found.shift();
      if (item == undefined) break;
      if (!should_scan(item)) continue;

      let nFound = this.ns.scan(item);
      found = found.concat(nFound);
      allServers.push(item);
    }
    return allServers;
  }

  public kill(host?: string): boolean {
    if (host) {
      const found = this.zombies.find((z) => z.name === host);
      if (found) return this.ns.killall(found.name);
      return false;
    }

    this.zombies.forEach((z) => this.ns.killall(z.name));
    return true;
  }

  public toString(): string {
    return `TotalMaxRam: ${this.totalMaxRam}, Zombies: ${this.zombies.length}`;
  }
} // End Znet

/**
 * Zombie representation of a rooted server. Holds helper functions.
 */
export class Zombie {
  #ns: NS;
  public maxMoney: number;
  public minSecurity: number;
  public requiredLvl: number;
  public maxRam: number;

  /**
   * Zombify a rooted server.
   * @param ns
   * @param name
   */
  constructor(ns: NS, public name: string) {
    this.#ns = ns;
    if (!ns.hasRootAccess(name))
      throw new Error("ERROR: Unable to Zombify '%s'. Server not rooted.");
    this.maxMoney = ns.getServerMaxMoney(name);
    this.minSecurity = ns.getServerMinSecurityLevel(name);
    this.requiredLvl = ns.getServerRequiredHackingLevel(name);
    this.maxRam = ns.getServerMaxRam(name);
    this.fester();
  }

  /**
   * Returns updated money available on zombie.
   */
  public get money(): number {
    return this.#ns.getServerMoneyAvailable(this.name);
  }

  public get ramAvailable(): number {
    return this.maxRam - this.#ns.getServerUsedRam(this.name);
  }
  /**
   * Returns updated security level of zombie.
   */
  public get securityLevel(): number {
    return this.#ns.getServerSecurityLevel(this.name);
  }

  /**
   * Returns how long it takes to weaken target.
   */
  public get weakenTime(): number {
    return this.#ns.getWeakenTime(this.name);
  }

  /**
   * Returns how long it takes to grow target.
   */
  public get growTime(): number {
    return this.#ns.getGrowTime(this.name);
  }

  /**
   * Returns the amount of security level left until minimum.
   */
  public get weakenLeft(): number {
    return this.securityLevel - this.minSecurity;
  }
  /**
   * Returns the amount of weaken with 1 thread.
   */
  public get weakenAmmount(): number {
    return this.#ns.weakenAnalyze(1);
  }
  /**
   * Returns how long it takes to hack target.
   */
  public get hackTime(): number {
    return this.#ns.getHackTime(this.name);
  }

  public feed(t: Zombie, threads: number, delay: number = 0) {
    this.#ns.exec(Files.Grow, this.name, { threads }, t.name, delay);
  }

  public weaken(t: Zombie, threads: number, delay: number = 0) {
    this.#ns.exec(Files.Weaken, this.name, { threads }, t.name, delay);
  }

  /**
   * Copies all files in INFECTION_FILES list to Zombified machine.
   * @returns true if all INFECTION_FILES were coppied successfuly and false otherwise.
   */
  public fester(): boolean {
    return this.#ns.scp(INFECTION_FILES, this.name, "home");
  }

  /**
   * Rot just executes ns.share() forever on Zombified host.
   */
  public rot() {
    const cost = this.#ns.getScriptRam("zed/share.js");
    while (this.ramAvailable - cost >= 0) {
      this.#ns.exec(Files.Share, this.name);
    }
  }

  /**
   * Returns a number representing the score weight of the Zombie.
   * This determins how well of a target it is compared to other Zombies for HWGW batch.
   *
   * The formula used is (serverMaxMoney / serverMinSecurity) if requiredHackLevel is half of player's.
   */
  public get score(): number {
    if (Math.floor(this.#ns.getHackingLevel() / 2) < this.requiredLvl) {
      return -1;
    } else {
      return this.maxMoney / this.minSecurity;
    }
  }

  public toString(): string {
    if (this.maxMoney === 0) return `${Col.Red + this.name + Col.Default}`;
    return `${Col.Red + this.name + Col.Default} ${
      Col.Cyan
    }<${this.securityLevel.toFixed(2)}/${this.minSecurity}> ${
      Col.Magenta
    }(${parseInt(
      this.money.toFixed(0)
    ).toLocaleString()}/${this.maxMoney.toLocaleString()})${Col.Default}`;
  }
}
