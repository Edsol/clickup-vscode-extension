import * as React from "react";
import { Select, Button, Space } from "antd";
import CheckBoldIcon from "@resources/official_icons/dark/checkBold.svg";
import RecordIcon from "@resources/official_icons/dark/record.svg";

export default function TaskStatus({ statuses, value, setValue }) {
  let parsedStatuses = [];
  if (statuses) {
    parsedStatuses = statuses.map((status) => {
      return {
        value: status.status,
        label: status.status,
        color: status.color
      };
    });
  }

  const handleChange = (value) => {
    setValue((prevFields) => ({
      ...prevFields,
      status: value
    }));
  };

  const doneButtonHandle = (value) => {
    console.log("DoneButtonHandle", value);
  };

  return (
    <Space.Compact direction="orizontal">
      <Select
        style={{ width: "100%", minWidth: "200px" }}
        options={parsedStatuses}
        defaultValue={value}
        onChange={handleChange}
        optionRender={(option) => (
          <Space>
            <RecordIcon width="15" height="15" color={option.data.color} />
            <span>{option.data.label}</span>
          </Space>
        )}
      />
      <Button onClick={doneButtonHandle}>
        <CheckBoldIcon
          width="15"
          height="15"
          title="Contrassegna come completato"
        />
      </Button>
    </Space.Compact>
  );
}
