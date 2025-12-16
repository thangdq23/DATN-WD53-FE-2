import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Modal } from "antd";
import React, { useState } from "react";
import { QUERY } from "../../../../common/constants/queryKey";
import { useMessage } from "../../../../common/hooks/useMessage";
import { createUser } from "../../../../common/services/user.service";
import { formRules } from "../../../../common/utils/formRule";

const ModalCreateUser = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { antdMessage, HandleError } = useMessage();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload) => createUser(payload),
    onSuccess: ({ message }) => {
      antdMessage.success(message);
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey.includes(QUERY.USER),
      });
      setOpen(false);
    },
    onError: (err) => HandleError(err),
  });
  const handleSubmit = async () => {
    const values = await form.validateFields();
    mutate(values);
  };
  return (
    <>
      {React.cloneElement(children, {
        onClick: () => setOpen(true),
      })}
      <Modal
        title="Thêm người dùng"
        open={open}
        onCancel={() => setOpen(false)}
        okText="Tạo mới"
        onOk={handleSubmit}
        cancelText="Huỷ"
        loading={isPending}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Họ và tên"
            name={"userName"}
            required
            rules={[
              formRules.required("Họ và tên"),
              formRules.textRange("Họ và tên", 2, 50),
            ]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            label="email"
            name={"email"}
            required
            rules={[
              formRules.required("email"),
              { type: "email", message: "Vui lòng nhập đúng định dạng email" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name={"phone"}
            required
            rules={[
              formRules.required("Số điện thoại"),
              formRules.textRange("Số điện thoại", 6, 18),
            ]}
          >
            <Input placeholder="Nhập số diện thoại" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalCreateUser;