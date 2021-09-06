/* eslint-disable react/prop-types */
import React, {
  FC,
  useCallback,
  useReducer,
  useContext,
  createContext,
  useMemo,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  useEffect,
} from "react";
import {
  getColor,
  AutoGetLoc,
  ValidColor,
  Variant,
  ColorSet,
  colors,
  FlowpointInfo,
  Position,
} from "./Helpers";

function reducePositions(
  old: Record<string, FlowpointInfo>,
  newValue: { action?: string; key: string; value?: FlowpointInfo }
) {
  if (newValue.action === "DELETE") {
    delete old[newValue.key];
    return { ...old };
  } else if (old[newValue.key] !== newValue.value) {
    return { ...old, [newValue.key]: newValue.value } as Record<
      string,
      FlowpointInfo
    >;
  } else return old;
}
type UpdateFlowpoint = (key: string, info: FlowpointInfo) => void;
type DeleteFlowpoint = (key: string) => void;
const context = createContext<{
  updateFlowpoint: UpdateFlowpoint;
  deleteFlowpoint: DeleteFlowpoint;
  selected: string[];
  spaceColor: ColorSet;
  variant: Variant;
  theme: ValidColor;
  scale: number;
}>({
  updateFlowpoint: () => {
    return;
  },
  deleteFlowpoint: () => {
    return;
  },
  selected: [],
  spaceColor: colors.red,
  variant: "paper",
  theme: "indigo",
  scale: 1.0,
});
export function useFlowspace(): {
  updateFlowpoint: UpdateFlowpoint;
  deleteFlowpoint: DeleteFlowpoint;
  selected: string[];
  spaceColor: ColorSet;
  variant: Variant;
  theme: ValidColor;
  scale: number;
} {
  const {
    updateFlowpoint,
    deleteFlowpoint,
    selected,
    spaceColor,
    variant,
    theme,
    scale,
  } = useContext(context);
  return {
    updateFlowpoint,
    deleteFlowpoint,
    selected,
    spaceColor,
    variant,
    theme,
    scale,
  };
}
const { Provider } = context;
const Flowspace: FC<{
  onClick?: (e: ReactMouseEvent) => void;
  theme?: ValidColor;
  background?: ValidColor;
  selected?: string[];
  getDiagramRef: Function;
  style?: Record<string, string>;
  connectionSize?: number;
  noFade?: boolean;
  variant?: Variant;
  avoidCollisions?: boolean;
  arrowStart?: boolean;
  arrowEnd?: boolean;
  selectedLine?: { a: string; b: string };
  onLineClick?: (key_a: string, key_b: string) => void;
  onDragEnd?: (key: string, pos: Position) => void;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  gridX?: number;
  gridY?: number;
  dotColor?: string;
  dotSize?: number;
}> = (props) => {
  const {
    children,
    scale = 1,
    offsetX = 0,
    offsetY = 0,
    gridX = 20,
    gridY = 20,
    dotColor = "red",
    dotSize = 10,
  } = props;
  useEffect(() => {
    console.log("Hi there this is scale for me", scale);
  }, [scale]);
  const theme_colors = getColor(props.theme || "indigo");
  const background_color = getColor(props.background || "white");

  const [flowPoints, updatePositions] = useReducer(reducePositions, {});
  const updateFlowpoint: UpdateFlowpoint = useCallback(
    (key: string, value: FlowpointInfo) => {
      updatePositions({ key, value, action: "UPDATE" });
      switch (value.event) {
        case "dragEnd": {
          if (props.onDragEnd) props.onDragEnd(key, value.position);
        }
      }
    },
    [updatePositions]
  );
  const deleteFlowpoint: DeleteFlowpoint = useCallback(
    (key: string) => {
      updatePositions({ key, action: "DELETE" });
    },
    [updatePositions]
  );
  const value = useMemo(
    () => ({
      updateFlowpoint,
      deleteFlowpoint,
      spaceColor: background_color,
      variant: props.variant || "paper",
      theme: props.theme || "indigo",
      selected: props.selected || [],
      scale: props.scale || 1,
    }),
    [
      updateFlowpoint,
      deleteFlowpoint,
      background_color,
      props.variant,
      props.theme,
      props.selected,
      props.scale,
    ]
  );
  const handleFlowspaceClick = useCallback(
    (e: ReactMouseEvent) => {
      if (props.onClick) {
        const isSpaceClick = (() => {
          if (e.target) {
            const className = (e.target as HTMLElement).className;
            //@TODO replace with a classlist reference
            const svgClassName = (e.target as SVGElement).className;
            const test = ["flowcontainer", "flowspace", "flowconnections"];
            if (test.includes(svgClassName.baseVal)) return true;
            if (test.includes(className)) return true;
          }
          return false;
        })();
        if (isSpaceClick) {
          props.onClick(e);
          e.stopPropagation();
        }
      }
    },
    [props.onClick]
  );

  const connections = Object.entries(flowPoints)
    .map(([pointKey, { outputs }]) =>
      Object.entries(outputs).map(([out_key, output]) => ({
        a: pointKey,
        b: out_key,
        width: output.width || props.connectionSize || 4,
        outputLoc: output.output || "auto",
        inputLoc: output.input || "auto",
        outputColor: output.outputColor || theme_colors.p,
        inputColor:
          output.inputColor || props.noFade ? theme_colors.p : theme_colors.a,
        arrowStart: output.arrowStart,
        arrowEnd: output.arrowEnd,
        dash:
          typeof output.dash !== "undefined" && output.dash > 0
            ? output.dash
            : undefined,
        onClick: (e: ReactMouseEvent) => {
          if (output.onClick) {
            output.onClick(pointKey, out_key, e);
          }
          if (props.onLineClick) {
            props.onLineClick(pointKey, out_key);
          }
        },
      }))
    )
    .reduce((acc, val) => acc.concat(val), []);
  const { maxX, maxY } = Object.values(flowPoints).reduce(
    (old, { position: { y, x, height, width } }) => {
      return {
        maxX: Math.max(old.maxX, x + 4 * width),
        maxY: Math.max(old.maxY, y + 4 * height),
      };
    },
    { maxX: 0, maxY: 0 }
  ) as { maxX: number; maxY: number };
  // Helper variables
  const paths: ReactNode[] = [];
  const gradients: ReactNode[] = [];
  const defs: Record<string, ReactNode> = {};
  defs["background"] = (
    <pattern
      id="bg"
      patternUnits="userSpaceOnUse"
      height={gridY * scale}
      width={gridX * scale}
    >
      <circle
        cx={((scale * gridX) / 2).toFixed(2)}
        cy={((scale * gridY) / 2).toFixed(2)}
        r={(scale * dotSize).toFixed(2)}
        fill={dotColor}
      />
    </pattern>
  );
  connections.forEach((connection) => {
    if (!flowPoints[connection.a] || !flowPoints[connection.b]) {
      //   console.warn(
      //     "Flowpoints error: Connection without connection no both ends",
      //     connection.a,
      //     connection.b
      //   );
      return;
    }
    const pa = flowPoints[connection.a].position;
    const pb = flowPoints[connection.b].position;
    const con_key = `${connection.a}_${connection.b}`;
    const grad_name = `grad_${con_key}`;
    const positions = AutoGetLoc(
      pa,
      pb,
      connection.outputLoc,
      connection.inputLoc,
      connection.a,
      connection.b,
      flowPoints,
      props.avoidCollisions !== false
    );
    const markerStart =
      connection.arrowStart !== undefined
        ? connection.arrowStart
        : props.arrowStart !== undefined
        ? props.arrowStart
        : false;

    const markerEnd =
      connection.arrowEnd !== undefined
        ? connection.arrowEnd
        : props.arrowEnd !== undefined
        ? props.arrowEnd
        : false;

    if (markerStart)
      defs[connection.outputColor] = (
        <marker
          id={"arrow" + connection.outputColor}
          viewBox="0 0 50 50"
          markerWidth="5"
          markerHeight="5"
          refX="45"
          refY="24"
          orient="auto-start-reverse"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L50,20 v8 L0,48 L6,24 Z"
            fill={connection.outputColor}
            strokeWidth="0"
            opacity="1"
          />
        </marker>
      );
    if (markerEnd)
      defs[connection.inputColor] = (
        <marker
          id={"arrow" + connection.inputColor}
          viewBox="0 0 50 50"
          markerWidth="5"
          markerHeight="5"
          refX="45"
          refY="24"
          orient="auto-start"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L50,20 v8 L0,48 L6,24 Z"
            fill={connection.inputColor}
            strokeWidth="0"
            opacity="1"
          />
        </marker>
      );
    const d = Math.round(
      Math.pow(
        Math.pow(positions.output.x - positions.input.x, 2) +
          Math.pow(positions.output.y - positions.input.y, 2),
        0.5
      ) / 2
    );
    const pathkey = `path_${connection.a}_${connection.b}`;
    const isSelectedLine =
      props.selectedLine &&
      props.selectedLine.a === connection.a &&
      props.selectedLine.b === connection.b;

    paths.push(
      <path
        key={pathkey}
        className="flowconnection"
        style={{
          transition: "stroke-width 0.15s ease-in-out",
          strokeDasharray: connection.dash,
        }}
        d={
          "M" +
          positions.output.x +
          "," +
          positions.output.y +
          "C" +
          (positions.output.x +
            (positions.output.offsetX > 0
              ? Math.min(d, positions.output.offsetX)
              : Math.max(-d, positions.output.offsetX))) +
          "," +
          (positions.output.y +
            (positions.output.offsetY > 0
              ? Math.min(d, positions.output.offsetY)
              : Math.max(-d, positions.output.offsetY))) +
          " " +
          (positions.input.x +
            (positions.input.offsetX > 0
              ? Math.min(d, positions.input.offsetX)
              : Math.max(-d, positions.input.offsetX))) +
          "," +
          (positions.input.y +
            (positions.input.offsetY > 0
              ? Math.min(d, positions.input.offsetY)
              : Math.max(-d, positions.input.offsetY))) +
          " " +
          (positions.input.x - 0.01) +
          "," +
          (positions.input.y - 0.01)
        }
        fill="none"
        stroke={"url(#" + grad_name + ")"}
        strokeWidth={connection.width + (isSelectedLine ? 3 : 0)}
        onClick={connection.onClick}
        markerStart={
          markerStart ? "url(#arrow" + connection.outputColor + ")" : undefined
        }
        markerEnd={
          markerEnd ? "url(#arrow" + connection.inputColor + ")" : undefined
        }
      />
    );
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 0, y: 0 };
    const maxD =
      Math.max(
        Math.abs(positions.output.x - positions.input.x),
        Math.abs(positions.output.y - positions.input.y)
      ) + 1e-5;
    if (
      Math.abs(positions.output.x - positions.input.x) >
      Math.abs(positions.output.y - positions.input.y)
    ) {
      if (positions.output.x > positions.input.x) {
        p1.x = maxD;
      } else {
        p2.x = maxD;
      }
    } else {
      if (positions.output.y > positions.input.y) {
        p1.y = maxD;
      } else {
        p2.y = maxD;
      }
    }
    p1.x /= maxD;
    p1.y /= maxD;
    p2.x /= maxD;
    p2.y /= maxD;

    // Adding gradient to list
    gradients.push(
      <linearGradient
        key={grad_name}
        id={grad_name}
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
      >
        <stop offset="0" stopColor={connection.outputColor} />
        <stop offset="1" stopColor={connection.inputColor} />
      </linearGradient>
    );
  });

  // Adding scroll (settings for overflow will be overwritten if defined by user)
  const style = {
    overflow: "scroll",
    backgroundColor: background_color.p,
    ...(props.style || {}),
  };

  return (
    <Provider value={value}>
      <div
        style={style}
        onClick={(e) => {
          handleFlowspaceClick(e);
        }}
        className="flowcontainer"
      >
        <div
          style={{
            // width: maxX,
            // height: maxY,
            height: "100%",
            width: "100%",
            position: "relative",
            overflow: "visible",
          }}
          className="flowspace"
        >
          <div
            ref={(ref) => {
              if (props.getDiagramRef) props.getDiagramRef(ref);
            }}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: background_color.p,
            }}
          >
            <svg
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                overflow: "visible",
              }}
              className="flowconnections"
            >
              <defs>{Object.values(defs)}</defs>

              <rect height="100%" width="100%" fill="url(#bg)"></rect>
              <g
                transform={` translate(${offsetX}, ${offsetY}), scale(${scale})`}
                // transform="translate(785.2676132180397,317.0503679935596) scale(1.010352888288932)"
              >
                {gradients}
                {paths}
                {children}
              </g>
            </svg>
          </div>
        </div>
      </div>
    </Provider>
  );
};
export default Flowspace;
