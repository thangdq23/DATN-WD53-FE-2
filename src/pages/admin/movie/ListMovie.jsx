import {
  FileAddOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Pagination,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Image,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";

import { useTable } from "../../../common/hooks/useTable";
import {
  getAllMovie,
  updateStatusMovie,
} from "../../../common/services/movie.service";
import FilterMovie from "./components/FilterMovie";
import { QUERY } from "../../../common/constants/queryKey";
import { statusRelease } from "../../../common/constants";
import { useMessage } from "../../../common/hooks/useMessage";
import { getAgeBadge } from "../../../common/utils/age";

const { Title, Text, Paragraph } = Typography;

const ListMovie = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { antdMessage, HandleError } = useMessage();
  const { query, onFilter, onSelectPaginateChange } = useTable();

  const { data, isPending } = useQuery({
    queryKey: [QUERY.MOVIE, ...Object.keys(query), ...Object.values(query)],
    queryFn: () =>
      getAllMovie({
        pagination: true,
        searchFields: ["name"],
        limit: 5,
        ...query,
      }),
  });

  const movies = data?.data || [];
  const meta = data?.meta || {};

  const { mutate } = useMutation({
    mutationFn: (id) => updateStatusMovie(id),
    onSuccess: ({ message }) => {
      antdMessage.success(message);
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey.includes(QUERY.MOVIE),
      });
    },
    onError: (err) => HandleError(err),
  });

  return (
    <div className="w-full min-h-[85dvh] rounded-md shadow-md px-6 py-4 bg-[#f5f7fb]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-0">Danh sách phim</h3>
        </div>

        <Link to="/admin/movies/create">
          <Button
            style={{ height: 38, borderRadius: 8 }}
            type="primary"
            icon={<FileAddOutlined />}
          >
            Thêm phim mới
          </Button>
        </Link>
      </div>

      <Card
        bordered={false}
        style={{
          marginBottom: 16,
          borderRadius: 16,
          background:
            "linear-gradient(90deg, rgba(226,232,255,0.9), rgba(240,249,255,0.95))",
        }}
      >
        <FilterMovie onFilter={onFilter} />
      </Card>

      <Row gutter={[24, 24]} className="mt-2">
        {movies.map((movie) => (
          <Col span={24} key={movie._id}>
            <Card
              bordered={false}
              style={{
                borderRadius: 18,
                boxShadow: "0 10px 30px rgba(15,23,42,0.15)",
              }}
              bodyStyle={{ padding: 16 }}
            >
              <Row gutter={16} align="middle">
                <Col xs={24} sm={6} md={4}>
                  <div
                    onClick={() => navigate(`/admin/movies/${movie._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <Image
                      src={movie.poster}
                      alt={movie.name}
                      width="100%"
                      style={{
                        borderRadius: 12,
                        objectFit: "cover",
                        maxHeight: 220,
                      }}
                      preview={false}
                    />
                  </div>
                </Col>

                <Col xs={24} sm={14} md={16}>
                  <Space style={{ marginBottom: 4 }} wrap>
                    <Text type="secondary" strong>
                      {movie._id?.slice(-8)}
                    </Text>
                    <Tag color={movie.status ? "blue" : "red"}>
                      {movie.status ? "Hoạt động" : "Đang khoá"}
                    </Tag>
                    {movie.isHot && <Tag color="red">Nổi bật</Tag>}
                    {movie.statusRelease && (
                      <Tag color={statusRelease[movie.statusRelease].color}>
                        {statusRelease[movie.statusRelease].label}
                      </Tag>
                    )}
                  </Space>

                  <Title
                    level={5}
                    style={{ margin: 0, cursor: "pointer" }}
                    onClick={() => navigate(`/admin/movies/${movie._id}`)}
                  >
                    {movie.name}
                  </Title>

                  <div style={{ marginTop: 8, fontSize: 13 }}>
                    <Paragraph style={{ marginBottom: 4 }}>
                      <Text strong>Thời gian chiếu: </Text>
                      {movie.duration} phút
                    </Paragraph>
                    <Paragraph style={{ marginBottom: 4 }}>
                      <Text strong>Ngôn ngữ: </Text>
                      {movie.language}
                      {movie.subTitleLanguage &&
                        ` (Phụ đề: ${movie.subTitleLanguage})`}
                    </Paragraph>
                    <Paragraph style={{ marginBottom: 4 }}>
                      <Text strong>Thể loại: </Text>
                      {movie.genreIds?.map((g) => g.name).join(", ") ||
                        "Chưa cập nhật"}
                    </Paragraph>
                    <Paragraph style={{ marginBottom: 4 }}>
                      <Text strong>Độ tuổi: </Text>
                      <Tooltip title={getAgeBadge(movie.ageRestriction).description}>
                        <Tag color={getAgeBadge(movie.ageRestriction).color}>
                          {getAgeBadge(movie.ageRestriction).label}
                        </Tag>
                      </Tooltip>
                    </Paragraph>
                    <Paragraph style={{ marginBottom: 0 }}>
                      <Text strong>Chiếu: </Text>
                      {dayjs(movie.releaseDate).format("YYYY-MM-DD")}{" "}
                      {" - "}
                      {dayjs(movie.endDate).format("YYYY-MM-DD")}
                    </Paragraph>
                  </div>
                </Col>

                <Col xs={24} sm={4} md={4} style={{ textAlign: "right" }}>
                  <Space direction="vertical">
                    <Button
                      icon={<EyeOutlined />}
                      onClick={() => navigate(`/admin/movies/${movie._id}`)}
                    />
                    <Button
                      icon={<EditOutlined />}
                      onClick={() =>
                        navigate(`/admin/movies/update/${movie._id}`)
                      }
                    />
                    <Button
                      danger={movie.status}
                      icon={movie.status ? <LockOutlined /> : <UnlockOutlined />}
                      onClick={() => mutate(movie._id)}
                    />
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}

        {!isPending && movies.length === 0 && (
          <Col span={24}>
            <Card>
              <Text>Không có phim nào.</Text>
            </Card>
          </Col>
        )}
      </Row>

      {!isPending && data && (
        <div className="mt-6 flex justify-end">
          <Pagination
            current={meta.page}
            total={meta.total}
            pageSize={meta.limit}
            onChange={onSelectPaginateChange}
          />
        </div>
      )}
    </div>
  );
};

export default ListMovie;
