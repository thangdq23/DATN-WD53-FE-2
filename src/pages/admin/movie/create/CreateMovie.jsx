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
import { Link, useNavigate } from "react-router";
import { useMessage } from "../../../../common/hooks/useMessage";
import { formRules } from "../../../../common/utils/formRule";
import { upLoadImage } from "../../../../common/utils/upLoadImage";
import UploadImage from "../../../../components/UploadImage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY } from "../../../../common/constants/queryKey";
import { getAllGenre } from "../../../../common/services/genre.service";
import {
  COUNTRY_OPTIONS,
  LANGUAGE_OPTIONS,
} from "../../../../common/constants/language";
import { createMovieAPI } from "../../../../common/services/movie.service";

const CreateMovie = () => {
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

  const { mutateAsync } = useMutation({
    mutationFn: (payload) => createMovieAPI(payload),
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
    const posterUrl = await upLoadImage(values.poster[0].originFileObj);
    if (!posterUrl) {
      setLoading(false);
      antdMessage.error("Upload ảnh thất bại");
      return;
    }
    values.poster = posterUrl;
    values.releaseDate = dayjs(values.releaseDate).format("YYYY-MM-DD");
    await mutateAsync({ ...values, isHot });
    setLoading(false);
  };

  return (
    <div className="w-full min-h-[85dvh] rounded-md shadow-md px-6 py-4 bg-[#f5f7fb]">
      <Link
        to={"/admin/movies"}
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
            <h3 className="text-xl font-semibold m-0">Thêm phim mới</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Phim nổi bật</span>
            <Form.Item
              name="isFeatured"
              valuePropName="checked"
              className="mb-0"
            >
              <Switch
                size="default"
                style={{ transform: "scale(1.15)" }}
                onChange={(checked) => setIsHot(checked)}
              />
            </Form.Item>
          </div>
        </div>

        
        <div className="grid grid-cols-12 gap-8">
          
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
                initialValue={10}
                rules={[formRules.required("Thời gian chiếu phim")]}
              >
                <Space.Compact className="w-full">
                  <InputNumber
                    min={10}
                    max={360}
                    className="custom-input-number w-full"
                    placeholder="VD: 120"
                  />
                  <div className="px-3 h-10 flex items-center border border-solid border-[#d9d9d9] rounded-r-md bg-[#f5f5f5]">Phút</div>
                </Space.Compact>
              </Form.Item>

              <Form.Item
                label="Độ tuổi khán giả"
                name={"ageRestriction"}
                required
                rules={[
                  formRules.required("Vui lòng chọn lứa tuổi phù hợp"),
                ]}
              >
                <Select
                  placeholder="Chọn độ tuổi"
                  style={{ width: "100%", height: 35 }}
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

         
          <div className="col-span-12 md:col-span-8 space-y-6">
            
            <section className="border rounded-lg px-4 py-4 space-y-3">
              <h4 className="font-semibold text-base mb-1">
                1. Thông tin cơ bản
              </h4>

              <Form.Item
                label="Tên phim"
                name={"name"}
                required
                rules={[
                  formRules.textRange("Tên phim", 3, 60),
                  formRules.required("Tên phim"),
                ]}
              >
                <Input placeholder="Nhập tên phim" style={{ height: 35 }} />
              </Form.Item>

              <Form.Item
                label="Thể loại phim"
                name={"genreIds"}
                required
                rules={[formRules.required("Thể loại phim", "choose")]}
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn thể loại phim"
                  style={{ width: "100%", height: 35 }}
                  tokenSeparators={[","]}
                  options={genre?.data.map((item) => ({
                    value: item._id,
                    label: item.name,
                  }))}
                />
              </Form.Item>
            </section>

            
            <section className="border rounded-lg px-4 py-4 space-y-3">
              <h4 className="font-semibold text-base mb-1">2. Chi tiết phim</h4>

              <div className="flex flex-col md:flex-row gap-4">
                <Form.Item
                  label="Quốc gia"
                  name={"country"}
                  required
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn quốc gia của phim",
                    },
                  ]}
                  className="flex-1"
                >
                  <Select
                    placeholder="Chọn quốc gia"
                    style={{ height: 35 }}
                    showSearch
                    options={COUNTRY_OPTIONS}
                  />
                </Form.Item>

                <Form.Item
                  label="Ngôn ngữ"
                  name={"language"}
                  required
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngôn ngữ của phim",
                    },
                  ]}
                  className="flex-1"
                >
                  <Select
                    placeholder="Chọn ngôn ngữ"
                    style={{ height: 35 }}
                    showSearch
                    options={LANGUAGE_OPTIONS}
                  />
                </Form.Item>

                <Form.Item
                  label="Phụ đề"
                  className="flex-1"
                  name={"subTitleLanguage"}
                >
                  <Select
                    placeholder="Chọn phụ đề"
                    style={{ height: 35 }}
                    showSearch
                    options={LANGUAGE_OPTIONS}
                  />
                </Form.Item>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <Form.Item
                  label="Đạo diễn"
                  name={"director"}
                  tooltip="Nhập tên một đạo diễn và nhấn Enter"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên đạo diễn",
                    },
                  ]}
                  className="flex-1"
                >
                  <Input
                    placeholder="Nhập tên đạo diễn"
                    style={{ height: 35 }}
                  />
                </Form.Item>

                <Form.Item
                  label="Trailer Youtube"
                  name={"trailer"}
                  className="flex-1"
                >
                  <Input
                    placeholder="Nhập link Youtube"
                    style={{ height: 35 }}
                  />
                </Form.Item>
              </div>

              <Form.Item
                label="Diễn viên"
                name={"actor"}
                tooltip="Nhập tên diễn viên và nhấn Enter để thêm"
                required
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập danh sách diễn viên",
                  },
                ]}
              >
                <Select
                  mode="tags"
                  className="one-line-select"
                  suffixIcon={null}
                  placeholder="Nhập tên diễn viên và nhấn Enter"
                  style={{ width: "100%", height: 35 }}
                  tokenSeparators={[","]}
                  open={false}
                />
              </Form.Item>

              <Form.Item label="Mô tả phim" name={"description"}>
                <TextArea rows={5} placeholder="Nhập mô tả phim" />
              </Form.Item>
            </section>

           
            <section className="border rounded-lg px-4 py-4 space-y-3">
              <h4 className="font-semibold text-base mb-1">
                3. Thời gian chiếu
              </h4>
              <div className="flex flex-col md:flex-row gap-4">
                <Form.Item
                  label="Ngày công chiếu"
                  name="releaseDate"
                  style={{ flex: 1 }}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày công chiếu",
                    },
                  ]}
                >
                  <DatePicker
                    placeholder="Chọn ngày công chiếu"
                    style={{ height: 35, width: "100%" }}
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day").add(1)
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Ngày kết thúc"
                  name="endDate"
                  style={{ flex: 1 }}
                  dependencies={["releaseDate"]}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày kết thúc chiếu",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const releaseDate = getFieldValue("releaseDate");
                        if (!value || !releaseDate) return Promise.resolve();

                        const diff = dayjs(value).diff(
                          dayjs(releaseDate),
                          "day",
                        );
                        if (diff < 7) {
                          return Promise.reject(
                            new Error(
                              "Ngày ngừng chiếu phải cách ngày công chiếu ít nhất 1 tuần!",
                            ),
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    placeholder="Chọn ngày kết thúc"
                    style={{ height: 35, width: "100%" }}
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day").add(1)
                    }
                  />
                </Form.Item>
              </div>
            </section>
          </div>
        </div>

        
        <div className="flex justify-end gap-6 mt-6">
          <Button
            disabled={isLoading}
            style={{ width: 150, height: 35 }}
            htmlType="reset"
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
            Thêm mới
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateMovie;
