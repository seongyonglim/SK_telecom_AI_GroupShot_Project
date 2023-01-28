import { useReducer, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const initState = { count: 0 };

const CountType = {
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
};

const reducer = (state, action) => {
  switch (action.key) {
    case CountType.INCREMENT:
      // return state + action.value;
      state.count = state.count + 1;
      return state;
    case CountType.DECREMENT:
      // return state - action.value;
      return { count: state.count - 1 };
    default:
      return state;
  }
};

const ReducerTest = () => {
  // const [result, setResult] = useState(0);
  const [result, dispatch] = useReducer(reducer, initState);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{result.count}</Text>

      <Button
        title={'+'}
        onPress={() => dispatch({ key: CountType.INCREMENT, value: 2 })}
      />
      <Button
        title={'-'}
        onPress={() => dispatch({ key: CountType.DECREMENT, value: 1 })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
  },
});

export default ReducerTest;
