import React from "react";
import { Tabs } from "antd";

const { TabPane } = Tabs;

const MovieTabs = ({ tabKey, onChange }) => (
  <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
    <Tabs activeKey={tabKey} onChange={onChange} centered>
      <TabPane
        tab={
          <span style={{ fontSize: 20, fontWeight: 700 }}>PHIM SẮP CHIẾU</span>
        }
        key="upcoming"
      />
      <TabPane
        tab={
          <span style={{ fontSize: 20, fontWeight: 700 }}>PHIM ĐANG CHIẾU</span>
        }
        key="nowShowing"
      />
    </Tabs>
  </div>
);

export default MovieTabs;
