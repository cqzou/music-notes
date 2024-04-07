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
    <Card maxW="md" onClick={onClick}>
      <CardHeader>
        <Heading
          size='md'
          letterSpacing='wide'
          color='gray.700'
          textAlign='left'
          textTransform='uppercase'
          fontWeight='bold'
        >{project?.projectname}</Heading>
        <Text
          fontSize='s'
          color='gray.500'
          fontWeight='light'
          textAlign='right'
          mt={-6}
          letterSpacing='wide'
        >{project.creationdate}</Text>
      </CardHeader>
      <Image
        objectFit="cover"
        src={project.thumbnail || "./imgs/1.jpg"}
        alt="Album Image"
      />
      <CardBody>
        <Text>{project.description}</Text>
      </CardBody>
      <CardFooter
        justify="space-between"
        flexWrap="wrap"
        sx={{
          "& > button": {
            minW: "136px",
          },
        }}
      >
        <Button flex="1" variant="ghost" leftIcon={<DeleteIcon />}>
        </Button>
      </CardFooter>
    </Card>
  );
};
