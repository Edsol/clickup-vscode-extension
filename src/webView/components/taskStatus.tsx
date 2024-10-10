import * as React from "react";
import { Input, Select, Typography } from "antd";
const { Text } = Typography;

export default function TaskStatus({ statuses, value, setValue }) {
  const parsedStatuses = statuses.map((status) => {
    return {
      value: status.status,
      label: status.status
    };
  });

  const handleChange = (value) => {
    setValue(() => ({
      status: value
    }));
  };

  return (
    <div>
      <Text strong>Status</Text>
      <Select
        options={parsedStatuses}
        style={{ width: "100%" }}
        defaultValue={value}
        onChange={handleChange}
      />
    </div>
  );
}
