import { Link, useNavigate, useParams } from "react-router";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Space,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDetailMovie,
  updateMovieAPI,
} from "../../../../common/services/movie.service";
import { upLoadImage } from "../../../../common/utils/upLoadImage";
import UploadImage from "../../../../components/UploadImage";
import { QUERY } from "../../../../common/constants/queryKey";
import { useMessage } from "../../../../common/hooks/useMessage";
import {
  COUNTRY_OPTIONS,
  LANGUAGE_OPTIONS,
} from "../../../../common/constants/language";
import { formRules } from "../../../../common/utils/formRule";
import { getAllGenre } from "../../../../common/services/genre.service";

const UpdateMovie = () => {
  const { id } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [isHot, setIsHot] = useState(false);

  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const { antdMessage, HandleError } = useMessage();

  const { data: genre } = useQuery({
    queryKey: [QUERY.GENRE],
    queryFn: () => getAllGenre({ status: true }),
  });


  const { data } = useQuery({
    queryKey: [QUERY.MOVIE, id],
    queryFn: async () => {
      const { data } = await getDetailMovie(id);
      if (data) {
        form.setFieldsValue({
          ...data,
          genreIds: data.genreIds.map((item) => item._id),
          ageRestriction: data.ageRestriction,
          releaseDate: dayjs(data.releaseDate),
          endDate: dayjs(data.endDate),
        });
        setIsHot(data.isHot);
      }
      return data;
    },
  });

  const genreOptions = (() => {
    const active = genre?.data || [];
    const existing = data ? data.genreIds || [] : [];

    // Normalize existing items to objects { _id, name }
    const existingNormalized = existing
      .map((g) => {
        if (!g) return null;
        if (typeof g === "string") {
          const found = active.find((a) => String(a._id) === String(g));
          return found ? found : { _id: g, name: "(Đã khoá)" };
        }
        // assume object with _id and name
        return g;
      })
      .filter(Boolean);

    const mergedById = new Map();
    active.forEach((a) => mergedById.set(String(a._id), a));
    existingNormalized.forEach((e) => mergedById.set(String(e._id), e));

    const merged = Array.from(mergedById.values());
    return merged.map((g) => ({ label: g.name, value: g._id }));
  })();

  const { mutateAsync } = useMutation({
    mutationFn: (payload) => updateMovieAPI(id, payload),
    onSuccess: ({ message }) => {
      antdMessage.success(message);
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(QUERY.MOVIE),
      });
      nav("/admin/movies");
    },
    onError: (err) => {
      HandleError(err);
      setLoading(false);
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);

    let posterUrl = values.poster;

    if (Array.isArray(values.poster)) {
      const fileObj = values.poster[0]?.originFileObj;
      if (fileObj) {
        posterUrl = await upLoadImage(fileObj);
        if (!posterUrl) {
          antdMessage.error("Upload ảnh thất bại");
          setLoading(false);
          return;
        }
      } else {
        // giữ lại link/url cũ
        posterUrl = values.poster[0]?.url || values.poster[0];
      }
    }

    // Tạo payload từ form
    const payload = {
      ...values,
      poster: posterUrl,
      isHot,
    };

    // Chuẩn hóa endDate luôn gửi
    if (values.endDate) {
      payload.endDate = dayjs(values.endDate).format("YYYY-MM-DD");
    }

    // Chuẩn hóa releaseDate nếu có
    if (values.releaseDate) {
      payload.releaseDate = dayjs(values.releaseDate).format("YYYY-MM-DD");
    }

    // ⚠️ Nếu phim KHÔNG còn ở trạng thái COMING_SOON -> không được phép đổi ngày công chiếu
    // => XÓA HOÀN TOÀN releaseDate khỏi payload
    if (data && data.statusRelease && data.statusRelease !== "COMING_SOON") {
      delete payload.releaseDate;
    }

    await mutateAsync(payload);
    setLoading(false);
  };

  // dùng để disable DatePicker ngày công chiếu cho đồng bộ UX
  const isReleaseLocked =
    data && data.statusRelease && data.statusRelease !== "COMING_SOON";

  return (
    <div className="w-full min-h-[85dvh] rounded-md shadow-md px-6 py-4 bg-[#f5f7fb]">
      <Link
        to="/admin/movies"
        className="text-black! hover:text-primary! hover:underline!"
      >
        Quay về danh sách
      </Link>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4 bg-white rounded-xl px-6 py-5"
      >
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <div>
            <h3 className="text-xl font-semibold m-0">Cập nhật phim</h3>
            <p className="text-sm text-gray-500 m-0">
              Chỉnh sửa poster, thông tin phim và lịch chiếu.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Phim nổi bật</span>
            <Switch
              checked={isHot}
              onChange={(checked) => setIsHot(checked)}
              style={{ transform: "scale(1.15)" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Cột trái */}
          <div className="col-span-12 md:col-span-4 space-y-5">
            <div className="border rounded-lg px-4 py-4">
              <h4 className="font-semibold text-base mb-3">Poster phim</h4>
              <Form.Item
                name={"poster"}
                valuePropName="value"
                getValueFromEvent={(e) => e}
                rules={[{ required: true, message: "Vui lòng tải ảnh lên!" }]}
                className="mb-0"
              >
                <UploadImage width={240} height={360} />
              </Form.Item>
            </div>

            <div className="border rounded-lg px-4 py-4 space-y-3">
              <h4 className="font-semibold text-base mb-1">
                Thông tin chiếu nhanh
              </h4>

              <Form.Item
                label="Thời gian chiếu (phút)"
                name={"duration"}
                required
                rules={[formRules.required("Thời gian chiếu phim")]}
              >
                <Space.Compact className="w-full">
                  <InputNumber
                    min={10}
                    max={360}
                    className="w-full"
                  />
                  <div className="px-3 h-10 flex items-center border border-solid border-[#d9d9d9] rounded-r-md bg-[#f5f5f5]">Phút</div>
                </Space.Compact>
              </Form.Item>

              <Form.Item
                label="Độ tuổi khán giả"
                name={"ageRestriction"}
                required
                rules={[formRules.required("Vui lòng chọn độ tuổi")]}
              >
                <Select
                  placeholder="Chọn độ tuổi"
                  options={[
                    { value: "P", label: "P - Phù hợp với mọi lứa tuổi" },
                    { value: "K", label: "K - Dành cho trẻ em" },
                    { value: "C13", label: "T13 - Trên 13 tuổi" },
                    { value: "C16", label: "T16 - Trên 16 tuổi" },
                    { value: "C18", label: "T18 - Trên 18 tuổi" },
                  ]}
                />
              </Form.Item>
            </div>
          </div>

          {/* Cột phải */}
          <div className="col-span-12 md:col-span-8 space-y-6">
            <section className="border rounded-lg px-4 py-4 space-y-3">
              <h4 className="font-semibold text-base">1. Thông tin cơ bản</h4>

              <Form.Item
                label="Tên phim"
                name="name"
                rules={[
                  formRules.textRange("Tên phim", 3, 60),
                  formRules.required("Tên phim"),
                ]}
              >
                <Input placeholder="Nhập tên phim" />
              </Form.Item>

              <Form.Item
                label="Thể loại phim"
                name="genreIds"
                rules={[formRules.required("Thể loại phim", "choose")]}
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn thể loại"
                  options={genreOptions}
                />
              </Form.Item>
            </section>

            <section className="border rounded-lg px-4 py-4 space-y-3">
              <h4 className="font-semibold text-base">2. Chi tiết phim</h4>

              <div className="grid grid-cols-3 gap-4">
                <Form.Item
                  label="Quốc gia"
                  name="country"
                  rules={[formRules.required("Quốc gia", "choose")]}
                >
                  <Select options={COUNTRY_OPTIONS} showSearch />
                </Form.Item>

                <Form.Item
                  label="Ngôn ngữ"
                  name="language"
                  rules={[formRules.required("Ngôn ngữ", "choose")]}
                >
                  <Select options={LANGUAGE_OPTIONS} showSearch />
                </Form.Item>

                <Form.Item label="Phụ đề" name="subTitleLanguage">
                  <Select options={LANGUAGE_OPTIONS} showSearch />
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  label="Đạo diễn"
                  name="director"
                  rules={[formRules.required("Đạo diễn")]}
                >
                  <Input placeholder="Nhập tên đạo diễn" />
                </Form.Item>

                <Form.Item label="Trailer Youtube" name="trailer">
                  <Input placeholder="Link Youtube" />
                </Form.Item>
              </div>

              <Form.Item
                label="Diễn viên"
                name="actor"
                rules={[formRules.required("Danh sách diễn viên")]}
              >
                <Select
                  mode="tags"
                  placeholder="Nhập tên diễn viên và Enter"
                  open={false}
                />
              </Form.Item>

              <Form.Item label="Mô tả phim" name="description">
                <TextArea rows={5} placeholder="Nhập mô tả phim" />
              </Form.Item>
            </section>

            <section className="border rounded-lg px-4 py-4 space-y-3">
              <h4 className="font-semibold text-base">3. Thời gian chiếu</h4>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  label="Ngày công chiếu"
                  name="releaseDate"
                  rules={[formRules.required("Ngày công chiếu")]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    disabled={isReleaseLocked}
                  />
                </Form.Item>

                <Form.Item
                  label="Ngày kết thúc"
                  name="endDate"
                  dependencies={["releaseDate"]}
                  rules={[
                    formRules.required("Ngày kết thúc"),
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const start = getFieldValue("releaseDate");
                        if (!value || !start) return Promise.resolve();

                        const diff = dayjs(value).diff(dayjs(start), "day");
                        if (diff < 7) {
                          return Promise.reject(
                            new Error(
                              "Ngày kết thúc phải cách ngày công chiếu ít nhất 7 ngày!",
                            ),
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </div>
            </section>
          </div>
        </div>

        <div className="flex justify-end gap-6 mt-6">
          <Button
            style={{ width: 150, height: 35 }}
            onClick={() =>
              form.setFieldsValue({
                ...data,
                genreIds: data.genreIds.map((g) => g._id),
                ageRestriction: data.ageRestriction,
                releaseDate: dayjs(data.releaseDate),
                endDate: dayjs(data.endDate),
              })
            }
          >
            Đặt lại
          </Button>

          <Button
            loading={isLoading}
            disabled={isLoading}
            style={{ width: 150, height: 35 }}
            htmlType="submit"
            type="primary"
          >
            Cập nhật
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UpdateMovie;
