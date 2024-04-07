import {
  Card,
  CardHeader,
  Flex,
  Box,
  Heading,
  Text,
  CardBody,
  Image,
  IconButton,
  CardFooter,
  Button,
} from "@chakra-ui/react";

import { DeleteIcon } from '@chakra-ui/icons';
import { Project } from "./consts";

interface FileCardProps {
  project: Project,
  onClick: any,
}

export const FileCard = ({ project, onClick }: FileCardProps) => {
  return (
    <Card
      maxW="md"
      borderRadius={10}
      backgroundColor="blue.200"
      h="100%"
      onClick={onClick}>
      <CardHeader position="absolute" top="0" left="0" right="0" backgroundColor="rgba(0,0,0, 0.4)" borderRadius={10} p={4}>
        <Heading
          size='lg'
          letterSpacing='wide'
          color='white'
          textAlign='center'
          textTransform='uppercase'
          fontWeight='bold'
          mb={5}
        >{project?.projectname}</Heading>
        <Text
          fontSize='s'
          color='white'
          fontWeight='light'
          textAlign='center'
          mt={-5}
          mb={-2}
          letterSpacing='wide'
        >{project.creationdate}</Text>
      </CardHeader>
      <Image
        borderRadius={10}
        objectFit="cover"
        src={project.thumbnail || "./imgs/1.jpg"}
        alt="Album Image"
      />
      <Text
        color='white'
        fontWeight='light'
        fontSize='s'
        mt={-10}
        backgroundColor='blackAlpha.500'
        p={2}
        borderRadius='md'
        textOverflow='ellipsis'
        overflow='hidden'
        whiteSpace='nowrap'
        >{project.description}</Text>
      <CardFooter
        justify="space-between"
        flexWrap="wrap"
        sx={{
          "& > button": {
            minW: "136px",
          },
        }}
        mb={-10}
      >
      </CardFooter>
    </Card>
  );
};
