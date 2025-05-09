import { NS } from "@ns";

export const solveRLE = (ns: NS, key: string): string => {
  const chars = [...key];
  let solution = "";
  let count = 0;
  chars.forEach((c, i) => {
    count++;
    if (chars.length - 1 > i && chars[i + 1] == c) {
      return;
    }
    while (count > 9) {
      solution = solution + `${9}${c}`;
      count = count - 9;
    }
    solution = solution + `${count}${c}`;
    count = 0;
  });

  return solution;
};
