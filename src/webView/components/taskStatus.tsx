import * as React from "react";
import { Input, Select, Typography } from "antd";
const { Text } = Typography;

export default function TaskStatus({ statuses, value }) {
  const parsedStatuses = statuses.map((status) => {
    return {
      value: status.id,
      label: status.status
    };
  });

  return (
    <div>
      <Text strong>Status</Text>
      <Select options={parsedStatuses} style={{ width: "100%" }} value={value} />
    </div>
  );
}
