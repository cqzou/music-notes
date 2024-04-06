"use client";
import FileUpload from "@/components/FileUploader";
import { Text, Box, Button, VStack } from "@chakra-ui/react";
import { useState } from "react";
import '@fontsource-variable/urbanist';


export default function Home() {
  const [fileList, setFileList] = useState([])
  return (
    <Box
      width="100vw"
      height="100vh"
      overflow="scroll"
    >
      <VStack
        width="100%"
        alignItems="center"
        justifyContent="center"
        mt={20}
      >
        <Button colorScheme="primary" />
        <FileUpload fileList={fileList} setFileList={setFileList}></FileUpload>
      </VStack>
      
    </Box>
  );
}
