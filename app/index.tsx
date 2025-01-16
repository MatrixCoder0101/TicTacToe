import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import ResultPopup from '@/components/Popup';
import { checkWinner, minimax } from '@/utils/logic';
import type { Board, Player, GameResult } from '@/types/game';

export default function Game() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isHumanTurn, setIsHumanTurn] = useState(true);
  const [winner, setWinner] = useState<Player>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [blinkAnim] = useState(new Animated.Value(1));
  const [cellAnims] = useState(Array(9).fill(null).map(() => new Animated.Value(0)));

  // Rest of the game logic functions remain the same as in your code
  const animateCell = (index: number) => {
    Animated.timing(cellAnims[index], {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsGameOver(false);
    setWinningLine(null);
    setIsHumanTurn(true);
    blinkAnim.setValue(1);
    cellAnims.forEach(anim => anim.setValue(0));
  };

  const blinkWinningCells = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 3 }
    ).start(() => {
      setIsGameOver(true);
    });
  };

  const handleGameEnd = (result: GameResult) => {
    setWinner(result.winner);
    setWinningLine(result.line);
    if (result.line) {
      blinkWinningCells();
    } else {
      setIsGameOver(true);
    }
  };

  const handleCellPress = (index: number) => {
    if (!isHumanTurn || board[index] || isGameOver) return;

    const newBoard = [...board];
    newBoard[index] = 'O';
    setBoard(newBoard);
    animateCell(index);

    const result = checkWinner(newBoard);
    if (result) {
      handleGameEnd(result);
    } else if (!newBoard.includes(null)) {
      handleGameEnd({ winner: null, line: null });
    } else {
      setIsHumanTurn(false);
      setTimeout(() => makeAIMove(newBoard), 500);
    }
  };

  const makeAIMove = (currentBoard: Board) => {
    const aiMove = minimax(currentBoard, true).index;
    if (typeof aiMove === 'number') {
      const newBoard = [...currentBoard];
      newBoard[aiMove] = 'X';
      setBoard(newBoard);
      animateCell(aiMove);

      const result = checkWinner(newBoard);
      if (result) {
        handleGameEnd(result);
      } else if (!newBoard.includes(null)) {
        handleGameEnd({ winner: null, line: null });
      } else {
        setIsHumanTurn(true);
      }
    }
  };

  const renderCell = (index: number) => {
    const value = board[index];
    const isWinningCell = winningLine?.includes(index);

    return (
      <TouchableOpacity
        key={index}
        style={[styles.cell, isWinningCell && styles.winningCell]}
        onPress={() => handleCellPress(index)}
        activeOpacity={0.7}
      >
        <Animated.Text
          style={[
            styles.cellText,
            {
              transform: [{
                scale: cellAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                })
              }],
              opacity: isWinningCell ? blinkAnim : 1,
              color: value === 'X' ? '#FF5252' : '#4CAF50',
            }
          ]}
        >
          {value}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tic Tac Toe</Text>
        <Text style={styles.subtitle}>Try to beat the AI!</Text>
      </View>
      
      {/* Tab-style turn indicator */}
      <View style={styles.tabContainer}>
        <View style={[
          styles.tab,
          isHumanTurn && styles.activeTab,
          { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }
        ]}>
          <Text style={[
            styles.tabText,
            isHumanTurn && styles.activeTabText
          ]}>
            Your Turn
          </Text>
        </View>
        <View style={[
          styles.tab,
          !isHumanTurn && styles.activeTab,
          { borderTopRightRadius: 12, borderBottomRightRadius: 12 }
        ]}>
          <Text style={[
            styles.tabText,
            !isHumanTurn && styles.activeTabText
          ]}>
            AI Turn
          </Text>
        </View>
      </View>

      <View style={styles.board}>
        {Array(9).fill(null).map((_, index) => renderCell(index))}
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>Reset Game</Text>
      </TouchableOpacity>

      <ResultPopup visible={isGameOver} winner={winner} onRestart={resetGame} />
      <Text style={styles.footerText}>Developed by Goutam Kumar ❤️</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A202C',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0AEC0',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2D3748',
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    width: 140,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4A5568',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#A0AEC0',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
    backgroundColor: '#2D3748',
    borderRadius: 16,
    padding: 8,
  },
  cell: {
    width: '33.33%',
    height: 100,
    borderWidth: 2,
    borderColor: '#4A5568',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    borderRadius: 12,
    margin: -1,
  },
  winningCell: {
    backgroundColor: '#2C3E50',
    borderColor: '#38B2AC',
  },
  cellText: {
    fontSize: 48,
    fontWeight: 'bold',
    lineHeight: 56,
  },
  resetButton: {
    marginTop: 30,
    backgroundColor: '#4A5568',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    position: 'absolute',
    bottom: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});