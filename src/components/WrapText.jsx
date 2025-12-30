import { Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";

const TextWrap = ({ text, style, className }) => {
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsTruncated(
        el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight,
      );
    }
  }, [text, textRef]);

  const textElement = (
    <p
      ref={textRef}
      style={{ margin: 0, ...style }}
      className={`line-clamp-1 ${className}`}
    >
      {text}
    </p>
  );

  return isTruncated ? (
    <Tooltip title={text} placement="top">
      {textElement}
    </Tooltip>
  ) : (
     <p style={{ ...style }}>{textElement}</p>
  );
};

export default TextWrap;