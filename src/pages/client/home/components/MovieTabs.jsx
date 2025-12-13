import React from "react";
import { Tabs } from "antd";

const MovieTabs = ({ tabKey, onChange }) => {
  const items = [
    {
      key: "nowShowing",
      label: <span style={{ fontSize: 18, fontWeight: 700 }}>Đang chiếu</span>,
    },
    {
      key: "upcoming",
      label: <span style={{ fontSize: 18, fontWeight: 700 }}>Sắp chiếu</span>,
    },
  ];
  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
      <Tabs
        activeKey={tabKey}
        onChange={onChange}
        centered
        items={items}
      />
    </div>
  );
};

export default MovieTabs;
