import * as React from "react";
import { Button, Dropdown } from "antd";

export function TaskButton({ task }) {
  const items = [
    {
      key: "1",
      label: (
        <a
          href="#"
          onClick={(e) => {
            navigator.clipboard.writeText(task.id);
          }}
        >
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
      <Dropdown menu={{ items }} placement="bottom">
        <Button type="primary">{task.id}</Button>
      </Dropdown>
    </div>
  );
}
