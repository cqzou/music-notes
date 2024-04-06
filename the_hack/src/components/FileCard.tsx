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

interface FileCardProps {
  processingStatus: any;
  thumbnail: any;
}

export const FileCard = ({ processingStatus, thumbnail }: FileCardProps) => {
  return (
    <Card maxW="md">
      <CardHeader>
        <Heading size='md'>Econ 101 lecture 1</Heading>
      </CardHeader>
      <Image
        objectFit="cover"
        src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        alt="Chakra UI"
      />
      <CardBody>
        <Text>This is a study guide for my Econ 101 class's first lecture!</Text>
        <Text fontSize='xs'>Created on 4/6/24</Text>
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
