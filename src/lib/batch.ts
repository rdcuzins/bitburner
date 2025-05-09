import { NS } from "@ns";
import { Files, Zombie } from "./znet";

export interface Task {
  target: string;
  type: TaskType;
  delay: number;
}

export enum TaskType {
  Hack = "hack",
  Weak1 = "weak1",
  Grow = "grow",
  Weak2 = "weak2",
}

export interface BatchOpts {
  target: Zombie;
  greed: number;
}

export class Batch {
  public target: Zombie;
  public hackPercent: number;
  public hackAmount: number;
  public hackThreads: number;
  public growthThreads: number;
  public greed: number;
  public tGreed: number;
  public tasks: Task[] = [];
  public weaken1Threads: number;
  public weaken2Threads: number;

  constructor(public ns: NS, opts: BatchOpts) {
    this.target = opts.target;
    this.greed = opts.greed;
    this.hackPercent = this.ns.hackAnalyze(this.target.name);
    this.hackAmount = this.target.maxMoney * this.greed;
    this.hackThreads = Math.max(
      Math.floor(ns.hackAnalyzeThreads(this.target.name, this.hackAmount)),
      1
    );
    this.tGreed = this.hackPercent * this.hackThreads;
    this.growthThreads = Math.ceil(
      ns.growthAnalyze(
        this.target.name,
        this.target.maxMoney /
          (this.target.maxMoney - this.target.maxMoney * this.tGreed)
      )
    );
    this.weaken1Threads = Math.max(
      Math.ceil((this.hackThreads * 0.002) / 0.05),
      1
    );
    this.weaken2Threads = Math.max(
      Math.ceil((this.growthThreads * 0.004) / 0.05),
      1
    );
    const tHack = ns.getHackTime(this.target.name);
    const tWeak = tHack * 4;
    const tGrow = tHack * 3.2;
    const pad = 20;
    const hackTime = tWeak - tHack - pad;
    const growTime = tWeak - tGrow;
    const weak2Time = pad;
    const BFiles = [Files.Hack, Files.Weaken, Files.Grow, Files.Weaken];
    const BThreads = [
      this.hackThreads,
      this.weaken1Threads,
      this.growthThreads,
      this.weaken2Threads,
    ];
    const BDelays = [hackTime, 0, growTime, weak2Time];

    const batchTasks: Task = [];
    for (let i = 0; i < 4; i++) {}
  }
}
