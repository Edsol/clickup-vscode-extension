import * as React from "react";
import { Button, Dropdown } from "antd";

export default function TaskButton({ task }) {
  const items = [
    {
      key: "1",
      label: (
        <a href="#" onClick={() => navigator.clipboard.writeText(task.id)}>
          Copy
        </a>
      )
    },
    {
      key: "2",
      label: (
        <a target="_blank" rel="noopener noreferrer" href={task.url}>
          Open in browser
        </a>
      )
    }
  ];

  return (
    <div>
      <Dropdown menu={{ items }} placement="right">
        <Button type="primary">{task.id}</Button>
      </Dropdown>
    </div>
  );
}
