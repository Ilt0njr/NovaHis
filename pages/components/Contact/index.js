import { BiMessageRoundedDetail, BiTimeFive } from "react-icons/bi";
import { BsWhatsapp } from "react-icons/bs";
import { MdOutlineMailOutline } from "react-icons/md";
import Link from "next/link";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Center,
  StackDivider,
  VStack,
  Box,
} from "@chakra-ui/react";

export default () => (
  <Popover trigger="hover">
    <PopoverTrigger>
      <Center className="gap-2">
        <BiMessageRoundedDetail />
        <a className="text-sm hidden lg:block">
          Central de <br />
          <b>Atendimento</b>
        </a>
      </Center>
    </PopoverTrigger>
    <PopoverContent w="max-content">
      <PopoverBody>
        <VStack
          divider={<StackDivider />}
          spacing={2}
          className="text-base"
          align="start"
        >
          <Box>
            <a>Chama no Whats</a>
            <Center className="gap-3">
              <BsWhatsapp className="text-xl text-green-500" />
              <Link href="https://api.whatsapp.com/send?phone=554899033795">
                <a target="_blank" className="font-bold">
                  (48) 9903-3795
                </a>
              </Link>
            </Center>
          </Box>
          <Box>
            <a>Email</a>
            <a className="flex items-center gap-3">
              <MdOutlineMailOutline className="text-xl" />
              <b>Alexsandra@novahistoria.com</b>
            </a>
          </Box>
          <Box>
            <a>Horário de atendimento</a>
            <a className="flex items-center gap-3">
              <BiTimeFive className="text-xl" />
              Seg a Sex das 10h às 17h
            </a>
          </Box>
        </VStack>
      </PopoverBody>
    </PopoverContent>
  </Popover>
);
