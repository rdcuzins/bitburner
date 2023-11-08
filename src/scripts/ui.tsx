import { NS } from "@ns";
import { ReactDOM, React, cheatDocument } from "/lib/react";

export interface ITestProps {
  ns: NS
}

const Test = ({ns}: ITestProps) => {
  const info = ns.getPlayer()
  let text = "Bucks"
  const changeText = (e: any) => {
    ns.tprint("Clicked")
    if(text === "Bucks"){
      text = "Money"
    } else {
      text = "Bucks"
    }
  }
  return(
    <div id="cui" style={{
      height: "20px",
      color: "white",
      margin: "4px 2px",
      padding: "4px",
      border: "1px solid blue"
    }} onClick={changeText}>
      Player {text}: {info.money}
    </div>
  )
}
// HWGW
export async function main(ns: NS): Promise<void> {
  ns.disableLog("ALL")
  ns.tail()
  while(ns.scriptRunning("/scripts/ui.js", "home")){
    ns.printRaw(
      <Test ns={ns}/>
    )
    await ns.asleep(1000)
    ns.clearLog()
  }
}