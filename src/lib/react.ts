import ReactNamespace from 'react/index';
import ReactDomNamespace from 'react-dom';

// const React = window.React as typeof ReactNamespace;
// const ReactDOM = window.ReactDOM as typeof ReactDomNamespace;
const cheatWindow = eval("window") as Window & typeof globalThis
export const cheatDocument = eval("document") as Document & typeof globalThis

export const React = cheatWindow.React as typeof ReactNamespace
export const ReactDOM = cheatWindow.ReactDOM as typeof ReactDomNamespace
export default React