import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, ChevronDown, X, Users, CalendarDays,
  ClipboardList, AlertCircle, Filter, Upload, DollarSign,
  BarChart2, CheckCircle, RefreshCw, FileDown, Check,
} from 'lucide-react';
import * as XLSX from 'xlsx';

// ── Demo data (replaced when you upload a CRM export) ─────────────────────────

const RAW = `3D|2026-07-02 13:00|N|0|0
3D|2026-07-23 10:00|N|0|0
3D|2026-07-16 15:30|N|0|0
3D|2026-07-16 13:00|N|1|1
3D|2026-07-16 10:00|N|0|0
3D|2026-07-09 15:30|N|0|0
3D|2026-07-09 13:00|N|0|0
3D|2026-07-09 10:00|N|0|0
3D|2026-07-02 15:30|N|3|3
3D|2026-08-27 15:30|N|0|0
3D|2026-07-02 10:00|N|0|0
3D|2026-06-25 15:30|N|0|0
3D|2026-06-25 13:00|N|0|0
3D|2026-06-25 10:00|N|0|0
3D|2026-06-18 15:30|Y|0|0
3D|2026-06-18 13:00|Y|0|0
3D|2026-06-18 10:00|Y|0|0
3D|2026-07-23 15:30|N|2|2
3D|2026-08-27 13:00|N|0|0
3D|2026-08-27 10:00|N|0|0
3D|2026-08-20 15:30|N|0|0
3D|2026-08-20 13:00|N|1|1
3D|2026-08-20 10:00|N|0|0
3D|2026-08-13 15:30|N|0|0
3D|2026-08-13 13:00|N|0|0
3D|2026-08-06 15:30|N|0|0
3D|2026-08-06 13:00|N|0|0
3D|2026-08-06 10:00|N|1|1
3D|2026-07-30 15:30|N|0|0
3D|2026-07-30 13:00|N|2|1
3D|2026-07-30 10:00|N|0|0
3D|2026-07-23 13:00|N|0|0
3D|2026-08-13 10:00|N|0|0
3D|2026-07-27 15:30|N|0|0
3D|2026-07-27 13:00|N|0|0
3D|2026-07-27 10:00|N|0|0
3D|2026-07-20 15:30|N|1|1
3D|2026-07-20 13:00|N|0|0
3D|2026-07-20 10:00|N|2|2
3D|2026-07-13 15:30|N|1|1
3D|2026-07-13 13:00|N|1|1
3D|2026-07-13 10:00|N|1|1
3D|2026-07-06 15:30|N|0|0
3D|2026-07-06 13:00|N|1|1
3D|2026-08-24 15:30|N|1|1
3D|2026-08-03 13:00|N|1|1
3D|2026-08-03 10:00|N|0|0
3D|2026-08-24 13:00|N|0|0
3D|2026-08-24 10:00|N|0|0
3D|2026-08-17 15:30|N|2|2
3D|2026-08-17 13:00|N|0|0
3D|2026-08-17 10:00|N|0|0
3D|2026-08-10 15:30|N|1|1
3D|2026-08-10 13:00|N|1|1
3D|2026-08-10 10:00|N|0|0
3D|2026-08-03 15:30|N|1|1
3D|2026-06-15 10:00|Y|0|0
3D|2026-06-15 13:00|Y|0|0
3D|2026-06-15 15:30|Y|0|0
3D|2026-06-22 10:00|Y|0|0
3D|2026-06-22 13:00|Y|0|0
3D|2026-06-22 15:30|Y|0|0
3D|2026-06-29 10:00|N|0|0
3D|2026-06-29 13:00|N|0|0
3D|2026-06-29 15:30|N|0|0
3D|2026-07-06 10:00|N|4|4
5D|2026-08-24 10:00|N|0|0
5D|2026-08-17 15:30|N|0|0
5D|2026-08-17 13:00|N|0|0
5D|2026-08-17 10:00|N|0|0
5D|2026-08-10 15:30|N|0|0
5D|2026-08-10 13:00|N|0|0
5D|2026-08-03 15:30|N|2|2
5D|2026-08-03 13:00|N|0|0
5D|2026-08-03 10:00|N|0|0
5D|2026-07-27 15:30|N|4|3
5D|2026-07-27 13:00|N|0|0
5D|2026-08-10 10:00|N|0|0
5D|2026-08-24 15:30|N|1|1
5D|2026-08-24 13:00|N|0|0
5D|2026-07-13 13:00|N|0|0
5D|2026-07-13 10:00|N|0|0
5D|2026-07-13 15:30|Y|7|4
5D|2026-07-20 10:00|N|0|0
5D|2026-07-20 15:30|N|4|3
5D|2026-07-20 13:00|N|0|0
5D|2026-07-27 10:00|N|0|0
5D|2026-07-06 15:30|N|0|0
5D|2026-07-06 13:00|N|0|0
5D|2026-07-06 10:00|N|0|0
5D|2026-06-29 15:30|N|0|0
5D|2026-06-29 13:00|N|0|0
5D|2026-06-29 10:00|N|0|0
5D|2026-08-10 13:00|N|1|1
5D|2026-08-10 10:00|N|2|2
5D|2026-08-03 13:00|N|3|3
5D|2026-08-03 10:00|N|4|4
5D|2026-07-27 13:00|N|0|0
5D|2026-07-27 10:00|N|2|2
5D|2026-06-22 15:30|Y|0|0
5D|2026-06-22 13:00|N|2|2
5D|2026-06-22 10:00|Y|0|0
5D|2026-06-15 15:30|Y|0|0
5D|2026-06-15 13:00|Y|0|0
5D|2026-06-15 10:00|Y|0|0
5D|2026-06-29 10:00|Y|6|5
5D|2026-06-29 13:00|N|2|2
5D|2026-06-29 15:30|N|1|1
5D|2026-07-06 13:00|N|0|0
5D|2026-07-06 10:00|N|1|1
5D|2026-07-20 13:00|N|3|2
5D|2026-07-20 10:00|N|5|4
5D|2026-07-13 15:30|N|0|0
5D|2026-07-13 13:00|N|2|1
5D|2026-07-13 10:00|N|1|1
5D|2026-07-06 15:30|N|1|1
WK|2026-06-07 11:00|Y|0|0
WK|2026-06-07 12:30|N|1|1
WK|2026-06-07 14:00|N|1|1
WK|2026-06-07 15:30|Y|0|0
WK|2026-06-07 17:00|Y|0|0
WK|2026-06-13 09:30|Y|1|1
WK|2026-06-13 11:00|Y|1|1
WK|2026-06-13 12:30|Y|0|0
WK|2026-06-13 14:00|N|1|1
WK|2026-06-13 15:30|N|2|1
WK|2026-06-13 17:00|N|0|0
WK|2026-06-14 09:30|Y|0|0
WK|2026-06-14 11:00|N|1|1
WK|2026-06-14 12:30|N|3|2
WK|2026-06-14 14:00|N|8|8
WK|2026-06-14 15:30|N|8|8
WK|2026-06-14 17:00|N|0|0
WK|2026-06-07 09:30|Y|0|0
WK|2026-06-06 17:00|Y|0|0
WK|2026-05-17 17:00|Y|3|2
WK|2026-05-23 09:30|Y|0|0
WK|2026-05-23 11:00|Y|0|0
WK|2026-05-23 12:30|Y|0|0
WK|2026-05-23 14:00|Y|0|0
WK|2026-05-23 15:30|N|6|5
WK|2026-05-23 17:00|N|6|5
WK|2026-05-24 09:30|Y|1|1
WK|2026-05-24 11:00|Y|0|0
WK|2026-05-24 12:30|N|2|2
WK|2026-05-24 14:00|N|3|2
WK|2026-05-24 15:30|N|3|2
WK|2026-05-24 17:00|Y|0|0
WK|2026-05-30 09:30|Y|0|0
WK|2026-05-30 11:00|Y|0|0
WK|2026-05-30 14:00|N|0|0
WK|2026-05-30 12:30|Y|0|0
WK|2026-06-06 15:30|N|1|1
WK|2026-06-06 14:00|N|2|1
WK|2026-06-06 12:30|N|1|1
WK|2026-06-06 11:00|Y|0|0
WK|2026-06-06 09:30|Y|0|0
WK|2026-05-31 17:00|N|0|0
WK|2026-05-31 14:00|N|3|3
WK|2026-05-31 12:30|Y|0|0
WK|2026-05-31 11:00|Y|0|0
WK|2026-05-31 09:30|Y|0|0
WK|2026-05-30 17:00|N|0|0
WK|2026-05-30 15:30|N|1|1
WK|2026-05-31 15:30|N|1|1
WK|2026-05-02 09:30|Y|0|0
WK|2026-05-02 11:00|Y|0|0
WK|2026-05-02 12:30|N|1|1
WK|2026-05-02 14:00|N|1|1
WK|2026-05-02 15:30|N|0|0
WK|2026-05-02 17:00|N|1|1
WK|2026-05-03 09:30|N|0|0
WK|2026-05-03 11:00|N|1|1
WK|2026-05-03 12:30|N|1|1
WK|2026-05-03 14:00|N|3|3
WK|2026-05-03 15:30|N|1|1
WK|2026-05-03 17:00|N|6|5
WK|2026-04-26 17:00|Y|0|0
WK|2026-04-26 15:30|N|4|3
WK|2026-04-26 14:00|N|5|4
WK|2026-04-26 12:30|Y|0|0
WK|2026-04-26 11:00|Y|0|0
WK|2026-04-26 09:30|Y|0|0
WK|2026-04-25 17:00|Y|0|0
WK|2026-04-25 15:30|N|2|2
WK|2026-04-25 12:30|Y|0|0
WK|2026-04-25 11:00|Y|0|0
WK|2026-04-25 09:30|N|1|1
WK|2026-04-25 14:00|N|1|1
WK|2026-05-09 11:00|Y|0|0
WK|2026-05-17 15:30|Y|8|7
WK|2026-05-17 14:00|Y|0|0
WK|2026-05-17 12:30|Y|1|1
WK|2026-05-09 09:30|N|2|2
WK|2026-05-17 11:00|Y|0|0
WK|2026-05-17 09:30|Y|0|0
WK|2026-05-16 17:00|N|0|0
WK|2026-05-16 15:30|Y|0|0
WK|2026-05-16 14:00|Y|0|0
WK|2026-05-16 12:30|N|0|0
WK|2026-05-16 11:00|N|0|0
WK|2026-05-10 17:00|Y|0|0
WK|2026-05-16 09:30|N|1|1
WK|2026-05-09 12:30|N|9|9
WK|2026-05-09 14:00|N|8|7
WK|2026-05-09 15:30|N|1|1
WK|2026-05-09 17:00|N|2|2
WK|2026-05-10 09:30|N|1|1
WK|2026-05-10 11:00|Y|0|0
WK|2026-05-10 12:30|N|3|3
WK|2026-05-10 14:00|N|9|9
WK|2026-05-10 15:30|Y|0|0
EA|2026-03-22 11:00|Y|0|0
EA|2026-04-12 17:00|N|9|9
EA|2026-04-12 15:30|N|10|7
EA|2026-04-12 14:00|N|10|9
EA|2026-04-12 12:30|N|10|9
EA|2026-04-12 11:00|N|7|6
EA|2026-04-12 09:30|N|10|7
EA|2026-04-11 17:00|N|10|10
EA|2026-04-11 15:30|N|9|8
EA|2026-04-11 14:00|N|10|9
EA|2026-04-11 12:30|N|10|9
EA|2026-03-22 14:00|Y|1|1
EA|2026-03-22 15:30|Y|1|1
EA|2026-03-28 11:00|N|7|5
EA|2026-03-28 14:00|N|8|7
EA|2026-03-28 15:30|N|5|3
EA|2026-03-28 17:00|N|1|1
EA|2026-03-29 11:00|Y|1|1
EA|2026-03-29 14:00|N|8|5
EA|2026-03-29 15:30|N|6|5
EA|2026-03-29 17:00|N|6|4
EA|2026-04-05 12:30|N|10|9
EA|2026-04-07 11:00|N|9|7
EA|2026-04-05 14:00|N|10|8
EA|2026-04-05 15:30|N|8|7
EA|2026-04-05 17:00|N|10|9
EA|2026-04-06 09:30|N|10|9
EA|2026-04-06 11:00|N|5|3
EA|2026-04-06 12:30|N|10|7
EA|2026-04-06 14:00|N|10|9
EA|2026-04-06 15:30|N|4|3
EA|2026-04-06 17:00|N|10|9
EA|2026-04-07 09:30|N|10|8
EA|2026-04-03 11:00|N|10|9
EA|2026-04-05 11:00|N|3|2
EA|2026-04-05 09:30|N|9|7
EA|2026-04-04 17:00|N|10|10
EA|2026-04-04 15:30|N|9|8
EA|2026-04-04 14:00|N|10|8
EA|2026-04-04 12:30|N|10|9
EA|2026-04-04 11:00|N|1|1
EA|2026-04-04 09:30|N|5|5
EA|2026-04-03 17:00|N|10|9
EA|2026-04-03 15:30|N|10|10
EA|2026-04-03 14:00|N|10|9
EA|2026-04-03 12:30|N|10|9
EA|2026-04-09 14:00|N|10|9
EA|2026-04-03 09:30|N|10|9
EA|2026-04-11 11:00|N|4|4
EA|2026-04-11 09:30|N|10|9
EA|2026-04-10 17:00|N|10|9
EA|2026-04-10 15:30|N|6|5
EA|2026-04-10 14:00|N|10|9
EA|2026-04-10 12:30|N|10|8
EA|2026-04-10 11:00|N|7|5
EA|2026-04-10 09:30|N|8|8
EA|2026-04-09 17:00|N|7|6
EA|2026-04-09 15:30|N|7|6
EA|2026-04-07 12:30|N|10|8
EA|2026-04-09 12:30|N|10|10
EA|2026-04-09 11:00|N|1|1
EA|2026-04-09 09:30|N|7|7
EA|2026-04-08 17:00|N|7|7
EA|2026-04-08 15:30|N|7|6
EA|2026-04-08 14:00|N|10|8
EA|2026-04-08 12:30|N|10|9
EA|2026-04-08 11:00|N|7|5
EA|2026-04-08 09:30|N|9|7
EA|2026-04-07 17:00|N|10|9
EA|2026-04-07 15:30|N|1|1
EA|2026-04-07 14:00|N|10|10
LG|2026-04-02 16:00|N|1|1`;

// ── Constants ──────────────────────────────────────────────────────────────────

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const COLOR_PALETTE = [
  { bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500',    ring: 'ring-blue-200',    hex: '#3b82f6' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700',  dot: 'bg-emerald-500',  ring: 'ring-emerald-200',  hex: '#10b981' },
  { bg: 'bg-violet-100',  text: 'text-violet-700',   dot: 'bg-violet-500',   ring: 'ring-violet-200',   hex: '#8b5cf6' },
  { bg: 'bg-amber-100',   text: 'text-amber-700',    dot: 'bg-amber-500',    ring: 'ring-amber-200',    hex: '#f59e0b' },
  { bg: 'bg-rose-100',    text: 'text-rose-700',     dot: 'bg-rose-500',     ring: 'ring-rose-200',     hex: '#f43f5e' },
  { bg: 'bg-cyan-100',    text: 'text-cyan-700',     dot: 'bg-cyan-500',     ring: 'ring-cyan-200',     hex: '#06b6d4' },
  { bg: 'bg-pink-100',    text: 'text-pink-700',     dot: 'bg-pink-500',     ring: 'ring-pink-200',     hex: '#ec4899' },
  { bg: 'bg-gray-100',    text: 'text-gray-700',     dot: 'bg-gray-500',     ring: 'ring-gray-200',     hex: '#6b7280' },
];

const FALLBACK_META = { label: '?', short: '??', ...COLOR_PALETTE[COLOR_PALETTE.length - 1] };

function genShort(desc) {
  return desc.split(/[\s\-]+/).filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 3) || '??';
}

function buildTypeMeta(events) {
  const types = [...new Set(events.map(e => e.type))].sort();
  const meta = {};
  types.forEach((t, i) => {
    meta[t] = { label: t, short: genShort(t), ...COLOR_PALETTE[i % COLOR_PALETTE.length] };
  });
  return meta;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtTime(t) {
  const [h, m] = t.split(':').map(Number);
  const p = h >= 12 ? 'pm' : 'am';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return m === 0 ? `${h12}${p}` : `${h12}:${String(m).padStart(2, '0')}${p}`;
}

function genName(type, date, time) {
  if (type === 'WK' || type === 'EA') return `AI workshop – ${date} – ${time}`;
  if (type === 'LG') return `Legacy Test Activity ${date}`;
  const d = new Date(date + 'T00:00:00');
  const days = type === '3D' ? 2 : 4;
  const end = new Date(d); end.setDate(end.getDate() + days);
  const sm = MONTHS[d.getMonth()], em = MONTHS[end.getMonth()];
  const tr = time === '10:00' ? '10:00am–12:00pm' : time === '13:00' ? '1:00pm–3:00pm' : '3:30pm–5:30pm';
  const dr = sm === em
    ? `${sm} ${d.getDate()} – ${end.getDate()}`
    : `${sm} ${d.getDate()} – ${em} ${end.getDate()}`;
  return `${type === '3D' ? '3-Days' : '5-Days'} Programme – ${dr} – ${tr}`;
}

function fmtCurrency(n) {
  return 'HK$ ' + n.toLocaleString();
}

function fmtMonthLabel(ym) {
  const [y, m] = ym.split('-');
  return `${MONTHS[+m - 1]} ${y}`;
}

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function startOfMonth(d)        { return toDateStr(new Date(d.getFullYear(), d.getMonth(), 1)); }
function endOfMonth(d)          { return toDateStr(new Date(d.getFullYear(), d.getMonth()+1, 0)); }
function shiftMonthStart(d, n)  { return toDateStr(new Date(d.getFullYear(), d.getMonth()-n, 1)); }
function shiftMonthEnd(d, n)    { return toDateStr(new Date(d.getFullYear(), d.getMonth()-n+1, 0)); }

function fmtShortDate(s) {
  if (!s) return '';
  const [, m, d] = s.split('-');
  return `${MONTHS[+m-1].slice(0,3)} ${+d}`;
}

// ── Date Range Picker ──────────────────────────────────────────────────────────

function DateRangePicker({ value, onChange }) {
  const [open,       setOpen]       = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [cfrom,      setCfrom]      = useState('');
  const [cto,        setCto]        = useState('');
  const wrapRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false); setShowCustom(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const now = new Date();
  const presets = [
    { label: 'All Time',      from: null,               to: null               },
    { label: 'This Month',    from: startOfMonth(now),  to: endOfMonth(now)    },
    { label: 'Last Month',    from: shiftMonthStart(now,1), to: shiftMonthEnd(now,1) },
    { label: 'Last 3 Months', from: shiftMonthStart(now,3), to: endOfMonth(now)    },
    { label: 'Last 6 Months', from: shiftMonthStart(now,6), to: endOfMonth(now)    },
  ];

  const selectPreset = (p) => { onChange(p); setShowCustom(false); setOpen(false); };

  const applyCustom = () => {
    if (cfrom && cto) {
      onChange({ label: 'Custom', from: cfrom, to: cto });
      setOpen(false); setShowCustom(false);
    }
  };

  const btnLabel = value.label === 'Custom'
    ? `${fmtShortDate(value.from)} – ${fmtShortDate(value.to)}`
    : value.label;

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
      >
        <CalendarDays size={14} className="text-slate-400 shrink-0" />
        <span className="text-slate-700 font-medium">{btnLabel}</span>
        <ChevronDown size={14} className="text-slate-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 z-30 w-52 py-1.5">
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => selectPreset(p)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-slate-50
                ${value.label === p.label ? 'text-blue-600 font-semibold' : 'text-slate-700'}`}
            >
              {p.label}
              {value.label === p.label && <span className="w-2 h-2 rounded-full bg-blue-500" />}
            </button>
          ))}

          <div className="border-t border-slate-100 mt-1 pt-1">
            <button
              onClick={() => { setShowCustom(c => !c); if (!showCustom) { setCfrom(value.from||''); setCto(value.to||''); } }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-slate-50
                ${value.label === 'Custom' ? 'text-blue-600 font-semibold' : 'text-slate-700'}`}
            >
              Custom Range
              {value.label === 'Custom' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
            </button>

            {showCustom && (
              <div className="px-4 pb-3 pt-1 space-y-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">From</label>
                  <input type="date" value={cfrom} onChange={e => setCfrom(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">To</label>
                  <input type="date" value={cto} onChange={e => setCto(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
                <button
                  onClick={applyCustom}
                  disabled={!cfrom || !cto}
                  className="w-full bg-slate-800 text-white rounded-lg py-1.5 text-sm font-medium hover:bg-slate-700 disabled:opacity-40 transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── RAW data parser (deduplicates) ─────────────────────────────────────────────

function parseRaw() {
  const seen = new Set();
  return RAW.trim().split('\n').reduce((acc, line, i) => {
    const [type, dt, full, kids, reg] = line.split('|');
    const [date, time] = dt.split(' ');
    const key = `${type}|${date}|${time}`;
    if (seen.has(key)) return acc;
    seen.add(key);
    acc.push({
      id: i, type, date, time,
      isFull: full === 'Y', kids: +kids, reg: +reg,
      cap: (type === 'EA' || type === 'LG') ? 10 : 8,
      name: genName(type, date, time),
      childFee: 0, adultFee: 0,
    });
    return acc;
  }, []);
}

const RAW_EVENTS = parseRaw();

// ── Excel parser ───────────────────────────────────────────────────────────────

function parseTimeCell(val) {
  if (!val) return null;
  if (val instanceof Date) {
    const y  = val.getFullYear();
    const mo = String(val.getMonth() + 1).padStart(2, '0');
    const d  = String(val.getDate()).padStart(2, '0');
    const h  = String(val.getHours()).padStart(2, '0');
    const mi = String(val.getMinutes()).padStart(2, '0');
    return { date: `${y}-${mo}-${d}`, time: `${h}:${mi}` };
  }
  const s = String(val);
  const m = s.match(/(\d{4}-\d{2}-\d{2})[T\s](\d{2}:\d{2})/);
  if (m) return { date: m[1], time: m[2] };
  return null;
}

function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb   = XLSX.read(data, { type: 'array', cellDates: true });
        const ws   = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws);
        // Use a Map so duplicates (same type+date+time) resolve to whichever
        // row has the most kids/reg — not blindly the first row encountered.
        const eventMap = new Map();
        rows.forEach((row, i) => {
          const type = String(row['Description'] || '').trim();
          if (!type) return;
          const dt = parseTimeCell(row['Time']);
          if (!dt) return;
          const kids = Number(row['Kids Count'])         || 0;
          const reg  = Number(row['Registration Count']) || 0;
          const key  = `${type}|${dt.date}|${dt.time}`;
          const prev = eventMap.get(key);
          if (prev) {
            // Duplicate slot — sum the kids and registrations
            prev.kids += kids;
            prev.reg  += reg;
          } else {
            eventMap.set(key, {
              id:       i,
              name:     String(row['Name'] || ''),
              type,
              date:     dt.date,
              time:     dt.time,
              isFull:   String(row['Is Full']  || '').trim() === 'Y',
              childFee: Number(row['Child Fee'])          || 0,
              adultFee: Number(row['Adult Fee'])          || 0,
              cap:      Number(row['Capacity'])            || 8,
              reg,
              kids,
            });
          }
        });
        const events = [...eventMap.values()];
        if (events.length === 0) throw new Error('No valid rows found. Check that column headers match the CRM export format.');
        resolve({ events, skippedDescs: [] });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsArrayBuffer(file);
  });
}

// ── Type Filter (multi-select with checkboxes) ────────────────────────────────

function TypeFilter({ typeMeta, value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const types  = Object.keys(typeMeta);
  const allOn  = value.size === 0;
  const isChecked = (t) => allOn || value.has(t);

  const toggle = (t) => {
    if (allOn) {
      // Uncheck one = keep all others
      onChange(new Set(types.filter(x => x !== t)));
    } else {
      const next = new Set(value);
      next.has(t) ? next.delete(t) : next.add(t);
      // If none left or all selected, collapse back to "All"
      onChange(next.size === 0 || next.size === types.length ? new Set() : next);
    }
  };

  const btnLabel = allOn            ? 'All Events'
    : value.size === 1 ? (typeMeta[[...value][0]]?.label || [...value][0])
    : `${value.size} Types`;

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
      >
        <Filter size={14} className="text-slate-400 shrink-0" />
        <span className="text-slate-700 font-medium">{btnLabel}</span>
        <ChevronDown size={14} className="text-slate-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 z-30 w-60 py-1.5">
          {/* All Events */}
          <button
            onClick={() => { onChange(new Set()); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
          >
            <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0
              ${allOn ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
              {allOn && <Check size={10} className="text-white" />}
            </span>
            <span className={allOn ? 'font-semibold text-slate-800' : 'text-slate-600'}>All Events</span>
          </button>

          <div className="border-t border-slate-100 mt-1 pt-1">
            {types.map(t => {
              const meta    = typeMeta[t];
              const checked = isChecked(t);
              return (
                <button key={t} onClick={() => toggle(t)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors">
                  <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0
                    ${checked ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                    {checked && <Check size={10} className="text-white" />}
                  </span>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${meta.dot}`} />
                  <span className={`truncate ${checked ? 'text-slate-800' : 'text-slate-400'}`}>{meta.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── PDF Report Modal ───────────────────────────────────────────────────────────

function PdfReportModal({ events, typeMeta, onClose }) {
  const [selected,   setSelected]   = useState(new Set());
  const [typeFilter, setTypeFilter] = useState('ALL');

  const list = useMemo(() =>
    events
      .filter(e => typeFilter === 'ALL' || e.type === typeFilter)
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),
    [events, typeFilter]
  );

  // Selected events always from full list, regardless of filter
  const selectedList = useMemo(() =>
    events
      .filter(e => selected.has(e.id))
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),
    [events, selected]
  );

  const totalKids = selectedList.reduce((s, e) => s + e.kids, 0);
  const allSel    = list.length > 0 && list.every(e => selected.has(e.id));

  const toggle = (id) => setSelected(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const toggleAll = () =>
    setSelected(allSel ? new Set() : new Set(list.map(e => e.id)));

  const exportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <>
      {/* ── Modal (screen only) ── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden" onClick={onClose}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col" onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200 flex items-start justify-between gap-2">
            <div>
              <h2 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
                <FileDown size={18} className="text-slate-500" /> Materials Report
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Select events to include — PDF shows event name, date &amp; student count</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg shrink-0"><X size={18} /></button>
          </div>

          {/* Filter + select-all */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="ALL">All Event Types</option>
              {Object.keys(typeMeta).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button onClick={toggleAll} className="text-sm text-blue-600 hover:underline shrink-0">
              {allSel ? 'Deselect All' : `Select All (${list.length})`}
            </button>
          </div>

          {/* Event list */}
          <div className="overflow-y-auto flex-1 px-4 py-2">
            {list.length === 0 ? (
              <p className="text-center py-10 text-slate-400 text-sm">No events match the filter</p>
            ) : list.map(evt => {
              const isSel = selected.has(evt.id);
              const meta  = typeMeta[evt.type] || FALLBACK_META;
              return (
                <div
                  key={evt.id}
                  onClick={() => toggle(evt.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer mb-1 transition-colors
                    ${isSel ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-slate-50'}`}
                >
                  <input type="checkbox" checked={isSel} readOnly
                    className="w-4 h-4 accent-blue-600 shrink-0 pointer-events-none" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 leading-snug truncate">
                      {evt.name || `${evt.type} – ${evt.date}`}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(evt.date + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                      })} · {fmtTime(evt.time)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${meta.bg} ${meta.text}`}>{meta.short}</span>
                    <span className={`text-sm font-bold w-12 text-right ${evt.kids > 0 ? 'text-emerald-700' : 'text-slate-300'}`}>
                      {evt.kids} 👶
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">{selected.size}</span> events ·{' '}
              <span className="font-semibold text-emerald-700">{totalKids}</span> students total
            </div>
            <button
              onClick={() => selected.size > 0 && window.print()}
              disabled={selected.size === 0}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              <FileDown size={15} /> Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── Print-only report (invisible on screen, full-page on print) ── */}
      <div id="print-report">
        <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '12mm 14mm', color: '#1e293b', fontSize: '13px' }}>

          {/* Header — matches dashboard dark gradient */}
          <div style={{ background: 'linear-gradient(to right, #1e293b, #334155)', color: '#fff',
            borderRadius: '12px', padding: '16px 22px', marginBottom: '18px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '-0.3px' }}>Event Dashboard</div>
              <div style={{ fontSize: '11px', opacity: 0.65, marginTop: '3px' }}>Materials Report · Student procurement</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '11px', opacity: 0.75 }}>
              <div>Generated</div>
              <div style={{ fontWeight: '600', opacity: 1, color: '#fff', marginTop: '2px' }}>{exportDate}</div>
            </div>
          </div>

          {/* Summary stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '18px' }}>
            {[
              { label: 'Events Selected',  value: selectedList.length, bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
              { label: 'Total Students',   value: totalKids,           bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d' },
              { label: 'Event Types',      value: [...new Set(selectedList.map(e => e.type))].length, bg: '#faf5ff', border: '#ddd6fe', color: '#6d28d9' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '10px', padding: '12px 16px' }}>
                <div style={{ fontSize: '26px', fontWeight: 'bold', color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Section label */}
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase',
            letterSpacing: '0.06em', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '10px' }}>
            Selected Events
          </div>

          {/* Event cards — dashboard-style rows */}
          {selectedList.map((evt) => {
            const meta  = typeMeta[evt.type] || FALLBACK_META;
            const color = meta.hex || '#64748b';
            return (
              <div key={evt.id} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                background: '#fff', border: '1px solid #f1f5f9',
                borderLeft: `4px solid ${color}`,
                borderRadius: '10px', padding: '11px 16px', marginBottom: '7px',
                pageBreakInside: 'avoid',
              }}>
                {/* Type badge */}
                <div style={{
                  fontSize: '10px', fontWeight: '700', padding: '3px 9px',
                  borderRadius: '999px', background: color + '18', color,
                  whiteSpace: 'nowrap', letterSpacing: '0.03em',
                }}>
                  {meta.short}
                </div>

                {/* Event details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '3px', fontSize: '13px' }}>
                    {evt.name || `${evt.type} – ${evt.date}`}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {new Date(evt.date + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                    })}
                    {' · '}{fmtTime(evt.time)}
                  </div>
                </div>

                {/* Student count */}
                <div style={{ textAlign: 'center', minWidth: '56px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#16a34a', lineHeight: 1 }}>{evt.kids}</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>students</div>
                </div>
              </div>
            );
          })}

          {/* Total row */}
          <div style={{
            background: '#1e293b', color: '#fff', borderRadius: '10px',
            padding: '14px 20px', marginTop: '10px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>Total Students Required</div>
            <div style={{ fontSize: '30px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>{totalKids}</div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: '18px', fontSize: '10px', color: '#94a3b8',
            display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
            <span>Event Dashboard · HKATA</span>
            <span>{exportDate}</span>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Revenue Tab ────────────────────────────────────────────────────────────────

function RevenueTab({ events, typeMeta }) {
  const hasFees = useMemo(() => events.some(e => e.childFee > 0 || e.adultFee > 0), [events]);

  const totals = useMemo(() => events.reduce((acc, e) => {
    acc.revenue += e.kids * e.childFee + e.reg * e.adultFee;
    acc.kids    += e.kids;
    acc.reg     += e.reg;
    if (e.kids > 0) acc.withBookings++;
    return acc;
  }, { revenue: 0, kids: 0, reg: 0, withBookings: 0 }), [events]);

  const byType = useMemo(() => {
    const m = {};
    events.forEach(e => {
      if (!m[e.type]) m[e.type] = { sessions: 0, kids: 0, revenue: 0 };
      m[e.type].sessions++;
      m[e.type].kids    += e.kids;
      m[e.type].revenue += e.kids * e.childFee + e.reg * e.adultFee;
    });
    return m;
  }, [events]);

  const byMonth = useMemo(() => {
    const m = {};
    events.forEach(e => {
      const key = e.date.slice(0, 7);
      if (!m[key]) m[key] = { sessions: 0, kids: 0, revenue: 0 };
      m[key].sessions++;
      m[key].kids    += e.kids;
      m[key].revenue += e.kids * e.childFee + e.reg * e.adultFee;
    });
    return m;
  }, [events]);

  const sortedMonths  = Object.keys(byMonth).sort();
  const maxMonthRev   = Math.max(...sortedMonths.map(k => byMonth[k].revenue), 1);
  const sortedTypes   = Object.entries(byType)
    .filter(([, v]) => v.sessions > 0)
    .sort((a, b) => b[1].revenue - a[1].revenue);
  const maxTypeRev = Math.max(...sortedTypes.map(([, v]) => v.revenue), 1);

  if (!hasFees) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-10 text-center">
        <DollarSign size={48} className="mx-auto mb-4 text-slate-200" />
        <h3 className="font-semibold text-slate-700 mb-2">No revenue data available</h3>
        <p className="text-sm text-slate-500 mb-1">Upload your CRM Excel export to view revenue reporting.</p>
        <p className="text-xs text-slate-400">The file must include Child Fee, Adult Fee, and Capacity columns.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <DollarSign size={20} className="text-blue-600" />,   label: 'Total Revenue',       val: fmtCurrency(totals.revenue), bg: 'bg-blue-50'   },
          { icon: <Users      size={20} className="text-emerald-600" />, label: 'Total Kids',          val: totals.kids,                 bg: 'bg-emerald-50' },
          { icon: <ClipboardList size={20} className="text-violet-600" />, label: 'Registrations',    val: totals.reg,                  bg: 'bg-violet-50'  },
          { icon: <BarChart2  size={20} className="text-amber-600" />,   label: 'Sessions w/ Bookings', val: totals.withBookings,        bg: 'bg-amber-50'   },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>{c.icon}</div>
            <div>
              <div className="text-xl font-bold text-slate-800">{c.val}</div>
              <div className="text-xs text-slate-500">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue by type */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Revenue by Event Type</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {sortedTypes.map(([k, v]) => {
            const meta = typeMeta[k] || FALLBACK_META;
            const pct  = (v.revenue / maxTypeRev) * 100;
            return (
              <div key={k} className="px-4 py-3">
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${meta.dot}`} />
                    <span className="text-sm font-medium text-slate-700 truncate">{meta.label}</span>
                    <span className="text-xs text-slate-400 shrink-0 hidden sm:inline">{v.sessions} sessions · {v.kids} kids</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800 shrink-0">{fmtCurrency(v.revenue)}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${meta.dot}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5 sm:hidden">{v.sessions} sessions · {v.kids} kids</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly breakdown */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Monthly Breakdown</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {sortedMonths.map(ym => {
            const d   = byMonth[ym];
            const pct = (d.revenue / maxMonthRev) * 100;
            return (
              <div key={ym} className="px-4 py-3">
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-slate-700">{fmtMonthLabel(ym)}</span>
                    <span className="text-xs text-slate-400 ml-2">{d.sessions} sessions · {d.kids} kids</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800 shrink-0">{fmtCurrency(d.revenue)}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

const _today = new Date();

export default function EventDashboard() {
  const [year,           setYear]           = useState(_today.getFullYear());
  const [month,          setMonth]          = useState(_today.getMonth());
  const [filterSet,      setFilterSet]      = useState(new Set());
  const [dateRange,      setDateRange]      = useState({ label: 'All Time', from: null, to: null });
  const [selDate,        setSelDate]        = useState(null);
  const [activeTab,      setActiveTab]      = useState('calendar');
  const [uploadedEvents, setUploadedEvents] = useState(null);
  const [uploadFileName, setUploadFileName] = useState(null);
  const [uploadError,    setUploadError]    = useState(null);
  const [isRefreshing,   setIsRefreshing]   = useState(false);
  const [showPdfModal,   setShowPdfModal]   = useState(false);
  const fileInputRef = useRef(null);

  // Restore previously uploaded data from localStorage
  useEffect(() => {
    try {
      const saved     = localStorage.getItem('hkata-events');
      const savedName = localStorage.getItem('hkata-events-filename');
      if (saved) {
        setUploadedEvents(JSON.parse(saved));
        setUploadFileName(savedName || 'Uploaded file');
      }
    } catch {}
  }, []);

  const allEvents = uploadedEvents ?? [];
  const typeMeta  = useMemo(() => buildTypeMeta(allEvents), [allEvents]);

  useEffect(() => { setFilterSet(new Set()); }, [allEvents]);

  const statsEvts = useMemo(() => {
    let base = filterSet.size === 0 ? allEvents : allEvents.filter(e => filterSet.has(e.type));
    if (dateRange.from) base = base.filter(e => e.date >= dateRange.from);
    if (dateRange.to)   base = base.filter(e => e.date <= dateRange.to);
    return base;
  }, [allEvents, filterSet, dateRange]);

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    try {
      const { events } = await parseExcelFile(file);
      setUploadedEvents(events);
      setUploadFileName(file.name);
      localStorage.setItem('hkata-events', JSON.stringify(events));
      localStorage.setItem('hkata-events-filename', file.name);
    } catch (err) {
      setUploadError(err.message || 'Could not parse file. Please check the format.');
    }
    e.target.value = '';
  };

  const clearUpload = () => {
    setUploadedEvents(null);
    setUploadFileName(null);
    setUploadError(null);
    localStorage.removeItem('hkata-events');
    localStorage.removeItem('hkata-events-filename');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setUploadError(null);
    try {
      const saved = localStorage.getItem('hkata-events');
      if (saved) setUploadedEvents(JSON.parse(saved));
    } catch {
      setUploadError('Refresh failed — data may be corrupted. Please re-upload.');
    }
    setTimeout(() => setIsRefreshing(false), 700);
  };

  // ── Calendar logic ───────────────────────────────────────────────────────────

  const filtered = useMemo(
    () => filterSet.size === 0 ? allEvents : allEvents.filter(e => filterSet.has(e.type)),
    [filterSet, allEvents]
  );

  const monthEvts = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    return filtered.filter(e => e.date.startsWith(prefix));
  }, [filtered, year, month]);

  const byDate = useMemo(() => {
    const m = {};
    monthEvts.forEach(e => { if (!m[e.date]) m[e.date] = []; m[e.date].push(e); });
    Object.values(m).forEach(a => a.sort((x, y) => x.time.localeCompare(y.time)));
    return m;
  }, [monthEvts]);

  // Filtered-period stats (top row)
  const totalKids = statsEvts.reduce((s, e) => s + e.kids, 0);
  const totalReg  = statsEvts.reduce((s, e) => s + e.reg,  0);
  const fullCount = statsEvts.filter(e => e.isFull).length;

  // Current calendar-month stats (bottom row)
  const monthKids  = monthEvts.reduce((s, e) => s + e.kids, 0);
  const monthReg   = monthEvts.reduce((s, e) => s + e.reg,  0);
  const monthFull  = monthEvts.filter(e => e.isFull).length;

  const daysIn   = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const trailing = (7 - (firstDow + daysIn) % 7) % 7;

  const prev    = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next    = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };
  const dateStr = (day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const selEvents = selDate ? (byDate[selDate] || []) : [];

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <CalendarDays size={24} /> Event Dashboard
            </h1>
            <p className="text-slate-300 text-sm mt-0.5">Monitor events, registrations &amp; capacity</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileChange}
            />
            {uploadFileName ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-white/15 rounded-lg px-3 py-1.5 text-sm">
                  <CheckCircle size={14} className="text-green-300 shrink-0" />
                  <span className="text-slate-200 text-xs truncate max-w-[160px]">{uploadFileName}</span>
                  <button onClick={clearUpload} className="text-slate-300 hover:text-white ml-1 shrink-0" title="Remove uploaded data">
                    <X size={13} />
                  </button>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  title="Refresh data from uploaded file"
                  className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 disabled:opacity-60 text-white rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                >
                  <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                  {isRefreshing ? 'Refreshing…' : 'Refresh'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
              >
                <Upload size={14} /> Upload CRM Data
              </button>
            )}
            {allEvents.length > 0 && (
              <button
                onClick={() => setShowPdfModal(true)}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
              >
                <FileDown size={14} /> Export Report
              </button>
            )}
          </div>
        </div>

        {uploadError && (
          <div className="max-w-7xl mx-auto mt-2">
            <p className="text-red-300 text-xs bg-red-900/30 px-3 py-1.5 rounded-lg">{uploadError}</p>
          </div>
        )}
      </div>

      <div className="p-3 md:p-6 max-w-7xl mx-auto">

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-5 bg-white rounded-xl shadow-sm p-1 w-fit">
          {[
            { key: 'calendar', label: 'Calendar', icon: <CalendarDays size={15} /> },
            { key: 'revenue',  label: 'Revenue',  icon: <DollarSign   size={15} /> },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${activeTab === t.key
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Calendar Tab ── */}
        {activeTab === 'calendar' && (
          <>
            {allEvents.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-16 text-center">
                <Upload size={48} className="mx-auto mb-4 text-slate-200" />
                <h3 className="font-semibold text-slate-700 mb-2">No data loaded</h3>
                <p className="text-sm text-slate-500 mb-4">Upload your CRM Excel export to view events and analytics.</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                >
                  <Upload size={14} /> Upload CRM Data
                </button>
              </div>
            ) : (
              <>
                {/* ── Filtered-period stats ── */}
                <div className="mb-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                      <Filter size={10} /> Period Filter
                    </span>
                    <DateRangePicker value={dateRange} onChange={setDateRange} />
                    <TypeFilter typeMeta={typeMeta} value={filterSet} onChange={setFilterSet} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { icon: <CalendarDays  size={20} className="text-blue-600"   />, label: dateRange.label === 'All Time' ? 'Total Events' : `Events · ${dateRange.label}`, val: statsEvts.length, bg: 'bg-blue-50'   },
                      { icon: <Users         size={20} className="text-emerald-600" />, label: 'Total Kids',    val: totalKids, bg: 'bg-emerald-50' },
                      { icon: <ClipboardList size={20} className="text-violet-600"  />, label: 'Registrations', val: totalReg,  bg: 'bg-violet-50'  },
                      { icon: <AlertCircle   size={20} className="text-red-500"     />, label: 'Full Events',   val: fullCount, bg: 'bg-red-50'     },
                    ].map((c, i) => (
                      <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 border-l-4 border-blue-400">
                        <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>{c.icon}</div>
                        <div>
                          <div className="text-2xl font-bold text-slate-800">{c.val}</div>
                          <div className="text-xs text-slate-500">{c.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Current calendar-month stats ── */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                      <CalendarDays size={10} /> Current Calendar
                    </span>
                    <span className="text-xs text-slate-400">{MONTHS[month]} {year}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { icon: <CalendarDays  size={20} className="text-blue-600"   />, label: `Events · ${MONTHS[month]}`, val: monthEvts.length, bg: 'bg-blue-50'   },
                      { icon: <Users         size={20} className="text-emerald-600" />, label: 'Total Kids',    val: monthKids, bg: 'bg-emerald-50' },
                      { icon: <ClipboardList size={20} className="text-violet-600"  />, label: 'Registrations', val: monthReg,  bg: 'bg-violet-50'  },
                      { icon: <AlertCircle   size={20} className="text-red-500"     />, label: 'Full Events',   val: monthFull, bg: 'bg-red-50'     },
                    ].map((c, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>{c.icon}</div>
                        <div>
                          <div className="text-2xl font-bold text-slate-700">{c.val}</div>
                          <div className="text-xs text-slate-500">{c.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calendar controls */}
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={prev} className="p-2 rounded-lg bg-white shadow-sm hover:shadow"><ChevronLeft size={18} /></button>
                  <h2 className="text-lg font-semibold w-44 text-center">{MONTHS[month]} {year}</h2>
                  <button onClick={next} className="p-2 rounded-lg bg-white shadow-sm hover:shadow"><ChevronRight size={18} /></button>
                </div>

                {/* Calendar grid */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
                    {DAYS.map(d => (
                      <div key={d} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-px bg-slate-200">
                    {Array.from({ length: firstDow }).map((_, i) => (
                      <div key={`le-${i}`} className="bg-slate-50 min-h-20 md:min-h-28" />
                    ))}
                    {Array.from({ length: daysIn }).map((_, i) => {
                      const day = i + 1;
                      const ds  = dateStr(day);
                      const de  = byDate[ds] || [];
                      const dk  = de.reduce((s, e) => s + e.kids, 0);
                      const hf  = de.some(e => e.isFull);
                      const td  = ds === todayStr;
                      return (
                        <div
                          key={day}
                          onClick={() => setSelDate(ds)}
                          className={`bg-white min-h-20 md:min-h-28 p-1 cursor-pointer transition-all hover:bg-blue-50
                            ${td ? 'ring-2 ring-inset ring-blue-400 bg-blue-50' : ''}
                            ${selDate === ds ? 'bg-blue-100' : ''}`}
                        >
                          <div className="flex justify-between items-center mb-0.5">
                            <span className={`text-xs font-bold leading-none
                              ${td ? 'bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center' : 'text-slate-600'}`}>
                              {day}
                            </span>
                            <div className="flex items-center gap-1">
                              {dk > 0 && <span className="text-xs text-emerald-700 font-semibold">{dk}👶</span>}
                              {hf && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" title="Has full events" />}
                            </div>
                          </div>
                          <div className="space-y-px">
                            {de.map((evt, j) => {
                              const m = typeMeta[evt.type] || FALLBACK_META;
                              return (
                                <div key={j} className={`flex items-center gap-1 rounded px-1 py-px text-xs ${m.bg} ${m.text}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${m.dot} shrink-0`} />
                                  <span className="font-semibold shrink-0">{m.short}</span>
                                  <span className="truncate flex-1">{fmtTime(evt.time)}</span>
                                  {evt.kids > 0 && <span className="shrink-0 font-semibold">-{evt.kids}</span>}
                                  {evt.isFull && <span className="shrink-0 text-red-600 font-bold ml-0.5">F</span>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {Array.from({ length: trailing }).map((_, i) => (
                      <div key={`tr-${i}`} className="bg-slate-50 min-h-20 md:min-h-28" />
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-4 px-1">
                  {Object.entries(typeMeta).map(([k, v]) => (
                    <span key={k} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span className={`w-3 h-3 rounded ${v.dot}`} /> {v.label}
                    </span>
                  ))}
                  <span className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> Full
                  </span>
                </div>
              </>
            )}
          </>
        )}

        {/* ── Revenue Tab ── */}
        {activeTab === 'revenue' && <RevenueTab events={allEvents} typeMeta={typeMeta} />}

      </div>

      {/* Date detail panel */}
      {selDate && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelDate(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center z-10">
              <div>
                <h3 className="font-semibold text-slate-800">
                  {new Date(selDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                  })}
                </h3>
                <p className="text-xs text-slate-500">{selEvents.length} event{selEvents.length !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setSelDate(null)} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={18} /></button>
            </div>

            <div className="p-4">
              {selEvents.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <CalendarDays size={40} className="mx-auto mb-3 opacity-40" />
                  <p>No events on this date</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selEvents.map((evt, i) => {
                    const m          = typeMeta[evt.type] || FALLBACK_META;
                    const pct        = evt.cap > 0 ? Math.min(100, Math.round((evt.kids / evt.cap) * 100)) : 0;
                    const evtRevenue = evt.kids * evt.childFee + evt.reg * evt.adultFee;
                    const showRev    = evtRevenue > 0;
                    return (
                      <div key={i} className={`border rounded-xl p-3 ring-1 ${m.ring} border-slate-100`}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${m.bg} ${m.text} mb-1.5`}>{m.label}</span>
                            <p className="text-sm font-medium text-slate-800 leading-snug">{evt.name}</p>
                            <p className="text-xs text-slate-500 mt-1">⏰ {fmtTime(evt.time)}</p>
                          </div>
                          {evt.isFull && (
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full shrink-0">FULL</span>
                          )}
                        </div>

                        <div className={`grid gap-2 text-center mb-2 ${showRev ? 'grid-cols-4' : 'grid-cols-3'}`}>
                          <div className="bg-slate-50 rounded-lg p-2">
                            <div className="text-lg font-bold text-slate-800">{evt.kids}</div>
                            <div className="text-xs text-slate-500">Kids</div>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2">
                            <div className="text-lg font-bold text-slate-800">{evt.reg}</div>
                            <div className="text-xs text-slate-500">Reg.</div>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2">
                            <div className="text-lg font-bold text-slate-800">{evt.cap}</div>
                            <div className="text-xs text-slate-500">Capacity</div>
                          </div>
                          {showRev && (
                            <div className="bg-blue-50 rounded-lg p-2">
                              <div className="text-sm font-bold text-blue-700 leading-tight">{fmtCurrency(evtRevenue)}</div>
                              <div className="text-xs text-slate-500">Revenue</div>
                            </div>
                          )}
                        </div>

                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-red-500' : pct >= 75 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1 text-right">{pct}% filled</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showPdfModal && (
        <PdfReportModal
          events={allEvents}
          typeMeta={typeMeta}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </div>
  );
}
