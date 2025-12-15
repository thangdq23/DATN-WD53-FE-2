import React from "react";
import { App } from "antd";

export const useMessage = () => {
  const { message: antdMessage } = App.useApp();

  const HandleError = (error, options = {}) => {
    const {
      type = "error",
      field = "message",
      fallback = "Đã có lỗi xảy ra!",
      silent = false,
    } = options;

    const msg =
      (error?.response?.data && error.response.data[field]) ||
      error?.message ||
      fallback;

    if (!silent) antdMessage[type](msg);

    return msg;
  };

  const Logo = () =>
    React.createElement(
      "svg",
      {
        viewBox: "0 0 120 120",
        width: 28,
        height: 28,
        style: { borderRadius: 8 },
      },
      React.createElement(
        "defs",
        null,
        React.createElement(
          "linearGradient",
          { id: "mpvGrad", x1: "0", y1: "0", x2: "1", y2: "1" },
          React.createElement("stop", { offset: "0%", stopColor: "#ef4444" }),
          React.createElement("stop", { offset: "100%", stopColor: "#dc2626" }),
        ),
      ),
      React.createElement("rect", {
        x: 0,
        y: 0,
        width: 120,
        height: 120,
        rx: 20,
        fill: "url(#mpvGrad)",
      }),
      React.createElement(
        "text",
        {
          x: 60,
          y: 75,
          fontSize: 54,
          fontWeight: 800,
          textAnchor: "middle",
          fill: "#ffffff",
        },
        "MPV",
      ),
    );

  const showMessage = ({ type = "info", title, description, duration = 3 }) => {
    const content = React.createElement(
      "div",
      { style: { display: "flex", alignItems: "center", gap: 12 } },
      React.createElement(Logo),
      React.createElement(
        "div",
        null,
        title
          ? React.createElement("div", { style: { fontWeight: 700 } }, title)
          : null,
        description
          ? React.createElement("div", { style: { opacity: 0.9 } }, description)
          : null,
      ),
    );
    antdMessage.open({ type, content, duration });
  };

  return { HandleError, antdMessage, showMessage };
};
