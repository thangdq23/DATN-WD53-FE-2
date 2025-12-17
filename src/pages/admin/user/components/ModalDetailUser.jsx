import { Button, Image, Modal, Tag } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { USER_ROLE } from "../../../../common/constants/user";

const ModalDetailUser = ({children,user})=>{
    const [open, setOpen] = useState(false);
    return(
        <>
        {React.cloneElement(children,{
            onClick:()=>setOpen(true),
        })}
       <Modal
        open={open}
        onCancel={() => setOpen(false)}
        className="rounded-xl border border-white/10 backdrop-blur-md"
        title="Chi tiết người dùng"
        footer={<Button onClick={() => setOpen(false)}>Đóng</Button>}
      >
        <div className="min-h-[30vh] grid grid-cols-2 gap-6 mt-8">
        {/*Avatar  */}
        <div className="flex flex-col items-center gap-4">
            <p className="text-white">Ảnh Đại Diện</p>
            <Image 
            src={user.avatar}
            className="w-24! h-24! rounded-full! object-cover!"
            />
            <Tag
              color={user.role === "admin" ? "blue" : "red"}
              className="m-0!"
              >
                {USER_ROLE[user.role]}
              </Tag>
            </div>
            <div className="space-y-3 ">
                <div className="flex flex-col gap-1">
                    <span className="font-semibold">Tên người dùng : </span>{""}
                    <p>{user.userName}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="font-semibold">Email : </span>
                    <p>{user.email}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="font-semibold">Số điện thoại : </span>
                    <p>{user.phone || "Chưa cập nhật"}</p>
                </div>
                <div>
                    <span className="font-semibold">Ngày đăng ký :</span>
                    <p>{dayjs(user.createAt).format("YYYY-MM-DD | HH:mm")}</p>
                </div>
            </div>
       </div>
        </Modal>
        </>
    )
}
export default ModalDetailUser;