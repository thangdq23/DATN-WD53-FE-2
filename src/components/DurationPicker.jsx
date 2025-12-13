import { SwapRightOutlined } from "@ant-design/icons";
import { TimePicker, Input } from "antd";
import { useState, useEffect } from "react";

export const DurationRangePicker = ({
  value,
  onChange,
  durationMinutes = 0,
  placeholder = ["Bắt đầu", "Kết thúc"],
  style,
  disabled = false,
  disabledTime,
}) => {
  const [startTime, setStartTime] = useState(value?.[0] || null);
  const [endTime, setEndTime] = useState(
    value?.[1] || (value?.[0] ? value[0].add(durationMinutes, "minute") : null)
  );

  useEffect(() => {
    if (value) {
      setStartTime(value[0]);
      setEndTime(
        value[1] || (value[0] ? value[0].add(durationMinutes, "minute") : null)
      );
    }
  }, [value, durationMinutes]);

  const handleStartChange = (time) => {
    const newEnd = time ? time.add(durationMinutes, "minute") : null;
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
        disabledTime={disabledTime}
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
