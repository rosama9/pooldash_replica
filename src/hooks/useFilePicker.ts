import { useState } from 'react';
import * as ScopedStorage from 'react-native-scoped-storage';
import { Config } from '~/services/Config/AppConfig';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { Alert } from 'react-native';

interface useFilePickerProps {
    pickFile: () => Promise<void>;
    file: any;
    fileData: any;
    isLoaded: boolean;
}

export type FileType = {
  uri: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  lastModified: number;
  data: string;
  mime: string;
};

export const useFilePicker = (): useFilePickerProps => {
    // Android and ios will return slightly different file responses.
    const [file, setFile] = useState({} as FileType | DocumentPickerResponse | null | undefined);
    const [fileData, setFileData] = useState({} as any);
    const [isLoaded, setIsLoaded] = useState(false);

    const pickFile = async () => {
            try {
              if (Config.isAndroid) {
                  const doc = await ScopedStorage.openDocument(true, 'utf8');

                  if (doc.mime !== 'text/comma-separated-values') {
                      Alert.alert('Invalid File Type', 'Please select a CSV file.');
                      setFile(null);
                      setFileData(null);
                      setIsLoaded(false);
                      return;
                  }

                  setFile(doc);
                  // openDocument() also reads the file's data, This requires less steps in the import process.
                  setFileData(doc?.data);
                  setIsLoaded(true);
              } else if (Config.isIos) {
                  const doc = await DocumentPicker.pickSingle({
                      type: [DocumentPicker.types.csv],
                  });

                  setFile(doc);
                  setIsLoaded(true);
                }
            } catch (err) {
                console.log(err);
                setFile({} as FileType | DocumentPickerResponse | null | undefined);
            }
        };

    return { file, fileData, pickFile, isLoaded };
};
