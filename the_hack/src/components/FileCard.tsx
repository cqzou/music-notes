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
        <Heading size='md'>{project?.projectname}</Heading>
      </CardHeader>
      <Image
        objectFit="cover"
        src={project.thumbnail}
        alt="Chakra UI"
      />
      <CardBody>
        <Text>{project.description}</Text>
        <Text fontSize='xs'>Created on {project.creationdate}</Text>
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
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
