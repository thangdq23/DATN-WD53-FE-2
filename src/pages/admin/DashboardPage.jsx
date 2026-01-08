import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Space,
  Typography,
  Select,
  DatePicker,
  Button,
  Radio,
  Table,
  Divider,
} from "antd";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import {
  getOverviewStats,
  getOverviewRange,
  getTopMoviesByTickets,
  getTopRevenueMovies,
  getShowtimeStats,
  getRoomStats,
} from "../../common/services/stats.service";

const { Title, Text } = Typography;

const granOptions = [
  { label: "Giờ", value: "hour" },
  { label: "Ngày", value: "day" },
  { label: "Tháng", value: "month" },
  { label: "Năm", value: "year" },
];

const DashboardPage = () => {
  const [overview, setOverview] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [granularity, setGranularity] = useState("day");
  const [pickerValue, setPickerValue] = useState(null);
  const [chartType, setChartType] = useState("bar");
  const [topTickets, setTopTickets] = useState([]);
  const [topRevenue, setTopRevenue] = useState([]);
  const [showtimeStats, setShowtimeStats] = useState(null);
  const [roomStats, setRoomStats] = useState(null);

  const loadOverview = async (params) => {
    const d = await getOverviewStats(params);
    setOverview(d);
  };

  const loadChart = async (params) => {
    const res = await getOverviewRange(params);
    setChartData(res.result || res || []);
  };

  const loadTop = async (params) => {
    const t = await getTopMoviesByTickets(params);
    setTopTickets(t.result || []);
    const r = await getTopRevenueMovies(params);
    setTopRevenue(r.result || []);
  };

  const loadShowtimeRoom = async (params) => {
    const s = await getShowtimeStats(params);
    setShowtimeStats(s);
    const rm = await getRoomStats(params);
    setRoomStats(rm);
  };

  useEffect(() => {
    (async () => {
      await loadOverview();
      const to = new Date();
      const from = dayjs().subtract(29, "day").startOf("day").toDate();
      await loadChart({
        createdAtFrom: from.toISOString(),
        createdAtTo: to.toISOString(),
        granularity: "day",
      });
      await loadTop({
        createdAtFrom: from.toISOString(),
        createdAtTo: to.toISOString(),
      });
      await loadShowtimeRoom({
        createdAtFrom: from.toISOString(),
        createdAtTo: to.toISOString(),
      });
    })();
  }, []);

  const applyFilter = async () => {
    const params = {};
    if (pickerValue) {
      const p = pickerValue;
      if (granularity === "hour") {
        params.createdAtFrom = p.startOf("hour").toISOString();
        params.createdAtTo = p.endOf("hour").toISOString();
      } else if (granularity === "day") {
        params.createdAtFrom = p.startOf("day").toISOString();
        params.createdAtTo = p.endOf("day").toISOString();
      } else if (granularity === "month") {
        params.createdAtFrom = p.startOf("month").toISOString();
        params.createdAtTo = p.endOf("month").toISOString();
      } else if (granularity === "year") {
        params.createdAtFrom = p.startOf("year").toISOString();
        params.createdAtTo = p.endOf("year").toISOString();
      }
    }
    await loadOverview(params);
    await loadChart({ ...params, granularity });
    await loadTop(params);
    await loadShowtimeRoom(params);
  };

  const movieColumns = [
    { title: "Phim", dataIndex: "movieName", key: "movieName" },
    { title: "Số vé", dataIndex: "tickets", key: "tickets" },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (v) => v?.toLocaleString("vi-VN"),
    },
  ];

  return (
    <div>
      <Title level={3}>Báo cáo tổng quan</Title>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Text type="secondary">Tổng doanh thu</Text>
            <div style={{ fontSize: 20, fontWeight: 600 }}>
              {overview?.revenue?.total?.toLocaleString("vi-VN") || 0} đ
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Text type="secondary">Tổng vé đã bán</Text>
            <div style={{ fontSize: 20, fontWeight: 600 }}>
              {overview?.order?.total || 0}
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Space>
                <Text>Chi tiết theo</Text>
                <Select
                  options={granOptions}
                  value={granularity}
                  onChange={(v) => setGranularity(v)}
                  style={{ width: 120 }}
                />
                <DatePicker
                  picker={
                    granularity === "month"
                      ? "month"
                      : granularity === "year"
                      ? "year"
                      : "date"
                  }
                  showTime={granularity === "hour"}
                  value={pickerValue}
                  onChange={(v) => setPickerValue(v)}
                />
                <Button type="primary" onClick={applyFilter}>
                  Áp dụng
                </Button>
              </Space>
              <Radio.Group
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                <Radio.Button value="bar">Bar</Radio.Button>
                <Radio.Button value="line">Line</Radio.Button>
              </Radio.Group>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={16}>
          <Card title="Doanh thu / Vé">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "bar" ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" />
                  <Bar dataKey="tickets" fill="#82ca9d" />
                </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  {chartData.length && chartData[0].revenue !== undefined ? (
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                  ) : null}
                  {chartData.length && chartData[0].tickets !== undefined ? (
                    <Line type="monotone" dataKey="tickets" stroke="#82ca9d" />
                  ) : null}
                </LineChart>
              )}
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Phim bán chạy (Top 5)">
            <Title level={5}>Theo số vé</Title>
            <Table
              dataSource={topTickets}
              columns={movieColumns}
              pagination={false}
              rowKey={(r) => r._id}
              size="small"
            />
            <Divider />
            <Title level={5}>Theo doanh thu</Title>
            <Table
              dataSource={topRevenue}
              columns={movieColumns}
              pagination={false}
              rowKey={(r) => r._id}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="Suất chiếu">
            <div>Tổng suất chiếu: {showtimeStats?.totalShowtimes ?? "-"}</div>
            <Divider />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Phòng chiếu">
            <div>Tổng phòng chiếu: {roomStats?.totalRooms ?? "-"}</div>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Tổng quan khác">
            <div>Từ: {overview?.queryTime?.current?.from || "-"}</div>
            <div>Đến: {overview?.queryTime?.current?.to || "-"}</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
