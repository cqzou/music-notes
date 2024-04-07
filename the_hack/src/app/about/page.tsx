"use client";
import { Button } from "@chakra-ui/react";
import { FileModal} from "@/components/FileModal";
import { FileCard} from "@/components/FileCard";
import { useState } from "react";
import { VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from "@chakra-ui/react";

export default function Balls() {
    const [isOpen, setIsOpen] = useState(false);
    const project = {
      projectName: "Example Project",
      topics: [
        {
          topicName: "Example Topic 1",
          lyrics: "Example Lyrics for Topic 1",
          mp3: "https://codeskulptor-demos.commondatastorage.googleapis.com/pang/paza-moduless.mp3"
        },
        {
          topicName: "Example Topic 2",
          lyrics: "Example Lyrics for Topic 2",
          mp3: "https://codeskulptor-demos.commondatastorage.googleapis.com/pang/paza-moduless.mp3"
        }
      ]
    };
  
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
  
    return (
      <VStack spacing={4} align="stretch">
        <Button onClick={openModal}>Open File Modal</Button>
        <FileModal project={project} onClose={closeModal} isOpen={isOpen} />
      </VStack>
    );
}