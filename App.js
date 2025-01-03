import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ShoppingList from './components/ShoppingList';
import { SafeAreaView, StyleSheet } from 'react-native';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <ShoppingList />
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  }
});

export default App;