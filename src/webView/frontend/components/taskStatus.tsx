import * as React from "react";
import { Select, Button, Space } from "antd";
import CheckBold from "@resources/official_icons/dark/checkBold.svg";

export default function TaskStatus({ statuses, value, setValue }) {
  let parsedStatuses = [];
  if (statuses) {
    parsedStatuses = statuses.map((status) => {
      return {
        value: status.status,
        label: status.status
      };
    });
  }

  const handleChange = (value) => {
    setValue((prevFields) => ({
      ...prevFields,
      status: value
    }));
  };

  return (
    <Space.Compact direction="orizontal" width="100%">
      <Select
        options={parsedStatuses}
        style={{ width: "100%" }}
        defaultValue={value}
        onChange={handleChange}
      />
      <Button>
        <CheckBold
          width="15"
          height="15"
          title="Contrassegna come completato"
        />
      </Button>
    </Space.Compact>
  );
}
