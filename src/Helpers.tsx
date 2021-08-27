// Helps calculate new positions on drag
import { MouseEvent as ReactMouseEvent } from "react";
export interface Point {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
}
export interface Position extends Point {
  height: number;
  width: number;
}
export type Location = "top" | "bottom" | "left" | "right" | "auto";
export type Output = {
  width?: number;
  output?: Location;
  input?: Location;
  outputColor?: string;
  inputColor?: string;
  arrowStart?: boolean;
  arrowEnd?: boolean;
  dash?: number;
  onClick?: (pointKey: string, outKey: string, e: ReactMouseEvent) => void;
};

export type FlowpointInfo = {
  position: Position;
  outputs: Record<string, Output>;
};
export type Variant = "paper" | "outlined" | "filled";
export function CalcPos(pos: number, snap: number, minimum: number): number {
  return Math.max(minimum, Math.round(pos + snap - (pos % snap)));
}

export const colors: { [key: string]: ColorSet } = {
  red: {
    p: "#d50000",
    s: "#950000",
    a: "#AE00D5",
    t: "light",
    o: "#00c853",
  },
  pink: {
    p: "#c51162",
    s: "#890b44",
    a: "#7811C5",
    t: "light",
    o: "#64dd17",
  },
  purple: {
    p: "#aa00ff",
    s: "#7600b2",
    a: "#000FFF",
    t: "light",
    o: "#aeea00",
  },
  "deep-purple": {
    p: "#6200ea",
    s: "#4400a3",
    a: "#0046EA",
    t: "light",
    o: "#ffd600",
  },
  indigo: {
    p: "#304ffe",
    s: "#2137b1",
    a: "#30E0FE",
    t: "light",
    o: "#ffab00",
  },
  blue: {
    p: "#2962ff",
    s: "#1c44b2",
    a: "#29F9FF",
    t: "light",
    o: "#ff6d00",
  },
  "light-blue": {
    p: "#0091ea",
    s: "#0065a3",
    a: "#00EA99",
    t: "light",
    o: "#ff3d00",
  },
  green: {
    p: "#00c853",
    s: "#008c3a",
    a: "#54C800",
    t: "light",
    o: "#d50000",
  },
  "light-green": {
    p: "#64dd17",
    s: "#469a10",
    a: "#DDCB17",
    t: "dark",
    o: "#c51162",
  },
  lime: {
    p: "#aeea00",
    s: "#79a300",
    a: "#EABC00",
    t: "dark",
    o: "#aa00ff",
  },
  yellow: {
    p: "#ffd600",
    s: "#b29500",
    a: "#FF9000",
    t: "dark",
    o: "#6200ea",
  },
  amber: {
    p: "#ffab00",
    s: "#b27700",
    a: "#FF5100",
    t: "dark",
    o: "#304ffe",
  },
  orange: {
    p: "#ff6d00",
    s: "#b24c00",
    a: "#FF0A00",
    t: "light",
    o: "#2962ff",
  },
  "deep-orange": {
    p: "#ff3d00",
    s: "#b22a00",
    a: "#FF0084",
    t: "light",
    o: "#0091ea",
  },
  brown: {
    p: "#795548",
    s: "#543b32",
    a: "#79485D",
    t: "light",
    o: "#607d8b",
  },
  grey: {
    p: "#9e9e9e",
    s: "#6e6e6e",
    a: "#9e9e9e",
    t: "light",
    o: "#000000",
  },
  "blue-grey": {
    p: "#607d8b",
    s: "#435761",
    a: "#608B7A",
    t: "light",
    o: "#795548",
  },
  black: {
    p: "#000000",
    s: "#333333",
    a: "#435761",
    t: "light",
    o: "#ffffff",
  },
  white: {
    p: "#ffffff",
    s: "#6e6e6e",
    a: "#608b84",
    t: "dark",
    o: "#000000",
  },
};
export type ColorSet = {
  p: string;
  s: string;
  a: string;
  t: "light" | "dark";
  o: string;
};
export type ValidColor = keyof typeof colors;
// Colors
export function getColor(color?: ValidColor): ColorSet {
  if (color) return colors[color];
  //   return { p: color, s: color, a: "#304ffe", t: "light", o: "#ffab00" };
  return colors["black"];
  return { p: "#ffffff", s: "#6e6e6e", a: "#608b84", t: "dark", o: "#000000" };
}

// Get connector location
function GetConnectorLoc(p: Position, loc: Location) {
  const base_offset = 100;
  const location: Position = {
    x: p.x,
    y: p.y,
    offsetX: 0,
    offsetY: 0,
    height: 0,
    width: 0,
  };
  switch (loc) {
    case "top":
      location.x += Math.round(p.width / 2);
      location.offsetY = -base_offset;
      break;
    case "left":
      location.y += Math.round(p.height / 2);
      location.offsetX = -base_offset;
      break;
    case "right":
      location.x += p.width;
      location.y += Math.round(p.height / 2);
      location.offsetX = base_offset;
      break;
    case "bottom":
      location.x += Math.round(p.width / 2);
      location.y += p.height;
      location.offsetY = base_offset;
      break;
    default:
      location.x += Math.round(p.width / 2);
      location.y += Math.round(p.height / 2);
  }
  return location;
}

// Checking wether connection crashes with other flowpoints
function DoCrash(
  p1: Point,
  p2: Point,
  key1: string,
  key2: string,
  allPositions: { [key: string]: { position: Position } }
) {
  // Helpers
  const a = (p2.y - p1.y) / (p2.x - p1.x);
  const b = p1.y - a * p1.x;
  function getx(y: number) {
    return (y - b) / a;
  }
  function gety(x: number) {
    return a * x + b;
  }

  // Testing all positions
  for (const key in allPositions) {
    if (key !== key1 && key !== key2) {
      // Loop specifics
      const pt = allPositions[key].position;
      const x1 = getx(pt.y);
      const x2 = getx(pt.y + pt.height);
      const y1 = gety(pt.x);
      const y2 = gety(pt.x + pt.width);
      const p1x = p1.x + p1.offsetX;
      const p1y = p1.y + p1.offsetY;
      const p2x = p2.x + p2.offsetX;
      const p2y = p2.y + p2.offsetY;

      // Perfectly lined up?
      if (Math.abs(p1.x - p2.x) < 1) {
        if (pt.x < p1.x && p1.x < pt.x + pt.width) {
          if (Math.min(p1.y, p2.y) <= pt.y && pt.y <= Math.max(p1.y, p2.y)) {
            return true;
          }
        }
      }

      // Passing through box?
      if (
        Math.min(p1x, p2x) < pt.x + pt.width &&
        pt.x < Math.max(p1x, p2x) &&
        Math.min(p1y, p2y) < pt.y + pt.height &&
        pt.y < Math.max(p1y, p2y)
      ) {
        if (pt.x <= x1 && x1 <= pt.x + pt.width) return true;
        if (pt.x <= x2 && x2 <= pt.x + pt.width) return true;
        if (pt.y <= y1 && y1 <= pt.y + pt.height) return true;
        if (pt.y <= y2 && y2 <= pt.y + pt.height) return true;
      }
      if (
        Math.min(p1.x, p2.x) < pt.x + pt.width &&
        pt.x < Math.max(p1.x, p2.x) &&
        Math.min(p1.y, p2.y) < pt.y + pt.height &&
        pt.y < Math.max(p1.y, p2.y)
      ) {
        if (pt.x <= x1 && x1 <= pt.x + pt.width) return true;
        if (pt.x <= x2 && x2 <= pt.x + pt.width) return true;
        if (pt.y <= y1 && y1 <= pt.y + pt.height) return true;
        if (pt.y <= y2 && y2 <= pt.y + pt.height) return true;
      }
    }
  }

  // Returning
  return false;
}
const BLANKPOSITION: Position = {
  height: 0,
  width: 0,
  offsetX: 0,
  offsetY: 0,
  x: 0,
  y: 0,
};
// Auto connector locations
export function AutoGetLoc(
  pa: Position,
  pb: Position,
  aLoc: Location,
  bLoc: Location,
  key1: string,
  key2: string,
  allPositions: { [key: string]: { position: Position } },
  avoidCollisions: boolean
): { input: Position; output: Position } {
  if (aLoc === "auto" || bLoc === "auto") {
    const positions: Location[] = ["top", "right", "left", "bottom"];
    const best: { d: number; output: Position; input: Position } = {
      d: Infinity,
      output: BLANKPOSITION,
      input: BLANKPOSITION,
    };
    const bestNoCrash: { d: number; output: Position; input: Position } = {
      d: Infinity,
      output: BLANKPOSITION,
      input: BLANKPOSITION,
    };
    positions.forEach((posA) => {
      const p1 = GetConnectorLoc(pa, posA);
      positions.forEach((posB) => {
        const p2 = GetConnectorLoc(pb, posB);
        const d = Math.sqrt(
          Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
        );
        if (d < best.d) {
          best.d = d;
          best.output = p1;
          best.input = p2;
        }

        if (avoidCollisions) {
          if (d < bestNoCrash.d && !DoCrash(p1, p2, key1, key2, allPositions)) {
            bestNoCrash.d = d;
            bestNoCrash.output = p1;
            bestNoCrash.input = p2;
          }
        }
      });
    });
    return {
      output:
        aLoc === "auto"
          ? bestNoCrash.d !== Infinity
            ? bestNoCrash.output
            : best.output
          : GetConnectorLoc(pa, aLoc),
      input:
        bLoc === "auto"
          ? bestNoCrash.d !== Infinity
            ? bestNoCrash.input
            : best.input
          : GetConnectorLoc(pb, bLoc),
    };
  } else {
    return {
      output: GetConnectorLoc(pa, aLoc),
      input: GetConnectorLoc(pb, bLoc),
    };
  }
}
