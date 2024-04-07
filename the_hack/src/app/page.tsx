"use client";
import FileUpload from "@/components/FileUploader";
import { useEffect, useState } from "react";
import '@fontsource-variable/urbanist';
import { GetProp, UploadProps } from "antd";
import { Text, Box, Button, HStack, VStack, Container, SimpleGrid, useDisclosure, Textarea, Input, Image, Spinner } from "@chakra-ui/react";
import { Flex } from '@chakra-ui/react';
import { FileCard } from "@/components/FileCard";
import { ProcessingStatus, UserData, Topic, Project } from "@/components/consts";
import { FileModal } from "@/components/FileModal";
import { MongoClient, ServerApiVersion } from "mongodb";
import axios from "axios";


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
export default function Home() {
  const userid: string = 'fioenoe213384fh83833djdiu';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fileList, setFileList] = useState<any>([]);
  const [userData, setUserData] = useState<UserData>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [ isLoading, setIsLoading ] = useState(false);

  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("");
  const [projectname, setProjectName] = useState("");

  useEffect(() => {

  }, [userData])
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

  const fetchProjects = () => {
    fetch(`http://127.0.0.1:8000/getallprojects/${userid}`)
      .then(response => response.json())
      .then(json => {
        setUserData(json);
      })
      .catch(error => console.error('Error fetching projects:', error));
  };

  useEffect(() => {
    // Immediately invoke the fetch operation when the component mounts
    fetchProjects();
    // Set up the interval to repeat the fetch operation every 6 seconds
    //const intervalId = setInterval(fetchProjects, 6000);
  
    // Clear the interval when the component is unmounted
    //return () => clearInterval(intervalId);
  }, [userid]); // Depend on userid to restart the interval if userid changes


  useEffect(() => {
    console.log(userData)
  }, [userData]);

  //DEBUG PRINT STATEMENTS, TO BE REMOVED LATER
  // useEffect(() => {
  //   console.log(fileList);
  // }, [fileList]);

  const handleUpload = async () => {
  
    const file = fileList[0];
    console.log(file.originFileObj);
    const formData = new FormData();
    formData.append('file', file.originFileObj);
    formData.append('userid', 'fioenoe213384fh83833djdiu');
    formData.append('description', description);
    formData.append('theme', theme);
    formData.append('projectname', projectname);
    const uploadUrl = 'http://127.0.0.1:8000/uploadfiles/';
  
    try {
      setIsLoading(true);
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      console.log(response);
      setUserData((prevUserData: UserData | undefined) => {
        if (prevUserData) {
          let newUserData: UserData | undefined = {...prevUserData};
          console.log(newUserData);
          newUserData.projects = response.data.data;
          console.log(newUserData);
          return newUserData;
        }
      })
      setIsLoading(false);
      setDescription("");
      setTheme("");
      setProjectName("");
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };


  //end of debug print statements

  return (
    <Container maxW="100%">
      <Box
        ml="-4"
        width="100vw"
        height="150%"
        overflow="scroll"
        bgImage="url('/bg2.png')"
        bgSize="cover"
        bgPosition="center"
      >

        <Image
          src="logo.png"
          width="20%"
          marginTop="10px"
          position="absolute"
        >
        </Image>

        
        <VStack
        width="100%"
        alignItems="center"
        spacing={3}
        mt={10}
        >
        <HStack width="100%" alignItems="top" justifyContent="center" spacing={10}>
          <VStack>
            <FileUpload fileList={fileList} setFileList={setFileList}></FileUpload>
            <VStack spacing={0}>
              {fileList.map((file: any, index: number) => (
                <Text key={index}>
                  {file.name}
                </Text>
              ))}
            </VStack>
          </VStack>
          <VStack spacing={3} alignItems="center">
            <Input disabled={isLoading} onChange={(event) => setProjectName(event.target.value)} width="70%" background="white" mt={2} placeholder="Topic?" value={projectname}></Input>
            <Input disabled={isLoading} onChange={(event) => setDescription(event.target.value)} width="70%" background="white" placeholder="Description?" value={description}/>
            <Input disabled={isLoading} onChange={(event) => setTheme(event.target.value)} width="70%" background="white" placeholder="Music style?" value={theme}></Input>
            </VStack>
          </HStack>
          <Button
            mb={10}
            isDisabled={isLoading || !(fileList.length > 0 && description != "" && theme != "" && projectname != "")}
            onClick={handleUpload}>
            
            {!isLoading && `Generate Study Playlist`}

            {isLoading && <Spinner/>}

            </Button>
        </VStack>
        
      </Box>
      <SimpleGrid minChildWidth='20%' spacing='40px' mx='10px' width="60%" margin="auto">
        {
          userData?.projects.map((project: Project, index: number) => (
            <FileCard key={index} project={project} onClick={ () => {
              setSelectedIndex(index)
              onOpen();
            }}></FileCard>
          ))
        }
      </SimpleGrid>
      <FileModal setUserData={setUserData} project={userData?.projects[selectedIndex]} onClose={onClose} isOpen={isOpen}></FileModal>
    </Container>
    
  );
}
