export const $ = (sel, ctx=document) => ctx.querySelector(sel);
export const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];
export function formatCurrency(n) { return Number(n||0).toLocaleString(undefined,{style:'currency',currency:'USD'}); }
export function qsParamString(obj) { return new URLSearchParams(obj).toString(); }
export function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }
