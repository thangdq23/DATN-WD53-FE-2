import { SwapRightOutlined } from "@ant-design/icons";
import { TimePicker, Input } from "antd";
import { Dayjs } from "dayjs";
import { useState, useEffect } from "react";

export const DurationRangePicker = ({
  value,
  onChange,
  durationMinutes = 2,
  placeholder = ["Bắt đầu", "Kết thúc"],
  style,
  disabled = false,
}) => {
  const [startTime, setStartTime] = useState(value?.[0] || null);
  const [endTime, setEndTime] = useState(
    value?.[1] ||
      (value?.[0] ? value[0].add(durationMinutes, "minutes") : null),
  );

  useEffect(() => {
    if (value) {
      setStartTime(value[0]);
      setEndTime(
        value[1] ||
          (value[0] ? value[0].add(durationMinutes, "minutes") : null),
      );
    }
  }, [value, durationMinutes]);

  const handleStartChange = (time) => {
    const newEnd = time ? time.add(durationMinutes, "minutes") : null;
    setStartTime(time);
    setEndTime(newEnd);
    onChange?.([time, newEnd]);
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <TimePicker
        format="HH:mm"
        showSecond={false}
        value={startTime}
        onChange={handleStartChange}
        placeholder={placeholder[0]}
        style={{ flex: 1, ...style }}
        disabled={disabled}
      />
      <SwapRightOutlined />
      <Input
        value={endTime ? endTime.format("HH:mm") : ""}
        placeholder={placeholder[1]}
        style={{ flex: 1 }}
        disabled
      />
    </div>
  );
};
