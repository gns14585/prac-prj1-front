import { Button, Flex, useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import { LoginContext } from "./LoginProvider";

export function NavBar() {
  const { fetchLogin, login, isAuthenticated, isAdmin } =
    useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams();
  const location = useLocation(); // 경로

  useEffect(() => {
    fetchLogin(); // (세션이 초기화 되었을경우) 경로가 바뀔때마다 fetchLogin() 실행 ( 세션이 초기화 됐으니 로그인 다시해야함 )
  }, [location]);

  if (login !== "") {
    urlParams.set("id", login.id);
  }

  function handleLogOut() {
    // TODO : 로그아웃 후 할 일 추가
    axios.post("/api/member/logout").then(() => {
      toast({
        description: "로그아웃 되었습니다.",
        status: "info",
      });
      navigate("/");
    });
  }

  return (
    <Flex>
      <Button onClick={() => navigate("/")}>home</Button>
      {isAuthenticated() && (
        <Button onClick={() => navigate("/write")}>글쓰기</Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/signup")}>회원가입</Button>
      )}
      {isAdmin() && (
        <Button onClick={() => navigate("/member/list")}>회원목록</Button>
      )}
      {isAuthenticated() && (
        <Button onClick={() => navigate("/member?" + urlParams.toString())}>
          회원정보
        </Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/login")}>로그인</Button>
      )}
      {isAuthenticated() && <Button onClick={handleLogOut}>로그아웃</Button>}
    </Flex>
  );
}
