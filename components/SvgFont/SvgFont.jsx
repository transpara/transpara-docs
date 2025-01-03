import React, { useEffect, useState } from "react";
import selection from "@site/data/selection.json";
import "./style.css";

export default function SvgFont({ icon, size, rotate = false }) {
  const [path, setPath] = useState("");
  const data = selection.icons[parseInt(icon)];

  if (data.icon.paths) {
    useEffect(() => {
      const path = data.icon.paths.reduce((acc, curr) => acc + ` ${curr}`, "");
      setPath(path);
    }, []);

    const rotationStyle = rotate ? { transform: "rotate(90deg)" } : {};

    return (
      <span className="svg_container">
        <svg
          className="hidesvg"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <symbol
              id={data.properties.name}
              width={size}
              viewBox="0 0 1024 1024"
            >
              <title>{data.properties.name}</title>
              <path className="path1" d={path}></path>
            </symbol>
          </defs>
        </svg>
        <svg className="icon" style={rotationStyle}>
          <use href={`#${data.properties.name}`}></use>
        </svg>
      </span>
    );
  }
  return (
    <span className="svg_container">
      <span className="icon" dangerouslySetInnerHTML={{ __html: data.icon }} />
    </span>
  );
}
