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
} from "@chakra-ui/react";
import { useRef, useState } from "react";

interface FileModalProps {
  project: any;
  onClose: any;
  isOpen: boolean;
}

export const FileModal = ({ project, onClose, isOpen }: FileModalProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentMp3, setCurrentMp3] = useState<string | null>(null);

  const handlePlayButtonClick = (mp3: string) => {
    setCurrentMp3(mp3);
    if (audioRef.current) {
      audioRef.current.src = mp3;
      audioRef.current.play();
    }
  };

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
            <Flex alignItems="center" justifyContent="center" w="100%">
              {currentMp3 && (
                <audio ref={audioRef} src={currentMp3} controls />
              )}
            </Flex>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

/*
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentMp3, setCurrentMp3] = useState<string | null>(null);

  const handleAccordionClick = (mp3: string) => {
    setCurrentMp3(mp3);
    if (audioRef.current) {
      audioRef.current.src = mp3;
      audioRef.current.play();
    }
  };

  const handlePlayButtonClick = (mp3: string) => {
    setCurrentMp3(mp3);
    if (audioRef.current) {
      audioRef.current.src = mp3;
      audioRef.current.play();
    }
  };

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
                  <AccordionButton onClick={() => handleAccordionClick(topic.mp3)}>
                    <Box as="span" flex="1" textAlign="left">
                      <Heading as="h4" size="md">
                        {topic.topicname}
                      </Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    {topic.lyrics}
                    <IconButton
                      aria-label="Play"
                      icon={<MdPlayArrow />}
                      onClick={() => handlePlayButtonClick(topic.mp3)}
                      variant="ghost"
                    />
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </ModalBody>
          <ModalFooter>
            <Flex alignItems="center" justifyContent="center" w="100%">
              <audio ref={audioRef} controls />
            </Flex>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

/*
export const FileModal = ({
  project,
  onClose,
  isOpen,
}: FileModalProps) => {
  return (
    <>
      <Modal onClose={onClose} size='xl' isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent  width="100rem">
          <ModalHeader>
            {project?.projectname}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Accordion allowToggle>
              { project?.topics.map((topic: any, index: number) => (
                <AccordionItem>
                  <AccordionButton>
                    <Box as="span" flex='1' textAlign='left'>
                      <Heading as="h4" size="md">
                      {topic.topicname}
                      </Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                <AccordionPanel pb={4}>
                  {topic.lyrics}
                  {topic.mp3 != "" && <audio controls src={`${topic.mp3}`} /> }
                </AccordionPanel>
              </AccordionItem>
              ))}
            </Accordion>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
*/