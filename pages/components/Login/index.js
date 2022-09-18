import { FaLock, FaUserCircle } from "react-icons/fa";
import { auth } from "../../_app";
import { useRouter } from "next/router";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
  VStack,
  StackDivider,
  Box,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { MdEmail } from "react-icons/md";

export default () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  if (!user)
    return (
      <a
        className="flex gap-3 items-center cursor-pointer"
        onClick={() => router.push("/login")}
      >
        <FaUserCircle />
        <span className="text-sm hidden lg:block">
          Bem-vindo(a)
          <br /> <b>Entrar</b> ou <b>Cadastrar</b>
        </span>
      </a>
    );

  if (user)
    return (
      <Popover trigger="hover">
        <PopoverTrigger>
          <div className="flex items-center">
            <FaUserCircle
              className="cursor-pointer"
              onClick={() => router.push("/user")}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent marginRight={5} w="max-content">
          <PopoverBody>
            <VStack
              divider={<StackDivider />}
              spacing={2}
              className="text-base p-5"
              align="start"
            >
              <Box>
                <div className="flex items-center gap-3">
                  <FaLock className="text-lg" />
                  <a className="font-bold">ID do usuário </a>
                </div>
                <a>{auth.currentUser.uid}</a>
              </Box>
              <Box>
                <div className="flex items-center gap-3">
                  <MdEmail className="text-lg" />
                  <a className="font-bold">Email do usuário </a>
                </div>
                <a>{auth.currentUser.email}</a>
              </Box>
              <Button
                variant="primary"
                className="w-full mt-5"
                onClick={() => auth.signOut()}
              >
                Sair
              </Button>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
};
