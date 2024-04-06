"use client";
import FileUpload from "@/components/FileUploader";
import { Text, Box, Button, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import '@fontsource-variable/urbanist';
import { GetProp, UploadProps } from "antd";


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
export default function Home() {
  const [fileList, setFileList] = useState([]);

  //DEBUG PRINT STATEMENTS, TO BE REMOVED LATER
  useEffect(() => {
    console.log(fileList);
  }, [fileList]);


  //end of debug print statements

  return (
    <Box
      width="100vw"
      height="100vh"
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
  );
}
