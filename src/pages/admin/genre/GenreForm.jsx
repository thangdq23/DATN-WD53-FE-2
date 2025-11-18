import React, { useEffect } from "react";
import { Form, Input, Button, Switch, Space } from "antd";
import axios from "axios";

const GenreForm = ({ genre, onClose, refresh, antdMessage, HandleError }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (genre) {
      form.setFieldsValue({
        name: genre.name,
        description: genre.description,
        status: genre.status,
      });
    } else {
      form.resetFields();
    }
  }, [genre, form]);

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        status: !!values.status,
      };

      if (genre) {
        await axios.patch(
          `http://localhost:8000/api/genre/update/${genre._id}`,
          payload,
        );
        antdMessage.success("Cập nhật thể loại thành công!");
      } else {
        await axios.post("http://localhost:8000/api/genre", payload);
        antdMessage.success("Thêm thể loại thành công!");
      }

      refresh();
      onClose();
    } catch (error) {
      HandleError(error, {
        fallback: genre ? "Cập nhật thất bại!" : "Thêm mới thất bại!",
      });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ status: true }}
    >
      <Form.Item
        label="Tên thể loại"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên thể loại!" }]}
      >
        <Input placeholder="Ví dụ: Hành động, Tình cảm, Kinh dị..." />
      </Form.Item>

      <Form.Item label="Mô tả" name="description">
        <Input.TextArea
          rows={4}
          placeholder="Mô tả ngắn về thể loại (không bắt buộc)"
        />
      </Form.Item>

      <Form.Item label="Trạng thái" name="status" valuePropName="checked">
        <Switch checkedChildren="Hoạt động" unCheckedChildren="Khóa" />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
        <Space>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" htmlType="submit">
            {genre ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default GenreForm;
