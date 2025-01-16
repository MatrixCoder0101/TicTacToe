import React, { useState, useEffect } from 'react';
import { Modal, TouchableOpacity, StyleSheet, Animated, Linking, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Reminder() {
  const [visible, setVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Fade-in effect
  const [scaleAnim] = useState(new Animated.Value(0)); // Scale animation

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      // Trigger the popup animations
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2000); // Show popup after 2 seconds

    return () => clearTimeout(timer); // Clear timeout on component unmount
  }, []);

  const openRepo = () => {
    // Open GitHub repository in the browser
    Linking.openURL('https://github.com/your-username/your-repo'); // Replace with your actual repo URL
    closePopup();
  };

  const closePopup = () => {
    // Close the popup
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setVisible(false)); // Fade-out and then set visible to false
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.popup, { transform: [{ scale: scaleAnim }] }]}>
          <Ionicons name="mail-outline" size={30} color="white" style={styles.icon} />
          <Text style={styles.headerText}>
            Reminder
          </Text>

          <Text style={styles.descriptionText}>
            Don't forget to give a ⭐️ to the project on GitHub! It helps a lot and encourages future development.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.remindButton]} onPress={closePopup} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Remind me later</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.goButton]} onPress={openRepo} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Go</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '85%',
    maxWidth: 350,
    padding: 20,
    backgroundColor: '#2D3748',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  remindButton: {
    backgroundColor: '#FF6347', // Red-orange color for "Remind me later"
  },
  goButton: {
    backgroundColor: '#4CAF50', // Green color for "Go"
  },
  buttonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
  },
});