import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // 저장 눌렀을때 텀에 대한 useState

  const toast = useToast();
  const navigate = useNavigate();

  function handleSubmit() {
    setIsSubmitting(true);

    axios
      .post("/api/board/add", {
        title, // 제목
        content, // 본문내용
      })
      .then(() => {
        // 완료됐을경우
        toast({
          // toast는 밑에서 모달창 위로 올라옴
          description: "새 글이 작성 되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        // 뭔가 문제가 생겨서 실패했을경우
        console.log(error.response.status);
        if (error.response.status === 400) {
          // console.log로 확인했을때 400번 에러 확인
          // toast는 사용할때 description, status 항상 같이 사용해줘야함
          // description : 사용자에게 보여지는 설명
          // status : error은 빨간색으로 알림이 표현되고, success는 파란색으로 포현됨 (빠르게 인식가능)
          toast({
            description: "작성한 내용을 확인해주세요.",
            status: "error",
          });
        } else {
          // 실패했을때, 400번 외 다른 코드숫자가 떴을때 실행됨
          toast({
            description: "저장 중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <Box>
      <h1>게시물 작성</h1>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input vlaue={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>본문</FormLabel>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></Textarea>
        </FormControl>

        <Button
          isDisabled={isSubmitting} // 저장을 눌렀을 때 연속적으로 눌려지지 않고 일정 텀이 필요할때 사용
          onClick={handleSubmit}
          colorScheme="blue"
        >
          저장
        </Button>
      </Box>
    </Box>
  );
}
