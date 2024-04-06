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
  project: Project
}

export const FileCard = ({ project }: FileCardProps) => {
  return (
    <Card maxW="md">
      <CardHeader>
        <Heading size='md'>Econ 101 lecture 1</Heading>
      </CardHeader>
      <Image
        objectFit="cover"
        src={project.thumbnail}
        alt="Chakra UI"
      />
      <CardBody>
        <Text>{project.description}</Text>
        <Text fontSize='xs'>Created on {project.creation_date}</Text>
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
