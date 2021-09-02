/* eslint-disable react/prop-types */
import React, {
  FC,
  useEffect,
  useRef,
  useState,
  MutableRefObject,
  useCallback,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";

import {
  CalcPos,
  ColorSet,
  getColor,
  Output,
  ValidColor,
  Variant,
} from "./Helpers";
import { useFlowspace } from "./Flowspace";
// Component class
interface FlowpointProps {
  id: string;
  snap?: { x: number; y: number };
  dragX?: boolean;
  dragY?: boolean;
  minX?: number;
  minY?: number;
  width?: number;
  height?: number;
  startPosition?: { x: number; y: number };
  onClick?: Function;
  onDragEnd?: Function;
  onDrag?: Function;
  onTouch?: Function;
  onHover?: Function;
  spaceColor?: ColorSet;
  theme: ValidColor;
  variant?: Variant;
  selected?: boolean;
  style?: Record<string, string>;
  outputs: Record<string, Output>;
}
const usePropState = function <T>(
  def: T,
  basis: T | undefined,
  reference: MutableRefObject<boolean>
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(
    typeof basis === "undefined" ? def : basis
  );
  useEffect(() => {
    if (basis !== undefined && value !== basis) {
      setValue(basis);
    }
  }, [basis]);
  reference.current = true;
  return [value, setValue];
};
const Flowpoint: FC<FlowpointProps> = (props) => {
  const { updateFlowpoint, deleteFlowpoint, scale, ...flowSpace } =
    useFlowspace();
  const { id, children } = props;
  const doTellFlowspace = useRef(true);
  const useDT = function <T>(def: T, basis: T | undefined) {
    return usePropState(def, basis, doTellFlowspace);
  };
  const [snap] = useDT({ x: 1, y: 1 }, props.snap);
  const [dragX] = useDT(true, props.dragX);
  const [dragY] = useDT(true, props.dragY);
  const [minX] = useDT(0, props.minX);
  const [minY] = useDT(0, props.minY);
  const [width] = useDT(150, props.width);
  const [height] = useDT(50, props.height);
  const [pos, setPos] = useDT({ x: 0, y: 0 }, props.startPosition);
  const [drag, setDrag] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const didDragRef = useRef(false);

  const onTouchStart = useCallback(
    (e: ReactTouchEvent) => {
      if ((e?.target as Element)?.className.includes("nodrag")) return;
      didDragRef.current = false;

      setDrag(true);
      setRel({
        x: e.touches[0].pageX / scale - pos.x,
        y: e.touches[0].pageY / scale - pos.y,
      });
      e.preventDefault();
      e.stopPropagation();
    },
    [pos, scale]
  );
  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!didDragRef.current) {
        if (props.onTouch) props.onTouch(e);
      } else {
        tellFlowspace();
      }
      setDrag(false);
      e.stopPropagation();
      e.preventDefault();
    },
    [props.onTouch]
  );
  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!drag) return;
      didDragRef.current = true;
      setPos({
        x: dragX
          ? CalcPos(e.touches[0].pageX / scale - rel.x, snap.x, minX)
          : pos.x,
        y: dragY
          ? CalcPos(e.touches[0].pageY / scale - rel.y, snap.y, minY)
          : pos.y,
      });
      if (props.onDrag) props.onDrag(e);
      e.stopPropagation();
      e.preventDefault();
    },
    [props.onDrag, snap, minX, minY, dragX, dragY, scale, rel, pos, drag]
  );
  const onMouseOver = useCallback(() => {
    if (props.onHover) props.onHover(true);
  }, [props.onHover]);
  const onMouseOut = useCallback(() => {
    if (props.onHover) props.onHover(false);
  }, [props.onHover]);
  const onMouseDown = useCallback(
    (e: ReactMouseEvent) => {
      if (e.button !== 0) return;
      if ((e.target as Element).className.includes("nodrag")) return;
      didDragRef.current = false;
      setDrag(true);
      setRel({ x: e.pageX / scale - pos.x, y: e.pageY / scale - pos.y });
      e.stopPropagation();
      e.preventDefault();
    },
    [pos, scale]
  );
  const onMouseUp = useCallback(
    (e: ReactMouseEvent) => {
      if (!didDragRef.current && props.onClick) props.onClick(e);
      setDrag(false);
      // tellFlowspace();
      e.stopPropagation();
      e.preventDefault();
    },
    [props.onClick]
  );
  const onMouseUpDrag = useCallback(
    (e: MouseEvent) => {
      if (didDragRef.current) {
        setDrag(false);
        const newPos = {
          x: dragX ? CalcPos(e.pageX / scale - rel.x, snap.x, minX) : pos.x,
          y: dragY ? CalcPos(e.pageY / scale - rel.y, snap.y, minY) : pos.y,
        };
        setPos(newPos);
        if (props.onDragEnd) props.onDragEnd(newPos);

        tellFlowspace(newPos);
      }
      e.stopPropagation();
      e.preventDefault();
    },
    [dragX, rel, snap, minX, dragY, minY, props.onDragEnd, scale]
  );
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!drag) return;
      didDragRef.current = true;
      console.log("scale is", scale);
      const newPos = {
        x: dragX
          ? CalcPos(e.pageX / scale - rel.x, snap.x * scale, minX)
          : pos.x,
        y: dragY
          ? CalcPos(e.pageY / scale - rel.y, snap.y * scale, minY)
          : pos.y,
      };
      console.log(
        "Pos is ",
        JSON.stringify(newPos),
        JSON.stringify(props.startPosition)
      );
      setPos(newPos);
      if (props.onDrag) props.onDrag(newPos);
      tellFlowspace(newPos);
      e.stopPropagation();
      e.preventDefault();
    },
    [drag, dragX, rel, snap, minX, dragY, minY, props.onDrag, scale]
  );
  useEffect(() => {
    if (drag) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("touchend", onTouchEnd);
      document.addEventListener("mouseup", onMouseUpDrag);
    } else {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("mouseup", onMouseUpDrag);
    }
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("mouseup", onMouseUpDrag);
    };
  }, [drag]);
  const tellFlowspace = useCallback(
    (newPos?: { x: number; y: number }) => {
      const p = newPos ? newPos : pos;
      updateFlowpoint(
        id,

        {
          position: {
            x: p.x,
            y: p.y,
            width,
            height,
            offsetX: 0,
            offsetY: 0,
          },
          outputs: props.outputs,
        }
      );
    },
    [pos, width, height, id, updateFlowpoint]
  );
  useEffect(() => {
    if (doTellFlowspace.current) {
      tellFlowspace();
    }
    doTellFlowspace.current = false;
  }, [tellFlowspace]);
  useEffect(() => {
    return () => {
      deleteFlowpoint(id);
    };
  }, [deleteFlowpoint, id]);

  // Colors
  const c = getColor(props.theme ? props.theme : flowSpace.theme);

  // Prepping default style (and adds updated position)
  const style: {
    width: number;
    height: number;
    // left: string;
    // top: string;
    position: "absolute" | "relative" | "fixed";
    transition: string;
    backgroundColor: string;
    color: string;
    boxShadow?: string;
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
    fontWeight?: number;
    borderStyle?: string;
    cursor: string;
  } = {
    width,
    height,
    // left: pos.x + "px",
    // top: pos.y + "px",
    position: "absolute",
    transition: [
      "border-color 0.4s ease-out",
      "background-color 0.4s ease-out",
    ].join(","),
    backgroundColor: (props.spaceColor || flowSpace.spaceColor).p,
    color:
      (props.spaceColor || flowSpace.spaceColor).t === "light"
        ? "#ffffff"
        : "#000000",
    cursor: "grab",
  };

  // Paper?
  const variant = props.variant ? props.variant : flowSpace.variant;
  const selected =
    typeof props.selected === "undefined"
      ? flowSpace.selected.includes(props.id)
      : props.selected;
  if (variant === "paper") {
    style.boxShadow = selected
      ? "2px 2px 3px rgba(0,0,0,0.12), 0 3px 3px rgba(0,0,0,0.24)"
      : "2px 2px 3px rgba(0,0,0,0.12), 0 1px 1px rgba(0,0,0,0.24)";
  }

  // Outlined?
  else if (variant === "outlined") {
    style.borderColor = selected ? c.o : c.p;
    style.borderStyle = "solid";
    style.borderWidth = "1px";
    style.borderRadius = "5px";
  }

  // Filled?
  else if (variant === "filled") {
    style.backgroundColor = selected ? c.s : c.p;
    style.color = c.t === "light" ? "#ffffff" : "#000000";
    style.borderColor = style.backgroundColor;
    style.borderStyle = "solid";
    style.borderWidth = "1px";
    style.borderRadius = "5px";
    style.fontWeight = 500;
  }
  // Returning finished Flowpoint
  const finalStyle = { ...style, ...(props.style || {}) };
  return (
    <foreignObject x={pos.x} y={pos.y} height={height} width={width}>
      <div
        className="flowpoint"
        key={id}
        style={finalStyle}
        onMouseOver={() => {
          onMouseOver();
        }}
        onMouseOut={() => {
          onMouseOut();
        }}
        onMouseDown={(e) => {
          onMouseDown(e);
        }}
        onTouchStart={(e) => {
          onTouchStart(e);
        }}
        onClick={(e) => {
          if (didDragRef.current === false) {
            onMouseUp(e);
          }
          didDragRef.current = false;
          // e.preventDefault();
          // e.stopPropagation();
        }}
      >
        {children}
      </div>
    </foreignObject>
  );
};
export default Flowpoint;
