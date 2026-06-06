"use strict";

const MARS3_LANDING_UTC_MS = Date.parse("1971-12-02T13:52:00Z");
const TAI_MINUS_UTC = 37;
const REAL_SOL_SECONDS = 88775.244147;

const DISPLAY_HOURS = 25;
const DISPLAY_MINUTES = 50;
const DISPLAY_SECONDS = 71;
const DISPLAY_UNITS_PER_SOL = DISPLAY_HOURS * DISPLAY_MINUTES * DISPLAY_SECONDS;

const SOLS_PER_MARS_YEAR = 668.6;

const MONTH_LENGTHS = [56, 55, 56, 55, 56, 55, 56, 55, 56, 55, 56, 55];
const MONTH_NAMES = [
  "vasant",
  "dunia",
  "xing",
  "mare",
  "ember",
  "flor",
  "sneg",
  "kijani",
  "hu",
  "vent",
  "luna",
  "zvezda",
];

function unixMsToMSD(unixMs) {
  const unixSeconds = unixMs / 1000;
  return (unixSeconds + TAI_MINUS_UTC) / REAL_SOL_SECONDS + 34127.2954262;
}

function frac(value) {
  return value - Math.floor(value);
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function pad4(value) {
  return String(value).padStart(4, "0");
}

function shiftedSolIndex(msd) {
  return Math.floor(msd + 0.5);
}

function shiftedSolPhase(msd) {
  return frac(msd + 0.5);
}

const landingMSD = unixMsToMSD(MARS3_LANDING_UTC_MS);
const landingShiftedIndex = shiftedSolIndex(landingMSD);

function currentSolNumber(msd) {
  return shiftedSolIndex(msd) - landingShiftedIndex + 1;
}

function currentDisplayTime(msd) {
  const phase = shiftedSolPhase(msd);
  let total = Math.floor(phase * DISPLAY_UNITS_PER_SOL);

  if (total >= DISPLAY_UNITS_PER_SOL) {
    total = DISPLAY_UNITS_PER_SOL - 1;
  }

  const unitsPerHour = DISPLAY_MINUTES * DISPLAY_SECONDS;
  const hour = Math.floor(total / unitsPerHour);
  const remainder = total % unitsPerHour;
  const minute = Math.floor(remainder / DISPLAY_SECONDS);
  const second = remainder % DISPLAY_SECONDS;

  return { hour, minute, second, phase };
}

function currentMarsYear(solNumber) {
  return Math.floor((solNumber - 1) / SOLS_PER_MARS_YEAR) + 1;
}

function solOfYear(solNumber) {
  const yearStartSol = Math.floor((currentMarsYear(solNumber) - 1) * SOLS_PER_MARS_YEAR) + 1;
  return solNumber - yearStartSol + 1;
}

function getMonthInfo(solInYear) {
  let remaining = solInYear;

  for (let index = 0; index < MONTH_LENGTHS.length; index += 1) {
    if (remaining <= MONTH_LENGTHS[index]) {
      return {
        monthNumber: index + 1,
        monthName: MONTH_NAMES[index],
        dayOfMonth: remaining,
        monthLength: MONTH_LENGTHS[index],
      };
    }

    remaining -= MONTH_LENGTHS[index];
  }

  return {
    monthNumber: 12,
    monthName: MONTH_NAMES[11],
    dayOfMonth: MONTH_LENGTHS[11],
    monthLength: MONTH_LENGTHS[11],
  };
}

function buildMonthsWrap(currentMonthNumber) {
  return MONTH_NAMES.map((name, index) => {
    const number = index + 1;
    const length = MONTH_LENGTHS[index];
    const currentClass = number === currentMonthNumber ? "month-item current" : "month-item";
    const comma = index < MONTH_NAMES.length - 1 ? '<span class="comma">,</span>' : "";
    return `<span class="${currentClass}">${name} (${length})</span>${comma}`;
  }).join(" ");
}

function updateMarsClock() {
  const nowMSD = unixMsToMSD(Date.now());
  const totalSol = currentSolNumber(nowMSD);
  const marsYear = currentMarsYear(totalSol);
  const currentYearSol = solOfYear(totalSol);
  const monthInfo = getMonthInfo(currentYearSol);
  const displayTime = currentDisplayTime(nowMSD);
  const progressPercent = (displayTime.phase * 100).toFixed(3);

  document.getElementById("marsDate").textContent = `${pad2(monthInfo.dayOfMonth)}.${pad2(
    monthInfo.monthNumber,
  )}.${pad4(marsYear)}`;
  document.getElementById("marsTime").textContent = `${pad2(displayTime.hour)}:${pad2(
    displayTime.minute,
  )}:${pad2(displayTime.second)}`;
  document.getElementById("monthsWrap").innerHTML = buildMonthsWrap(monthInfo.monthNumber);
  document.getElementById("solNumber").textContent = totalSol.toLocaleString("en-US");
  document.getElementById("yearSol").textContent = `${currentYearSol} / ${SOLS_PER_MARS_YEAR}`;
  document.getElementById("solProgress").textContent = `${progressPercent}%`;
}

updateMarsClock();
setInterval(updateMarsClock, 250);
