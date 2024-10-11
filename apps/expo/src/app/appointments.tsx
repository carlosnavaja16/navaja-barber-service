import { View, Text, StyleSheet } from 'react-native';

export default function Appointments() {
  return (
    <View style={styles.container}>
      <Text>Appointments</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
