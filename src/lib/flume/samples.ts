import type { Project, Settings } from "./types";
import { DEFAULT_SETTINGS } from "./types";

export type Sample = {
  id: string;
  name: string;
  blurb: string;
  project: Project;
};

function project(
  title: string,
  subtitle: string,
  source: string,
  settings: Partial<Settings>,
): Project {
  return {
    v: 1,
    title,
    subtitle,
    source: source.trim() + "\n",
    settings: { ...DEFAULT_SETTINGS, ...settings },
    offsets: {},
  };
}

const YEAR = `
// Money in
Product [4200] Revenue
Services [1800] Revenue
Licensing [640] Revenue

// What it cost to deliver
Revenue [2100] Cost of revenue
Revenue [*] Gross profit

// Running the company
Gross profit [980] People
Gross profit [310] Go to market
Gross profit [240] Infrastructure
Gross profit [150] General & admin
Gross profit [*] Operating profit

// What remained
Operating profit [740] Tax
Operating profit [*] Net profit

:Product #1f6a62
:Services #3d8b78
:Licensing #7e9a72
:Revenue #1c2e2c
:Cost of revenue #8f3d32
:Gross profit #1f4b4a
:People #c4622d
:Go to market #c48a3a
:Infrastructure #3a4a6b
:General & admin #8a7564
:Operating profit #1f4b4a
:Tax #6e3b3b
:Net profit #143f3a
`;

const HOME = `
// A month, after tax
Wages [6400] Budget
Side work [480] Budget

Budget [2100] Rent
Budget [860] Food
Budget [420] Transport
Budget [310] Utilities
Budget [240] Health
Budget [180] Everything else
Budget [*] Savings

:Wages #1f4b4a
:Side work #3d8b78
:Budget #1c2e2c
:Rent #8f3d32
:Food #c4622d
:Transport #c48a3a
:Utilities #3a4a6b
:Health #6e3b3b
:Everything else #8a7564
:Savings #143f3a
`;

const GRID = `
// Fuel in
Coal [12] Generation
Gas [31] Generation
Nuclear [18] Generation
Wind [16] Generation
Solar [9] Generation
Oil [28] Engines
Biofuel [4] Engines

Generation [8] Losses
Generation [*] Grid

Grid [24] Homes
Grid [21] Industry
Grid [*] Shops

Engines [*] Mobility

:Coal #3a3532
:Gas #c4622d
:Nuclear #3a4a6b
:Wind #3d8b78
:Solar #c48a3a
:Oil #6e3b3b
:Biofuel #7e9a72
:Generation #1c2e2c
:Engines #243044
:Losses #8a7564
:Grid #1f4b4a
:Homes #c4622d
:Industry #3a4a6b
:Shops #8a6232
:Mobility #143f3a
`;

const CHERRY = `
// One hundred units of fruit, and where they go
Harvest [100] Cherry

Cherry [82] Washed
Cherry [*] Rejected fruit

Washed [70] Green bean
Washed [*] Pulp and water

Green bean [64] Roaster
Green bean [*] Dockage

Roaster [52] Bags
Roaster [*] Roast loss

Bags [28] Cafes
Bags [15] Grocers
Bags [*] Subscriptions

:Harvest #7e9a72
:Cherry #8f3d32
:Rejected fruit #8a7564
:Washed #c4622d
:Pulp and water #6e3b3b
:Green bean #3d5a3d
:Dockage #8a7564
:Roaster #1c2e2c
:Roast loss #6e3b3b
:Bags #c48a3a
:Cafes #1f4b4a
:Grocers #3a4a6b
:Subscriptions #143f3a
`;

export const SAMPLES: Sample[] = [
  {
    id: "year",
    name: "Where the year went",
    blurb: "A company, source to profit",
    project: project("Where the year went", "Thousands. Illustrative.", YEAR, {
      align: "left",
      width: 1180,
      height: 700,
      prefix: "",
      decimals: 0,
    }),
  },
  {
    id: "home",
    name: "A month at home",
    blurb: "Income, spending, what remains",
    project: project("A month at home", "After tax. Illustrative.", HOME, {
      align: "justify",
      prefix: "$",
      decimals: 0,
      width: 1080,
      height: 640,
    }),
  },
  {
    id: "grid",
    name: "A small grid",
    blurb: "Fuel, generation, end use",
    project: project("A small grid", "Units of energy. Illustrative.", GRID, {
      align: "left",
      decimals: 0,
      width: 1120,
      height: 760,
      nodeGap: 16,
    }),
  },
  {
    id: "cherry",
    name: "Cherry to cup",
    blurb: "Shrinkage, step by step",
    project: project("Cherry to cup", "One hundred units of fruit.", CHERRY, {
      align: "left",
      decimals: 0,
      width: 1180,
      height: 720,
    }),
  },
];

export const DEFAULT_PROJECT: Project = SAMPLES[0]!.project;
