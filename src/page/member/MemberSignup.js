import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberSignup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [idAvailable, setIdAvailable] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [nickNameAvailable, setNickNameAvailable] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  let submitAvailable = true;

  if (!idAvailable) {
    submitAvailable = false;
  }

  if (!nickNameAvailable) {
    submitAvailable = false;
  }

  if (!emailAvailable) {
    submitAvailable = false;
  }

  if (password != passwordCheck) {
    submitAvailable = false;
  }

  if (password.length === 0) {
    submitAvailable = false;
  }

  function handleSubmit() {
    axios
      .post("/api/member/signup", {
        id,
        password,
        email,
        nickName,
      })
      .then(() => {
        toast({
          description: "회원가입이 완료되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            description: "입력값을 확인해주세요",
            status: "error",
          });
        } else {
          toast({
            description: "가입중에 오류가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => console.log("done"));
  }

  function handleIdCheck() {
    // 중복체크 할때 필요한 코드
    // URLSearchParams : 엔코딩 해줌
    const searchParam = new URLSearchParams();
    searchParam.set("id", id);

    axios
      .get("/api/member/check?" + searchParam.toString())
      // 중복체크는 반대
      // 있으면 사용하지 못함
      .then(() => {
        setIdAvailable(false);
        toast({
          description: "ID가 이미 존재합니다.",
          status: "warning",
        });
      })
      // 없으면 사용 가능
      .catch((error) => {
        if (error.response.status === 404) {
          setIdAvailable(true);
          toast({
            description: "사용 가능한 ID 입니다.",
            status: "success",
          });
        }
      });
  }

  function handleEmailCheck() {
    const searchParams = new URLSearchParams();
    searchParams.set("email", email);

    axios
      .get("/api/member/check?" + searchParams.toString())
      .then(() => {
        setEmailAvailable(false);
        toast({
          description: "이미 사용중인 email 입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setEmailAvailable(true);
          toast({
            description: "사용 가능한 email 입니다.",
            status: "success",
          });
        }
      });
  }

  function handleNickNameCheck() {
    const searchParams = new URLSearchParams();
    searchParams.set("nickName", nickName);

    axios
      .get("/api/member/check?" + searchParams.toString())
      .then(() => {
        setNickNameAvailable(false);
        toast({
          description: "이미 사용중인 닉네임 입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setNickNameAvailable(true);
          toast({
            description: "사용 가능한 닉네임 입니다.",
            status: "success",
          });
        }
      });
  }

  return (
    <Box>
      <h1>회원가입</h1>
      <FormControl isInvalid={!idAvailable}>
        <FormLabel>id</FormLabel>
        <Flex>
          <Input
            vlaue={id}
            onChange={(e) => {
              setId(e.target.value);
              setIdAvailable(false);
            }}
          />
          <Button onClick={handleIdCheck}>중복체크</Button>
        </Flex>
        <FormErrorMessage>ID 중복체크를 해주세요.</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={password.length == 0}>
        <FormLabel>password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormErrorMessage>암호를 입력해주세요.</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={password != passwordCheck}>
        <FormLabel>password 확인</FormLabel>
        <Input
          type="password"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
        />
        <FormErrorMessage>암호가 다릅니다.</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel>닉네임</FormLabel>
        <Flex>
          <Input
            type="text"
            value={nickName}
            onChange={(e) => {
              setNickNameAvailable(false);
              setNickName(e.target.value);
            }}
          />
          <Button onClick={handleNickNameCheck}>중복체크</Button>
        </Flex>
        <FormErrorMessage>닉네임 죽복체크를 해주세요.</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!emailAvailable}>
        <FormLabel>email</FormLabel>
        <Flex>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmailAvailable(false);
              setEmail(e.target.value);
            }}
          />
          <Button onClick={handleEmailCheck}>중복체크</Button>
        </Flex>
        <FormErrorMessage>email 중복체크를 해주세요.</FormErrorMessage>
      </FormControl>

      {/* isDisabled={!submitAvailable} : Input에 값을 넣지 않으면 가입버튼이 안눌리게 처리 */}
      <Button
        isDisabled={!submitAvailable}
        onClick={handleSubmit}
        colorScheme="blue"
      >
        가입
      </Button>
    </Box>
  );
}
