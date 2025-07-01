import * as React from "react";
import { Card, Avatar, Image, Input, Button } from "antd";
import { Comment } from "../../types";
import TimeAgo from "react-timeago";

const commentsList = ({
  comments,
  className = "",
  setComments,
  sendComment
}) => {
  if (comments.length === undefined) {
    return "";
  }
  const [newComment, setNewComment] = React.useState(null);
  const [readyToSend, setReadyToSend] = React.useState(false);

  React.useEffect(() => {
    if (newComment === null) {
      return;
    }
    if (newComment.length > 0) {
      setReadyToSend(true);
    } else {
      setReadyToSend(false);
    }
  }, [newComment]);

  const sendNewComment = () => {
    sendComment(newComment);
    console.log("sended");
  };

  return (
    <div className="relative">
      <div className="mb pl-2">
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
      </div>
      <div
        className="absolute bottom-0 p-1 w-full"
        style={{ backgroundColor: "var(--vscode-editor-background)" }}
      >
        <div className="flex flex-row gap-1">
          <Input
            placeHolder="Write a comment"
            onChange={(e: any) => setNewComment(e.currentTarget.value)}
          />
          <Button
            type="primary"
            disabled={!readyToSend}
            onClick={(e) => sendNewComment}
          >
            send
          </Button>
        </div>
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
