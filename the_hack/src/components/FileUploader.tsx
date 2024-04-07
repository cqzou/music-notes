import React from 'react';

import { Box, Button, Text } from '@chakra-ui/react';
import { Upload, message } from 'antd';
import type { GetProp, UploadProps } from 'antd';
import '@fontsource-variable/urbanist';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface FileUploadProps {
  setFileList: any;
  fileList: any;
}

export default function FileUpload({ setFileList, fileList }: FileUploadProps) {

  const fileAttributes = (file: FileType) => {
    return `${file.name}-${file.size}-${file.lastModified}`;
  };

  const beforeUpload = (file: FileType) => {
    const MAX_SIZE_IN_MB = 6;
    const isPdf = file.type === "application/pdf";

    const isDuplicate = fileList.some((fileInList: FileType) => {
      return fileAttributes(fileInList) == fileAttributes(file);
    });

    if (isDuplicate) {
      message.error('You are uploading a duplicate file!');
      return Upload.LIST_IGNORE;
    }
    if (!isPdf) {
      return Upload.LIST_IGNORE;
    }
    const isSmall = file.size / 1024 / 1024 < MAX_SIZE_IN_MB;
    if (!isSmall) {
      message.error(`Items must smaller than ${MAX_SIZE_IN_MB}MB!`);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleChange: UploadProps['onChange'] = info => {
    console.log(info);
    setFileList(info.fileList.slice());
  };

  const uploadButton = (
    <Box
      boxSize="10rem"
      bg="white"
      borderRadius="10"
    >
      <Button colorScheme='teal' border="4px solid" variant="outline" height="100%" width="100%" justifyContent="center" display="block">
        <Box fontFamily="Urbanist" width="100%" fontSize="xl">
          +
        </Box>
        <Box fontFamily="Urbanist" width="100%">
            Upload
        </Box>
      </Button>
    </Box>
  );

  return (
    <>
      <Box>
        <Box
          borderRadius="3"
          boxSize="10rem"
          overflow="hidden"
          boxSizing="border-box"
          p={0}
        >
          <Upload
            name="file"
            showUploadList={false}
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            maxCount={1}
          >
            {uploadButton}
          </Upload>
        </Box>
      </Box>
    </>
  );
}
