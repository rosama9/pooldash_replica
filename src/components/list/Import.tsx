import React, { useEffect, useState } from 'react';
import { useFilePicker } from '~/hooks/useFilePicker';
import { CSVPool, ImportService } from '~/services/importService';
import { PDText } from '../PDText';
import { PDSpacing, useTheme } from '../PDTheme';
import { PDView } from '../PDView';
import { PDStackNavigationProps } from '~/navigator/shared';
import { useNavigation } from '@react-navigation/native';
import { Alert, StyleSheet, View } from 'react-native';
import { Config } from '~/services/Config/AppConfig';
import { TempCsvRepo } from '~/repository/TempCsvRepo';
import { readString } from 'react-native-csv';
import { Database } from '~/repository/Database';
import pluralize from 'pluralize';
import { PDButtonSolid } from '../buttons/PDButtonSolid';
import { SVG } from '~/assets/images';
import { PDButton } from '../buttons/PDButton';


export const Import: React.FC = () => {
  const { file, fileData, pickFile, isLoaded } = useFilePicker();
  const [pools, setPools] = useState<CSVPool[]>([]);
  const [isImported, setIsImported] = useState(false);
  const [imports, setImports] = useState(0);
  const [poolImportStats, setPoolImportStats] = useState({
    imported: {
      pools: 0,
      logs: 0,
    },
    notImported: {
      pools: 0,
      logs: 0,
    },
  });
  const { navigate } = useNavigation<PDStackNavigationProps>();
  const theme = useTheme();
  const styles = getStyles(theme, StyleSheet);

  useEffect(() => {
    const getImports = async () => {
        const importNum = await Database.getCSVImportedPoolCount();
        setImports(importNum);
    };

    getImports();
    }, [imports, pools]);

  useEffect(() => {

    const importCSV = async () => {
      if (Config.isAndroid) {
        const { data, errors } = readString(fileData, { header: true });

        if (errors.length) {
          alertErrors(errors);
          navigate('Home');

          return;
        }

        const result = ImportService.convertJSON_To_Pools(data);

        setPools(result);
      } else {
        const readFileData = await TempCsvRepo.readCSV(file.uri);
        const { data, errors } = ImportService.convertCSV_To_JSON(readFileData);

        if (errors.length) {
          alertErrors(errors);
          navigate('Home');

          return;
        }

        const result = ImportService.convertJSON_To_Pools(data);

        setPools(result);
      }
    };

    if (isLoaded) {
      importCSV();
    }

  }, [file, fileData, isLoaded, isImported, navigate]);

  const savePools = () => {
    const importMethodString = `pd-mobile-csv-0-${(new Date()).toISOString()}`;
    let numberOfErrors = 0;
    let logErrors = 0;
    const totalLogs = pools.reduce((acc: number, pool: any) => pool.logs.length + acc, 0);

    pools.map((pool) => {
        pool.importMethod = importMethodString;
        const savePool = Database.saveNewPool(pool);

        if (savePool === null || savePool === undefined) {
            numberOfErrors += 1;
            logErrors += pool.logs?.length || 0;

            return;
        }

        const { logs } = pool;
        logs?.forEach(async (log) => {
            const logImportMethodString = `pd-mobile-csv-0-${(new Date()).toISOString()}`;
            log.importMethod = logImportMethodString;
            await Database.saveNewLogEntry(log);
        });

        navigate('Home');
    });

    setPoolImportStats({
      imported: {
        pools: pools.length - numberOfErrors,
        logs: totalLogs - logErrors,
      },
      notImported: {
        pools: numberOfErrors,
        logs: logErrors,
      },
    });


    if (numberOfErrors >= pools.length) {
      setIsImported(false);
      alertFailure(numberOfErrors);
      numberOfErrors = 0;
      setPools([]);
    } else {
      setIsImported(true);
      alertSuccess(pools.length - numberOfErrors);
    }
  };

  const handleCancelImport = async () => {
    Database.deletePools();
    navigate('Home');
    Alert.alert('Undo', `You have successfully undone the import of ${imports} pools.`);
  };

  const goHome = () => {
    navigate('Home');
  };

  const alertSuccess = (imported: number) => {
    Alert.alert('Imported', `Imported ${imported} ${pluralize('pool', imported)}`);
  };

  const alertFailure = (numberOfErrors: number) => {
    Alert.alert('Error', `There were ${numberOfErrors} errors while importing the CSV file. Please check the file and try again.`);
  };

  const ImportStats = () => {
    return isImported ? (
          <PDView style={ styles.importStats }>
            {
              Object.keys(poolImportStats).forEach((key: string, index) => {
                const { pools, logs } = poolImportStats[key];
                const action = key === 'imported' ? 'Imported' : 'Not Imported';

                return (
                  <View key={ `${key}-${index}` }>
                    <PDText type="subHeading" color="greyDarker">
                      { pools } { pluralize('pool', pools) } { action }
                    </PDText>
                    <PDText type="subHeading" color="greyDarker">
                      { logs } { pluralize('logs', logs) } { action }
                    </PDText>
                  </View>
                );
              })
            }
          </PDView>
        ) : null;
      };

      const importButtonText = () => {
        if (pools.length) {
          if (isImported) {
            return 'Go Home';
          } else {
            return `Import ${pools.length} ${pluralize('pool', pools.length)}`;
          }
        } else {
          return 'Select File';
        }
      };

      const importButtonOnPress = () => {
        if (pools.length && isLoaded) {
          if (isImported) {
            goHome();
          } else {
            savePools();
          }
        } else {
          pickFile();
        }
      };

  return (
    <PDView style={ styles.container }>
      <PDText type="heading" color="black">CSV Import</PDText>
      <PDText type="bodyRegular" color="greyDark">
        Want to import pools from a .csv file?
      </PDText>
      <ImportStats/>
      <PDButton onPress={ importButtonOnPress } style={ styles.boringButtonContainer } textColor="alwaysWhite"> { importButtonText() }</PDButton>
      {
              imports > 0 && (
                  <>
                      <PDText type="bodyRegular" color="greyDark" style={ styles.cancelButtonContainer }>
                          Want to start over? You can <PDText>undo</PDText> everything imported.
                      </PDText>
                      <PDButtonSolid
                          disabled={ imports === 0 }
                          bgColor={ imports !== 0 ? 'red' : 'grey' }
                          textColor="alwaysWhite"
                          onPress={ handleCancelImport }
                          icon={ <SVG.IconDeleteOutline fill={ theme.colors.alwaysWhite } /> }
                          title="Undo Import"
                          style={ styles.cancelButton } />
                  </>
              )
      }
    </PDView>
  );
};

const getStyles = (theme: any, styleSheet: any) => {
  return styleSheet.create({
    container: {
      flex: 1,
    },
    boringButtonContainer: {
      backgroundColor: theme.colors.blue,
      marginTop: PDSpacing.md,
      borderRadius: 27.5,
      paddingVertical: PDSpacing.xs,
    },
    cancelButtonContainer: {
      marginTop: PDSpacing.xl,
    },
    cancelButton: {
      marginBottom: PDSpacing.xl,
      marginTop: PDSpacing.sm,
    },
  });
};

function alertErrors(errors: any) {
    for (let err of errors) {
      const { message } = err;
      Alert.alert('Error', message);

      return;
    }
}
