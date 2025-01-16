import React, { useEffect, useRef } from 'react';
import { Modal, TouchableOpacity, StyleSheet, Animated, Dimensions, View, Text } from 'react-native';

interface ResultPopupProps {
  visible: boolean;
  winner: 'O' | 'X' | null;
  onRestart: () => void;
}

export default function ResultPopup({ visible, winner, onRestart }: ResultPopupProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);

      // Sequence of animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const backgroundColor = '#2D3748'; // Neutral dark gray background
  const winnerText = winner === 'O' ? '🎉 You Win!' : winner === 'X' ? '🤖 AI Wins!' : '🤝 It’s a Draw!';
  const subText =
    winner === 'O'
      ? 'Congratulations! You beated the AI.'
      : winner === 'X'
      ? 'Hehe the AI wins! Try again.'
      : 'Play another round?';

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.popup, { backgroundColor, transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.resultText}>{winnerText}</Text>
          <Text style={styles.subText}>{subText}</Text>
          <TouchableOpacity style={styles.button} onPress={onRestart}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: width * 0.85,
    maxWidth: 350,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  resultText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  subText: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4A5568',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});