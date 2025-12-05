import { Form, Modal } from "antd";
import React, { useState } from "react";
import CreateManyComponent from "./components/CreateManyComponent";
import CreateOneComponent from "./components/CreateOneComponent";

const CreateShowtimeModal = ({ children, movie }) => {
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [form] = Form.useForm();

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => {
          setOpen(true);
        },
      })}
      <Modal
        onCancel={() => setOpen(false)}
        afterClose={() => form.resetFields()}
        open={open}
        width={900}
        className="rounded-xl border border-white/10 backdrop-blur-md"
        style={{
          background: `hsl(222.2 84% 4.9%)`,
        }}
        title={
          <p className="text-lg font-semibold text-white/90 tracking-wide">
            Thêm lịch chiếu cho phim {movie?.name}
          </p>
        }
        footer={null}
      >
        <div className="flex gap-2 px-4">
          <button
            onClick={() => setTabIndex(0)}
            className={`px-4 py-2 rounded-md transition cursor-pointer ${
              tabIndex === 0
                ? "bg-primary text-white shadow-sm"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            Thêm nhiều suất chiếu
          </button>

          <button
            onClick={() => setTabIndex(1)}
            className={`px-4 py-2 rounded-md transition cursor-pointer ${
              tabIndex === 1
                ? "bg-primary text-white shadow-sm"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            Thêm một suất chiếu
          </button>
        </div>

        {tabIndex === 0 && (
          <CreateManyComponent movie={movie} setOpen={setOpen} />
        )}
        {tabIndex === 1 && (
          <CreateOneComponent movie={movie} setOpen={setOpen} />
        )}
      </Modal>
    </>
  );
};

export default CreateShowtimeModal;
