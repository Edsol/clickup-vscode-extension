import * as React from "react";
import { Select, Space, Tag } from "antd";
import TagIcon from "@resources/official_icons/dark/tag.svg";

export default function taskTags({ tags, value, setValue }) {
  let parseTags = [];
  if (tags) {
    parseTags = tags.map((tag, key) => {
      return {
        id: key,
        value: tag.name,
        label: tag.name,
        bgColor: tag.tag_bg,
        fgColor: tag.tag_fg
      };
    });
  }

  let parsedSelectedTags = [];

  if (value) {
    parsedSelectedTags = value.map((tag) => {
      return tag.name;
    });
  }

  const handleChange = (value) => {
    setValue((prevFields) => ({
      ...prevFields,
      tags: value
    }));
  };

  function extractBackgroundColor(label: string) {
    if (!tags) {
      return "#FFF";
    }

    const res = tags.filter((tag) => tag.name === label)[0];
    if (!res) {
      return;
    }
    return res.tag_bg;
  }

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    return (
      <Tag
        style={{
          marginInlineEnd: 4,
          backgroundColor: extractBackgroundColor(value),
          color: "#FFF"
        }}
      >
        {label}
      </Tag>
    );
  };

  return (
    <div>
      <Select
        style={{ minWidth: "100%" }}
        placeholder="Select a tag"
        mode="multiple"
        allowClear
        options={parseTags}
        defaultValue={parsedSelectedTags}
        onChange={handleChange}
        optionRender={(option) => (
          <Space>
            <span
              style={{
                backgroundColor: option.data.bgColor,
                padding: 5,
                borderRadius: 7
              }}
            >
              <TagIcon height="15" width="15" />
              {option.data.label}
            </span>
          </Space>
        )}
        tagRender={tagRender}
      />
    </div>
  );
}
