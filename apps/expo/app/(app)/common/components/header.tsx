import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { selectHeaderText } from '../store/header/headerSlice';
import { useAppSelector } from '../store/hooks';
import {
  NAVAJA_SLATE_200,
  NAVAJA_SLATE_800,
  NAV_HEIGHT,
  NAV_HEIGHT_MOBILE
} from '../styles';
import { goToHome } from '../routes';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle
} from 'react-native-reanimated';

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
    menuLogoContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 12
    },
    logo: {
      resizeMode: 'contain',
      width: 65,
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

const isWeb = Platform.OS === 'web';
const styles = getStyles(isWeb);

export const Header = () => {
  const headerText = useAppSelector(selectHeaderText);
  const menuBtnRotate = useSharedValue(0);

  const toggleMenu = () => {
    menuBtnRotate.value =
      menuBtnRotate.value === 0 ? withTiming(90) : withTiming(0);
  };

  const menuButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${menuBtnRotate.value}deg` }]
    };
  });

  return (
    <View style={styles.nav}>
      <View style={styles.menuLogoContainer}>
        <Animated.View style={menuButtonStyle}>
          <MaterialIcons
            name="menu"
            size={25}
            color={NAVAJA_SLATE_800}
            onPress={toggleMenu}
          />
        </Animated.View>
        <Pressable onPress={goToHome}>
          <Image
            style={styles.logo}
            source={require('../../../../../../packages/shared/assets/navajaLogo.png')}
          />
        </Pressable>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{headerText}</Text>
      </View>
      <View style={styles.emptyContainer}></View>
    </View>
  );
};
