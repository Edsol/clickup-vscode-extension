import * as React from "react";
import { Input } from "antd";

export default function TaskName({ task, setValue }) {
  const handleChange = (value) => {
    setValue((prevFields) => ({
      ...prevFields,
      name: value.currentTarget.value
    }));
  };

  return (
    <div>
      <Input
        defaultValue={task.name}
        label="name"
        placeholder="task title"
        onChange={handleChange}
      />
    </div>
  );
}
