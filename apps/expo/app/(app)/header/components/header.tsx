import {
  View,
  StyleSheet,
  Image,
  Platform,
  Text,
  Pressable
} from 'react-native';
import { router } from 'expo-router';
import {
  NAV_HEIGHT,
  NAV_HEIGHT_MOBILE,
  NAVAJA_SLATE_200,
  NAVAJA_SLATE_800
} from '../../common/styles';
import { useAppSelector } from '../../store/hooks';
import { selectHeaderText } from '../state/headerSlice';

export const Header = () => {
  const isWeb = Platform.OS === 'web';

  const styles = getStyles(isWeb);

  const headerText = useAppSelector(selectHeaderText);

  const goHome = () => {
    router.replace('/');
  };

  return (
    <View style={styles.nav}>
      <Pressable onPress={goHome} style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../../../../../../packages/shared/assets/navajaLogo.png')}
        />
      </Pressable>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{headerText}</Text>
      </View>
      <View style={styles.emptyContainer}></View>
    </View>
  );
};

const getStyles = (isWeb: boolean) =>
  StyleSheet.create({
    nav: {
      width: '100%',
      height: isWeb ? NAV_HEIGHT : NAV_HEIGHT_MOBILE,
      backgroundColor: NAVAJA_SLATE_200,
      top: 0,
      padding: 15,
      display: 'flex',
      flexDirection: 'row',
      alignItems: isWeb ? 'center' : 'flex-end'
    },
    logoContainer: {
      flex: 1
    },
    logo: {
      resizeMode: 'contain',
      width: 75,
      height: 30
    },
    headerContainer: {
      height: 30,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    header: {
      fontSize: 18,
      fontWeight: 'bold',
      color: NAVAJA_SLATE_800
    },
    emptyContainer: {
      flex: 1
    }
  });
