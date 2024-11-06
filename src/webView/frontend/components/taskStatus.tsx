import * as React from "react";
import { Select, Button, Space } from "antd";
import CheckBoldIcon from "@resources/official_icons/dark/checkBold.svg";
import RecordIcon from "@resources/official_icons/dark/record.svg";

export default function TaskStatus({ statuses, value, setValue }) {
  const [selectedOption, setSelectedOption] = React.useState(value);

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
    setSelectedOption(value);
    setValue((prevFields) => ({
      ...prevFields,
      status: value
    }));
  };

  const doneButtonHandle = (values) => {
    const closedStatus = statuses.filter((status) => status.type === "closed");

    handleChange(closedStatus[0].status);
  };

  return (
    <div>
      <Select
        options={parsedStatuses}
        defaultValue={value}
        value={selectedOption}
        onChange={handleChange}
        style={{ minWidth: "70%" }}
        optionRender={(option) => (
          <Space>
            <RecordIcon width="15" height="15" color={option.data.color} />
            <span>{option.data.label}</span>
          </Space>
        )}
      />
      <Button onClick={doneButtonHandle} style={{ marginLeft: "10px" }}>
        <CheckBoldIcon width="15" height="15" title="Complete" />
      </Button>
    </div>
  );
}
