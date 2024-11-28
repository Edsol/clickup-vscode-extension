import { Card, Avatar } from "antd";
import * as React from "react";
import { Comment } from "../../types";
import TimeAgo from "react-timeago";

const commentsList = ({ comments }) => {
  console.log("comments inside", comments);
  if (!comments) {
    return "";
  }
  return comments.map((comment: Comment, index) => {
    const parsedDate = new Date(parseInt(comment.date));
    const title = (
      <div>
        <Avatar
          style={{
            backgroundColor: comment.user.color,
            verticalAlign: "middle"
          }}
          size="small"
        >
          {comment.user.initials}
        </Avatar>
        <span style={{ marginLeft: 5 }}>{comment.user.username}</span>
      </div>
    );
    return (
      <Card size="small" title={title} extra={<TimeAgo date={parsedDate} />}>
        <p>{comment.comment_text}</p>
      </Card>
    );
  });
};

export default commentsList;
