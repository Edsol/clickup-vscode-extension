import { Card, Avatar, Image, Badge } from "antd";
import * as React from "react";
import { Comment } from "../../types";
import TimeAgo from "react-timeago";

const commentsList = ({ comments }) => {
  if (!comments) {
    return "";
  }
  return (
    <div
      style={{
        height: "98vh",
        padding: 5,
        overflowY: "auto"
      }}
    >
      {comments.map((comment: Comment) => {
        return buildCard(comment);
      })}
    </div>
  );
};

function buildCard(comment) {
  const parsedDate = new Date(parseInt(comment.date));
  let reply: Array<any> = [];

  const hasReply = parseInt(comment.reply_count) > 0;

  if (hasReply) {
    reply = [<div>{comment.reply_count} reply</div>];
  }

  return (
    <Badge.Ribbon text={hasReply ? reply : undefined}>
      <Card
        size="small"
        title={buildAvatar(comment)}
        // extra={<TimeAgo date={parsedDate} />}
        actions={[<TimeAgo date={parsedDate} />]}
      >
        {buildContent(comment.comment)}
      </Card>
    </Badge.Ribbon>
  );
}

function buildAvatar(comment) {
  return (
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
}

function buildContent(comment) {
  let content: Array<any> = [];

  comment.forEach((commentElement) => {
    if (!commentElement.hasOwnProperty("type")) {
      content.push(<p>{commentElement.text}</p>);
      return;
    }

    content.push(
      <Image
        width={200}
        src={commentElement.image.thumbnail_medium}
        // preview={{
        //   destroyOnClose: true,
        //   imageRender: () => null,
        //   toolbarRender: () => null
        // }}
      />
    );
  });

  return content;
}

export default commentsList;
