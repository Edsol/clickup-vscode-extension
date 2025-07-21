import * as React from "react";
import { Input } from "antd";

export default function taskName({ task, setValue }) {
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
        placeholder="task title"
        onChange={handleChange}
      />
    </div>
  );
}
