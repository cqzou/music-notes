"use client";
import FileUpload from "@/components/FileUploader";
import { useEffect, useState } from "react";
import '@fontsource-variable/urbanist';
import { GetProp, UploadProps } from "antd";
import { Text, Box, Button, VStack, Container, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import { Flex } from '@chakra-ui/react'
import { FileCard } from "@/components/FileCard";
import { exampleProjects, Project } from "@/components/consts";
import { FileModal } from "@/components/FileModal";


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fileList, setFileList] = useState([]);
  const [projectList, setProjectList] = useState<Project[]>(exampleProjects);

  //DEBUG PRINT STATEMENTS, TO BE REMOVED LATER
  useEffect(() => {
    console.log(fileList);
  }, [fileList]);


  //end of debug print statements

  return (
    <Container maxW="100%">
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
          {fileList.map((file: any, index: number) => (
            <>
            <Text key={index}>
              {file.name}
            </Text>
            { file.response && <audio controls={true} src={file.response.audio_url}></audio>}
            </>
          ))}
        </VStack>
        
      </VStack>
        
      </Box>
      <SimpleGrid minChildWidth='300px' spacing='40px' m='10px'>
        {
          projectList.map((project: Project, index: number) => (
            <FileCard key={index} project={project} onClick={onOpen}></FileCard>
          ))
        }
      </SimpleGrid>
      <FileModal fileMetadata={'hi'} onClose={onClose} isOpen={isOpen}></FileModal>
    </Container>
    
  );
}
