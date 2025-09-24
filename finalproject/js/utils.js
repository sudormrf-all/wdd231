// utils.js
export const $ = (sel, ctx=document) => ctx.querySelector(sel);
export const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

export function formatCurrency(n) {
  const val = Number(n || 0);
  return val.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

export function qsParamString(obj) {
  const p = new URLSearchParams(obj);
  return p.toString();
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
