import { Modal } from "antd";
import React, { useState } from "react";
import { Link, useParams } from "react-router";
import dayjs from "dayjs";

const ModalSelectRoom = ({ children, room, showtime }) => {
  const [open, setOpen] = useState(false);
  const { id } = useParams();

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => setOpen(true),
      })}
      <Modal
        onCancel={() => setOpen(false)}
        open={open}
        width={600}
        className="rounded-xl border border-white/10 backdrop-blur-md"
        style={{
          background: `hsl(222.2 84% 4.9%)`,
        }}
        title={
          <p className="text-2xl font-bold text-white uppercase tracking-wide">
            Chọn Phòng Chiếu
          </p>
        }
        footer={null}
      >
        <div className="grid mt-8 grid-cols-3 gap-6 max-w-7xl mx-6 xl:mx-auto">
          {room.map((item) => (
            <Link
              key={item._id}
              to={`/showtime/${id}/${showtime._id}/${item._id}?hour=${dayjs(
                showtime.startTime
              ).format("HH:mm")}`}
            >
              <button
                onClick={() => setOpen(false)}
                className="border border-gray-500/50 hover:bg-gray-500/50 w-full text-white transition cursor-pointer py-4 rounded-full"
              >
                {item.name}
              </button>
            </Link>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default ModalSelectRoom;
