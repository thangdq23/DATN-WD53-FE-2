import { Form, Modal } from "antd";
import React, { useState } from "react";
import CreateManyComponent from "./components/CreateManyComponent";
import CreateOneComponent from "./components/CreateOneComponent";

const CreateShowtimeModal = ({ children, movie }) => {
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [form] = Form.useForm();

  const activeTab =
    "rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 text-white font-semibold shadow";
  const inactiveTab =
    "rounded-full px-6 py-2 bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 transition";

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => setOpen(true),
      })}

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        afterClose={() => form.resetFields()}
        footer={null}
        width={900}
        className="rounded-3xl overflow-hidden"
        styles={{
          content: {
            background: "#f9fafb",     
            borderRadius: 20,
            padding: 0,
            border: "1px solid #e5e7eb",
          },
          header: {
            background: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
            padding: "18px 24px 10px",
          },
          body: {
            background: "#f9fafb",
            padding: 0,
          },
        }}
        title={
          <p className="text-lg font-semibold text-slate-800">
            Thêm lịch chiếu cho phim {movie?.name}
          </p>
        }
      >
        
        <div className="px-6 pt-3 pb-2">
          <div className="inline-flex gap-2 bg-slate-100 p-1 rounded-full">
            <button
              onClick={() => setTabIndex(0)}
              className={tabIndex === 0 ? activeTab : inactiveTab}
            >
             Thêm nhiều suất chiếu
            </button>

            <button
              onClick={() => setTabIndex(1)}
              className={tabIndex === 1 ? activeTab : inactiveTab}
            >
              Thêm một suất chiếu
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 pt-4 text-slate-800">
          {tabIndex === 0 && (
            <CreateManyComponent movie={movie} setOpen={setOpen} />
          )}
          {tabIndex === 1 && (
            <CreateOneComponent movie={movie} setOpen={setOpen} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default CreateShowtimeModal;
