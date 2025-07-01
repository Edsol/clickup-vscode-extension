import * as React from "react";
import { Task } from "vscode";

import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { Assignee, Status } from "../../types";

type Props = {
  subtasks?: Task[];
};

const Subtasks: React.FC<Props> = ({ subtasks, openSubtask }) => {
  console.log("subtasks", subtasks);
  const columns: TableProps<Task>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (taskId: string) => (
        <a
          onClick={() => {
            openSubtask(taskId);
          }}
        >
          {taskId}
        </a>
      )
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Assignees",
      dataIndex: "assignees",
      key: "assignees",
      render: (assignees: Assignee[]) => (
        <Space size="small">
          {assignees.map((assignee: Assignee) => (
            <div>{assignee.username}</div>
          ))}
        </Space>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Status) => {
        return <div>{status.status}</div>;
      }
    }
  ];

  console.log("subtasks", subtasks);
  return (
    <Table<Task>
      columns={columns}
      dataSource={subtasks}
      rowKey={(record) => record.id || record.title} // usa un id o titolo come fallback
    />
  );
};

export default Subtasks;
