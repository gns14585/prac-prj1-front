import { Box, Button, Input, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

function CommentForm({ boardId }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    axios.post("/api/comment/add", {
      boardId, // 게시물 id
      comment, // 댓글
    });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button onClick={handleSubmit}>쓰기</Button>
    </Box>
  );
}

function CommentList() {
  return <Box>댓글리스트</Box>;
}

export function CommentContainer({ boardId }) {
  return (
    <Box>
      <CommentForm boardId={boardId} />
      <CommentList />
    </Box>
  );
}
