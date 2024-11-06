import * as React from "react";
import { Dropdown, Badge } from "antd";

export default function TaskId({ task, notifyMessage }) {
  if (task === undefined) {
    return;
  }
  const items = [
    {
      key: "1",
      label: (
        <a
          href="#"
          onClick={() => {
            navigator.clipboard.writeText(task.id);
            notifyMessage("Task ID copied!");
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
      <Dropdown menu={{ items }} placement="right">
        <Badge
          count={task.id}
          style={{ backgroundColor: "#FFF", color: "#000", cursor: "pointer" }}
        />
      </Dropdown>
    </div>
  );
}
