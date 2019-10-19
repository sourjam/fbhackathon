import * as WebBrowser from 'expo-web-browser';
import React, {useState, useEffect} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MonoText } from '../components/StyledText';
import {ay, aw, ee, ai, oh, ow, oo, oy, see, ibe, ib, obe, ob, ub, ade, ad, eed, ed, ide, id, ode, odd, ude, ud, ood, aud, oid, oud, and, end, urn} from '../rhymes';

const wordLists = [ay, aw, ee, ai, oh, ow, oo, oy, see, ibe, ib, obe, ob, ub, ade, ad, eed, ed, ide, id, ode, odd, ude, ud, ood, aud, oid, oud, and, end]

let rawWords = []

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// passing in 26
function trackCounts(total, array) {
  if (total < 10) {
    array.push(total)
    return array
  }
  let slice = getRandomInt(Math.floor(total / 2));
  let currentTotal = total;
  let numsArray = array || []
  currentTotal -= slice
  numsArray.push(slice)
  return trackCounts(currentTotal, numsArray)
}


const createRhymingObjects = (wordLists) => {
  // const trackCount = trackCounts(24)
  const shuffledLists = shuffle(wordLists)
  const limitedLists = shuffledLists.slice(0, 6);

  const numbers = shuffle([1,2,3,5,8,5])
  
  limitedLists.forEach((list, listIndex) => {
    for (let i = 0; i < numbers[listIndex]; i++) {
      const rhymeObj = {
        text: list[i] ? list[i] : urn[i],
        listIndex: listIndex
      }
      rawWords.push(rhymeObj)
    }
  })
}

createRhymingObjects(wordLists)
let gameWords = shuffle(rawWords).slice(0, 24)

let timeout

export default function HomeScreen() {
  const [selectedWord, setSelectedWord] = useState('')
  const [selectedListIndex, setSelectedListIndex] = useState()
  const [selectedWordIndex, setSelectedWordIndex] = useState()
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [scoredWords, setScoredWords] = useState([])
  const [gameOn, setGameOn] = useState(true)
  const [timer, setTimer] = useState(10)

  const createTimeout = () => {
    if (!gameOn) return;
    timeout = setTimeout(() => {
      const newTimer = timer - 1
      setTimer(newTimer)
    }, 1000)
  }
  
  if (timer === 0) {
    if (scoredWords.length === 0) {
      const newLives = lives - 1;
      setLives(newLives)
      if (newLives <= 0) {
        setGameOn(false)
        clearTimeout(timeout)
        alert('game over man, game over')
      }
    }
    clearTimeout(timeout);
    rawWords = [];
    createRhymingObjects(wordLists)
    gameWords = shuffle(rawWords)
    setSelectedWord('')
    setSelectedListIndex(undefined)
    setSelectedWordIndex(undefined)
    setScoredWords([])
    setTimer(10)
  } else {
    createTimeout();
  }
  const makeSelection = (word, index) => {
    if (!gameOn) return;
    if (selectedWord) {
      if (word.text === selectedWord) {
        setSelectedWord('')
        setSelectedListIndex(undefined)
        setSelectedWordIndex(undefined)
        return
      }
      if (word.listIndex === selectedListIndex) {
        const multiplier = scoredWords.length + 1
        const newScore = score + (1) * multiplier;
        setScore(newScore)
        const copiedWords = scoredWords.slice();
        copiedWords.push(selectedWordIndex, index);
        setScoredWords(copiedWords)
        setSelectedWord('')
        setSelectedListIndex(undefined)
        setSelectedWordIndex(undefined)
      } else {
        // fail
        setSelectedWord('')
        setSelectedListIndex(undefined)
        setSelectedWordIndex(undefined)
        const newLives = lives - 1;
        setLives(newLives)
        if(newLives === 0) {
          setGameOn(false)
          clearTimeout(timeout)
          alert('game over man, game over')
        } else {
          alert('lost a life!')
        }
      }
    } else {
      setSelectedWord(word.text)
      setSelectedListIndex(word.listIndex)
      setSelectedWordIndex(index)
    }
  }
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.welcomeContainer}>
        </View>
        <View style={styles.squares}>
          {gameWords.map((word, index) => {
            if (!word.text) {
              return(
                <Text key={word.text} onPress={() => makeSelection(word, index)} style={selectedWord === urn[index].text ? styles.selectedSquare : styles.square}>{urn[index].text}</Text>
              )
            }
            if (scoredWords.includes(index)) {
              return(
                <Text key={word.text} style={styles.scoredSquare}>{word.text}</Text>
              )              
            }
            return(
              <Text key={word.text} onPress={() => makeSelection(word, index)} style={selectedWord === word.text ? styles.selectedSquare : styles.square}>{word.text}</Text>
            )
          })}
        </View>
        <View style={styles.getStartedContainer}>
          <Text style={styles.getStartedText}>Score: {score}</Text>
          <Text style={styles.getStartedText}>Lives: {lives} Timer: {timer}</Text>
          <DevelopmentModeNotice />

          <Text style={styles.getStartedText}>Get started by opening</Text>

          <View
            style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
            <MonoText>screens/HomeScreen.js</MonoText>
          </View>

          <Text style={styles.getStartedText}>
            Change this text and your app will automatically reload.
          </Text>
        </View>

        <View style={styles.helpContainer}>
          <TouchableOpacity onPress={handleHelpPress} style={styles.helpLink}>
            <Text style={styles.helpLinkText}>
              Help, it didn’t automatically reload!
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.tabBarInfoContainer}>
        <Text style={styles.tabBarInfoText}>
          This is a tab bar. You can edit it in:
        </Text>

        <View
          style={[styles.codeHighlightContainer, styles.navigationFilename]}>
          <MonoText style={styles.codeHighlightText}>
            navigation/MainTabNavigator.js
          </MonoText>
        </View>
      </View>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/development-mode/'
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
  );
}

const styles = StyleSheet.create({
  squares: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  square: {
    width: 100,
    height: 100,
    textAlign: 'center',
    borderWidth: .5,
    borderRadius: 5,
    borderColor: 'black'
  },
  selectedSquare: {
    width: 100,
    height: 100,
    textAlign: 'center',
    borderWidth: .5,
    borderRadius: 5,
    borderColor: 'black',
    backgroundColor: 'lightgrey'
  },
  scoredSquare: {
    width: 100,
    height: 100,
    textAlign: 'center',
    borderWidth: .5,
    borderRadius: 5,
    borderColor: 'black',
    backgroundColor: 'palegreen'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
