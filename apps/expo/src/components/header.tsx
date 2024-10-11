import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DrawerHeaderProps } from '@react-navigation/drawer';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { goToHome } from '../constants/routes';
import {
  NAVAJA_SLATE_200,
  NAVAJA_SLATE_500,
  NAVAJA_SLATE_800,
  NAV_HEIGHT,
  NAV_HEIGHT_MOBILE
} from '../constants/styles';
import { useAppSelector } from '../store/hooks';
import { selectLoggedIn } from '../store/user/userSlice';

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
    avatarContainer: {
      flex: 1,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingRight: 2
    }
  });

const isWeb = Platform.OS === 'web';
const styles = getStyles(isWeb);

export const Header = (props: DrawerHeaderProps) => {
  const loggedIn = useAppSelector(selectLoggedIn);

  return (
    <View style={styles.nav}>
      <View style={styles.menuLogoContainer}>
        <View>
          <MaterialIcons
            name="menu"
            size={25}
            color={NAVAJA_SLATE_800}
            onPress={props.navigation.openDrawer}
          />
        </View>
        <Pressable onPress={goToHome}>
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={require('../../../../packages/shared/assets/navajaLogo.png')}
          />
        </Pressable>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{props.options.title}</Text>
      </View>
      <View style={styles.avatarContainer}>
        {loggedIn && (
          <FontAwesome name="user-circle" size={24} color={NAVAJA_SLATE_500} />
        )}
      </View>
    </View>
  );
};
