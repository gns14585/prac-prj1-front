import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ChatIcon } from "@chakra-ui/icons";
import {
  faAngleLeft,
  faAngleRight,
  faHeart,
  faHeart as fullHeart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Pagination({ pageInfo }) {
  const pageNumbers = [];

  const navigate = useNavigate();

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Flex>
      {/* 첫페이지로 이동 */}
      {pageInfo.firstPageNumber && (
        <Button
          variant="ghost"
          onClick={() => navigate("/?p=" + pageInfo.firstPageNumber)}
        >
          처음
        </Button>
      )}

      {pageInfo.prevPageNumber && (
        <Button
          variant="ghost"
          onClick={() => navigate("/?p=" + pageInfo.prevPageNumber)}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </Button>
      )}

      {pageNumbers.map((pageNumber) => (
        <Button
          key={pageNumber}
          variant={
            pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
          }
          onClick={() => navigate("/?p=" + pageNumber)}
        >
          {pageNumber}
        </Button>
      ))}

      {pageInfo.nextPageNumber && (
        <Button
          variant="ghost"
          onClick={() => navigate("/?p=" + pageInfo.nextPageNumber)}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </Button>
      )}

      {/* 마지막페이지로 이동 */}
      {pageInfo.lastPageNumber && (
        <Button
          variant="ghost"
          onClick={() => navigate("/?p=" + pageInfo.lastPageNumber)}
        >
          마지막
        </Button>
      )}
    </Flex>
  );
}

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get("/api/board/list?" + params.toString()).then((response) => {
      setBoardList(response.data.boardList);
      setPageInfo(response.data.pageInfo);
    });
  }, [location]);

  if (boardList === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>게시물 목록</h1>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>
                <FontAwesomeIcon icon={faHeart} />
              </Th>
              <Th>title</Th>
              <Th>by</Th>
              <Th>at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {boardList.map((board) => (
              <Tr
                _hover={{
                  cursor: "pointer",
                }}
                key={board.id}
                onClick={() => navigate("/board/" + board.id)}
              >
                <Td>{board.id}</Td>
                <Td>{board.countLike > 0 && board.countLike}</Td>
                <Td>
                  {board.title}
                  {/* 해당 게시물의 댓글수 표현 , 0개는 표시되지 않음 */}
                  {board.countComment > 0 && (
                    <Badge>
                      <ChatIcon />
                      {board.countComment}
                    </Badge>
                  )}
                </Td>
                <Td>{board.nickName}</Td>
                <Td>{board.ago}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Pagination pageInfo={pageInfo} />
      </Box>
    </Box>
  );
}
