import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

export function BoardView() {
  const [board, setBoard] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data));
  }, []);

  // BoaderList와 마찬가지로 로딩중일때 로딩중이라는걸 사용자에게 인식 시키기 위해 <Spinner /> 속성 사용
  if (board === null) {
    return <Spinner />;
  }

  function handleDelete() {
    axios
      .delete("/api/board/remove/" + id)
      .then((response) => {
        toast({
          description: id + "번 게시물이 삭제되었습니다.",
          status: "success",
        });
        navigate("/"); // 게시글 삭제버튼을 클릭하게 되면 삭제되면서 게시글 리스트로 이동됨
      })
      .catch((error) => {
        toast({
          description: "삭제 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => onClose()); // 삭제버튼을 클릭하면 모달창이 닫힘
  }

  return (
    // 각각의 작성한 글을 확인할때 차크라ui를 통해
    // FormControl , FormLabel, Input or Textarea 사용
    // value 값은 작성한 게시글에 대한 값들을 보기위함
    // 작성한 게시글을 보기 위함이니 수정이 안되도록 readOnly 사용
    // 수정은 따로 버튼을 만들어서 처리
    <Box>
      <h1>{board.id}번 글 보기</h1>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input value={board.title} readOnly />
      </FormControl>

      <FormControl>
        <FormLabel>본문</FormLabel>
        <Textarea value={board.content} readOnly />
      </FormControl>

      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input value={board.writer} readOnly />
      </FormControl>

      <FormControl>
        <FormLabel>작성일시</FormLabel>
        <Input value={board.inserted} readOnly />
      </FormControl>

      <Button onClick={() => navigate("/edit/" + id)} colorScheme="blue">
        수정
      </Button>
      <Button colorScheme="red" onClick={onOpen}>
        삭제
      </Button>

      {/* 삭제 시 모달창으로 한번 더 확인하기 위함 */}
      {/* 진짜 삭제가 맞냐고 다시한번 물어보고 맞으면 삭제버튼 클릭 */}
      {/* 삭제를 누르면 게시물 리스트로 이동되게 처리 */}
      {/* 삭제 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleDelete} colorScheme="red">
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
