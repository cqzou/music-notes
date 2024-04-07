import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Flex,
  Text, 
  Spacer,
  Heading,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { UserData } from "./consts";

interface FileModalProps {
  project: any;
  onClose: any;
  isOpen: boolean;
  setUserData: any;
}

export const FileModal = ({ project, onClose, isOpen, setUserData }: FileModalProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentMp3, setCurrentMp3] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const uid = 'fioenoe213384fh83833djdiu'

  const handlePlayButtonClick = (mp3: string) => {
    setCurrentMp3(mp3);
    if (audioRef.current) {
      audioRef.current.src = mp3;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    const updateThing = async () => {
      try {
          setIsLoading(true);
          const response = await axios.get(`http://127.0.0.1:8000/update_project_audio/${uid}/${project?.projectid}`);
          console.log(response);
          setUserData((prevUserData: UserData | undefined) => {
            if (prevUserData) {
              let newUserData: UserData | undefined = {...prevUserData};
              console.log(newUserData);
              newUserData.projects = response.data.data;
              console.log(newUserData);
              return newUserData;
            }
          });
          setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    }
    if (!isLoading && project && project?.topics.some((topic: any) => topic?.status == "generating" || topic?.status == "streaming") && isOpen) {
      updateThing();
    }
  }, [isOpen])

  const updateThing = async () => {
    try {
        setIsLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/update_project_audio/${uid}/${project?.projectid}`);
        console.log(response);
        setUserData((prevUserData: UserData | undefined) => {
          if (prevUserData) {
            let newUserData: UserData | undefined = {...prevUserData};
            console.log(newUserData);
            newUserData.projects = response.data.data;
            console.log(newUserData);
            return newUserData;
          }
        });
        setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  const deleteProject = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/delete_project/${uid}/${project?.projectid}`);
      console.log(response); 
      if (response?.data?.data) {
        setUserData((prevUserData: UserData | undefined) => {
          if (prevUserData) {
            let newUserData: UserData | undefined = {...prevUserData};
            console.log(newUserData);
            newUserData.projects = response.data.data;
            console.log(newUserData);
            return newUserData;
          }
        });
        onClose();
      }
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false)
    }
  }



  return (
    <>
    <Modal onClose={onClose} size="full" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{project?.projectname}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Accordion allowToggle>
            {project?.topics.map((topic: any, index: number) => (
              <AccordionItem key={index}>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    <Heading as="h4" size="md">
                      {topic.topicname}
                    </Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Text>{topic.lyrics}</Text>
                  <Button
                    aria-label="Play"
                    onClick={() => handlePlayButtonClick(topic.mp3)}
                    variant="ghost"
                    colorScheme="blue"
                  >
                    Play
                  </Button>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </ModalBody>
        <ModalFooter>
          <Flex direction="column" alignItems="center" w="100%">
            {currentMp3 && (
              <Flex direction="column" alignItems="center" w="100%">
                <audio
                  ref={audioRef}
                  src={currentMp3}
                  controls
                  style={{ width: "90%" }} // Make the audio element longer
                />
              </Flex>
            )}
          </Flex>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  );
}
