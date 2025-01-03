import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, editItem, deleteItem, setItems, togglePurchased } from '../store/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';

const ShoppingList = () => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const items = useSelector(state => state.items);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadItems = async () => {
      try {
        const savedItems = await AsyncStorage.getItem('shoppingList');
        if (savedItems !== null) {
          dispatch(setItems(JSON.parse(savedItems)));
        }
      } catch (error) {
        console.error('Error loading items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const handleAddItem = () => {
    if (newItemName.trim()) {
      dispatch(addItem({
        name: newItemName.trim(),
        quantity: parseInt(newItemQuantity) || 1,
      }));
      setNewItemName('');
      setNewItemQuantity('');
      Keyboard.dismiss();
    }
  };

  const handleEditPress = (item) => {
    setEditingItem({
      ...item,
      editName: item.name,
      editQuantity: item.quantity.toString()
    });
    setModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editingItem.editName.trim()) {
      dispatch(editItem(editingItem.id, {
        name: editingItem.editName.trim(),
        quantity: parseInt(editingItem.editQuantity) || 1,
      }));
      setModalVisible(false);
      setEditingItem(null);
    }
  };

  const handleTogglePurchased = (id) => {
    dispatch(togglePurchased(id));
  };

  const EditModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Item</Text>
              <TextInput
                style={styles.modalInput}
                value={editingItem?.editName}
                onChangeText={(text) => setEditingItem({...editingItem, editName: text})}
                placeholder="Item name"
              />
              <TextInput
                style={styles.modalInput}
                value={editingItem?.editQuantity}
                onChangeText={(text) => setEditingItem({...editingItem, editQuantity: text})}
                placeholder="Quantity"
                keyboardType="numeric"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, item.purchased && styles.purchasedItem]}>
      <View style={styles.itemLeftSection}>
        <Checkbox
          value={item.purchased}
          onValueChange={() => handleTogglePurchased(item.id)}
          style={styles.checkbox}
        />
        <View style={styles.itemDetails}>
          <Text style={[styles.itemText, item.purchased && styles.purchasedText]}>
            {item.name}
          </Text>
          <Text style={styles.quantityText}>Quantity: {item.quantity}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditPress(item)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => dispatch(deleteItem(item.id))}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping List</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputFields}>
          <TextInput
            style={[styles.input, styles.nameInput]}
            value={newItemName}
            onChangeText={setNewItemName}
            placeholder="Item name"
          />
          <TextInput
            style={[styles.input, styles.quantityInput]}
            value={newItemQuantity}
            onChangeText={setNewItemQuantity}
            placeholder="Quantity"
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddItem}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
      />
      <EditModal />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center'
  },
  inputFields: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 10
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff'
  },
  nameInput: {
    flex: 3,
    marginRight: 10
  },
  quantityInput: {
    flex: 1
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center'
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2
  },
  purchasedItem: {
    backgroundColor: '#f8f8f8',
    opacity: 0.8
  },
  itemLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  checkbox: {
    marginRight: 10
  },
  itemDetails: {
    flex: 1
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4
  },
  purchasedText: {
    textDecorationLine: 'line-through',
    color: '#666'
  },
  quantityText: {
    fontSize: 12,
    color: '#666'
  },
  buttonContainer: {
    flexDirection: 'row'
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 5,
    marginRight: 5
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5
  },
  saveButton: {
    backgroundColor: '#4CAF50'
  },
  cancelButton: {
    backgroundColor: '#f44336'
  },
  list: {
    flex: 1
  }
});

export default ShoppingList;