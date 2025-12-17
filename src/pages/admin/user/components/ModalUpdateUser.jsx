import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { QUERY } from "../../../../common/constants/queryKey";
import { USER_ROLE } from "../../../../common/constants/user";
import { useMessage } from "../../../../common/hooks/useMessage";
import { updateUser } from "../../../../common/services/user.service";
import { formRules } from "../../../../common/utils/formRule";

const ModalUpdateUser = ({children, user})=> {
    const [open, setOpen] = useState(false);
    const [form]= Form.useForm();
    const {antdMessage, HandleError} = useMessage();
    const queryClient = useQueryClient();
    const{mutate, isPending} = useMutation({
        mutationFn : async (payload) => updateUser(payload),
        onSuccess: ({message}) =>{
            antdMessage.success(message);
            queryClient.invalidateQueries({
                predicate: ({queryKey}) => queryKey.includes(QUERY.USER),
            });
            setOpen(false);
        },
        onError:(err)=> HandleError(err),
    });
    const handleSubmit = async ()=>{
        const values= await form.validateFields();
        mutate({...user, role:values.role});
    };
    useEffect(()=>{
        console.log(user);
        form.setFieldsValue({role: user.role});
    },[user]);
    return(
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
              label="Vai trò"
              name={"role"}
              required
              rules={[formRules.required("vai trò")]}
            >
              <Select
                allowClear
                placeholder="Chọn vai trò"
                options={[
                  ...Object.entries(USER_ROLE).map(([value, label]) => ({
                    value,
                    label,
                  })),
                ]}
              />
            </Form.Item>
          </Form>
        </Modal>
      </>
    )
}
export default ModalUpdateUser;