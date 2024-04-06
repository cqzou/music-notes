"use client";
import FileUpload from "@/components/FileUploader";
import { useEffect, useState } from "react";
import '@fontsource-variable/urbanist';
import { GetProp, UploadProps } from "antd";
import { Text, Box, Button, VStack, Container, SimpleGrid } from "@chakra-ui/react";
import { Flex } from '@chakra-ui/react'
import { FileCard } from "@/components/FileCard";


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
export default function Home() {
  const [fileList, setFileList] = useState([]);

  //DEBUG PRINT STATEMENTS, TO BE REMOVED LATER
  useEffect(() => {
    console.log(fileList);
  }, [fileList]);


  //end of debug print statements

  return (
    <Container>
      <Box
        width="100vw"
        height="100%"
        overflow="scroll"
      >
        <VStack
        width="100%"
        alignItems="center"
        spacing={3}
        mt={20}
      >
        <FileUpload fileList={fileList} setFileList={setFileList}></FileUpload>
        <VStack
          spacing={0}
        >
          {fileList.map((file: FileType, index: number) => (
            <Text key={index}>
              {file.name}
            </Text>
          ))}
        </VStack>
        
      </VStack>
        
      </Box>
      <SimpleGrid minChildWidth='300px' spacing='40px' m='10px'>
        
        <FileCard processingStatus='completed' thumbnail='https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1xw:0.74975xh;center,top&resize=1200:*' />
        <FileCard processingStatus='completed' thumbnail='https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1xw:0.74975xh;center,top&resize=1200:*' />
        <FileCard processingStatus='completed' thumbnail='https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1xw:0.74975xh;center,top&resize=1200:*' />
        <FileCard processingStatus='completed' thumbnail='https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1xw:0.74975xh;center,top&resize=1200:*' />
        <FileCard processingStatus='completed' thumbnail='https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1xw:0.74975xh;center,top&resize=1200:*' />
        <FileCard processingStatus='completed' thumbnail='https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1xw:0.74975xh;center,top&resize=1200:*' />
      </SimpleGrid>
    </Container>
    
  );
}
