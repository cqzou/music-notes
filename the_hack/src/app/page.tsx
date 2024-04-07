"use client";
import FileUpload from "@/components/FileUploader";
import { useEffect, useState } from "react";
import '@fontsource-variable/urbanist';
import { GetProp, UploadProps } from "antd";
import { Text, Box, Button, VStack, Container, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import { Flex } from '@chakra-ui/react';
import { FileCard } from "@/components/FileCard";
import { ProcessingStatus, UserData, Topic, Project } from "@/components/consts";
import { FileModal } from "@/components/FileModal";
import { MongoClient, ServerApiVersion } from "mongodb";


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
export default function Home() {
  const userid: string = 'fioenoe213384fh83833djdiu';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fileList, setFileList] = useState<any>([]);
  const [userData, setUserData] = useState<UserData>();
  // const client = new MongoClient(process.env.MONGO_URI as string);
  // async function run() {
  //   try {
  //     // Connect the client to the server (optional starting in v4.7)
  //     await client.connect();
  //     // Send a ping to confirm a successful connection
  //     await client.db("admin").command({ ping: 1 });
  //     console.log("Pinged your deployment. You successfully connected to MongoDB!");
  //   } finally {
  //     // Ensures that the client will close when you finish/error
  //     await client.close();
  //   }
  // }
  // run().catch(console.dir);

  // const collection = db.collection('inventory');
  // const changeStream = collection.watch();
  // changeStream.on('change', next => {
  //   // process next document
  // });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/getallprojects/${userid}`)
      .then(response => response.json())
      .then(json => {
        setUserData(json);
        // console.log('fetching', `http://127.0.0.1:8000/getallprojects/${userid}`);
        // console.log('userData', json);
      });
  }, []);

  //DEBUG PRINT STATEMENTS, TO BE REMOVED LATER
  // useEffect(() => {
  //   console.log(fileList);
  // }, [fileList]);

  const handleUpload = async () => {
  
    const file = fileList[0];
    console.log(file.originFileObj);
    const formData = new FormData();
    formData.append('file', file.originFileObj);
    const uploadUrl = 'http://127.0.0.1:8000/uploadfiles/';
  
    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
  
      console.log(response);
        
    } catch (err) {
      console.error(err);
    }
  };


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
            { file.response?.audio_url && <audio controls={true} src={file.response.audio_url}></audio>}
            </>
          ))}
        </VStack>
        <Button onClick={handleUpload}>Generate Study Playlist</Button>
      </VStack>
        
      </Box>
      <SimpleGrid minChildWidth='300px' spacing='40px' m='10px'>
        {
          userData?.projects.map((project: Project, index: number) => (
            <FileCard key={index} project={project} onClick={onOpen}></FileCard>
          ))
        }
      </SimpleGrid>
      <FileModal fileMetadata={'hi'} onClose={onClose} isOpen={isOpen}></FileModal>
    </Container>
    
  );
}
