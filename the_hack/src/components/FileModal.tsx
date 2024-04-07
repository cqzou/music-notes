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
  Heading,
} from "@chakra-ui/react";

interface FileModalProps {
  project: any;
  onClose: any;
  isOpen: boolean;
}

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
