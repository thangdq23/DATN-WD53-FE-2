import { Link, useNavigate, useParams } from "react-router";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDetailMovie,
  updateMovieAPI,
} from "../../../../common/services/movie.service";
// import { uploadImage } from "../../../../common/utils/uploadImage";
import UploadImage from "../../../../components/UploadImage";
import { QUERY } from "../../../../common/constants/queryKey";
import { useMessage } from "../../../../common/hooks/useMessage";
import {
  COUNTRY_OPTIONS,
  LANGUAGE_OPTIONS,
} from "../../../../common/constants/language";
import { formRules } from "../../../../common/utils/formRule";
import { getAllGenre } from "../../../../common/services/genre.service";
import { upLoadImage } from "../../../../common/utils/upLoadImage";

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
    queryFn: () => getAllGenre(),
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
      }
    }
    values.poster = posterUrl;
    values.releaseDate = dayjs(values.releaseDate).format("YYYY-MM-DD");
    await mutateAsync({ ...values, isHot });
    setLoading(false);
  };
  console.log(isHot);
  return (
    <div className="w-full min-h-[85dvh] rounded-md shadow-md px-6 py-4 relative">
      <Link
        to={"/admin/movies"}
        className="text-black! hover:text-primary! hover:underline!"
      >
        Quay về danh sách
      </Link>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Cập nhật phim</h3>
        <Form.Item
          label="Phim nổi bật"
          name="isFeatured"
          valuePropName="checked"
        >
          <Switch
            value={isHot}
            size="default"
            style={{ transform: "scale(1.2)" }}
            onChange={(checked) => setIsHot(checked)}
          />
        </Form.Item>
      </div>
      <div className="mt-4">
        <Form onFinish={handleSubmit} layout="vertical" form={form}>
          <section className="flex items-start gap-8">
            <Form.Item
              label="Poster phim"
              name={"poster"}
              valuePropName="value"
              getValueFromEvent={(e) => e}
              rules={[{ required: true, message: "Vui lòng tải ảnh lên!" }]}
            >
              <UploadImage width={200} height={310} />
            </Form.Item>
            <div className="flex-1">
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
                label="Thời gian chiếu"
                name={"duration"}
                required
                initialValue={10}
                rules={[formRules.required("Thời gian chiếu phim")]}
              >
                <InputNumber
                  min={10}
                  max={360}
                  className="custom-input-number"
                  placeholder="Nhập số phút chiếu phim"
                  addonAfter={"Phút"}
                  style={{ width: "100%" }}
                />
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
              <Form.Item
                label="Phim dành cho lứa tuổi"
                name={"ageRestriction"}
                required
                rules={[formRules.required("Vui lòng chọn lứa tuổi phù hợp")]}
              >
                <Select
                  placeholder="Chọn độ tuổi"
                  style={{ width: "100%", height: 35 }}
                  options={[
                    { value: "P", label: "P - Phù hợp với mọi lứa tuổi" },
                    { value: "K", label: "K - Dành cho trẻ em" },
                    { value: "C13", label: "C13 - Cấm khán giả dưới 13 tuổi" },
                    { value: "C16", label: "C16 - Cấm khán giả dưới 16 tuổi" },
                    { value: "C18", label: "C18 - Cấm khán giả dưới 18 tuổi" },
                  ]}
                />
              </Form.Item>
            </div>
          </section>
          <section className="flex items-center justify-between gap-6">
            <Form.Item
              label="Quốc gia"
              name={"country"}
              required
              rules={[
                { required: true, message: "Vui lòng chọn quốc gia của phim" },
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
                { required: true, message: "Vui lòng chọn ngôn ngữ của phim" },
              ]}
              className="flex-1"
            >
              <Select
                placeholder="Chọn quốc gia"
                style={{ height: 35 }}
                showSearch
                options={LANGUAGE_OPTIONS}
              />
            </Form.Item>
            <Form.Item
              label="Ngôn ngữ"
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
          </section>
          <section className="flex items-center gap-6">
            <div className="flex-1">
              <Form.Item
                label="Đạo diễn"
                name={"director"}
                tooltip="Nhập tên một diễn viên bất kỳ và enter bạn có thể nhập được tên diễn viên tiếp theo"
                required
                rules={[
                  { required: true, message: "Vui lòng nhập tên đạo diễn" },
                ]}
              >
                <Input placeholder="Nhập tên đạo diễn" style={{ height: 35 }} />
              </Form.Item>
            </div>
            <Form.Item
              label="Trailer youtube"
              name={"trailer"}
              style={{ flex: 1 }}
            >
              <Input placeholder="Nhập link youtube" style={{ height: 35 }} />
            </Form.Item>
          </section>
          <Form.Item
            label="Diễn viên"
            name={"actor"}
            tooltip="Nhập tên một diễn viên bất kỳ và enter bạn có thể nhập được tên diễn viên tiếp theo"
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
          <div className="flex items-center gap-6">
            <Form.Item
              label="Ngày công chiếu"
              name="releaseDate"
              style={{ flex: 1 }}
              rules={[
                { required: true, message: "Vui lòng chọn ngày công chiếu" },
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

                    const diff = dayjs(value).diff(dayjs(releaseDate), "day");
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
          <div className="flex justify-end gap-6 mt-6">
            <Button
              disabled={isLoading}
              style={{ width: 150, height: 35 }}
              onClick={() =>
                form.setFieldsValue({
                  ...data,
                  genreIds: data.genreIds.map((item) => item._id),
                  ageRestriction: data.ageRestriction,
                  releaseDate: dayjs(data.releaseDate),
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
    </div>
  );
};
export default UpdateMovie;
