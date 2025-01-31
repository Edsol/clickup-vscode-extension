import * as React from "react";
import { Card, Avatar, Image, Badge, Input, Space, Button, Flex } from "antd";
import { Comment } from "../../types";
import TimeAgo from "react-timeago";

const commentsList = ({ comments, className = "" }) => {
  if (!comments) {
    return "";
  }
  return (
    <div className="h-full mb">
      <div
        className="h-screen overflow-y-auto space-y-2"
        style={{
          paddingBottom: "35px",
          paddingTop: "10px",
          paddingRight: 10
        }}
      >
        {getCommentsCard(comments)}
      </div>
      <div>
        <Space.Compact className="w-full absolute bottom-0 left-0 pl-2 pr-4">
          <Input placeHolder="Write a comment" />
          <Button type="primary">send</Button>
        </Space.Compact>
      </div>
    </div>
  );
};

function getCommentsCard(comments) {
  return comments.map((comment: Comment) => {
    return buildCard(comment);
  });
}

function buildCard(comment) {
  const parsedDate = new Date(parseInt(comment.date));
  let reply: Array<any> = [];

  const hasReply = parseInt(comment.reply_count) > 0;

  if (hasReply) {
    reply = [<div>{comment.reply_count} reply</div>];
  }

  return (
    <Card
      size="small"
      title={buildAvatar(comment)}
      extra={<TimeAgo date={parsedDate} className="cursor-pointer" />}
      actions={hasReply ? reply : undefined}
    >
      {buildContent(comment.comment)}
    </Card>
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
        className="cursor-pointer"
        size="small"
      >
        {comment.user.initials}
      </Avatar>
      <span className={"ml-2 cursor-pointer"}>{comment.user.username}</span>
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
