/**
 * Ports used to pass data between scripts.
 */
export enum Ports {
  Target = 1,
  Log,
  Worker,
  Znet,
}

/**
 * Colors which changes printed text.
 *
 * @example
 * ns.tprint(Col.Red + "This is red. " + Col.Default + "This text is normal.")
 *
 */
export enum Col {
  Red = "\x1b[31m",
  Green = "\x1b[32m",
  Blue = "\x1b[34m",
  Cyan = "\x1b[36m",
  Magenta = "\x1b[35m",
  Yellow = "\x1b[33m",
  Black = "\x1b[30m",
  White = "\x1b[37m",
  Default = "\x1b[0m",
}
