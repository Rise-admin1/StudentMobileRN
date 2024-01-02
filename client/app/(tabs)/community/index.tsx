import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
} from "react-native";
import React from "react";
import { Ionicons } from '@expo/vector-icons';

const CommunityPage = () => {
  const communites = [
    {
      id: 1,
      name: "Math Community",
      count: 100,
      imagePic:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Deus_mathematics.png/900px-Deus_mathematics.png?20210211120521",
    },
    {
      id: 2,
      name: "Science Community",
      count: 100,
      imagePic:
        "https://img.freepik.com/free-vector/science-lab-objects_23-2148488312.jpg?w=740&t=st=1704101617~exp=1704102217~hmac=ee620e009c76eaeeae4cba6d53464c47a1ed66ce7013e15a693d8abb5a2ad5e8",
    },
    {
      id: 3,
      name: "History Community",
      count: 100,
      imagePic:
        "https://img.freepik.com/free-vector/illustrated-save-planet-concept_23-2148515283.jpg?w=996&t=st=1704101727~exp=1704102327~hmac=ff4f87cbe01b62989088dba1073659fd10695d4d78103783887187df649672ae",
    },
    {
      id: 4,
      name: "Social Community",
      count: 100,
      imagePic:
        "https://img.freepik.com/free-vector/vintage-books-with-paper-scroll-feather-ink-pot-colored-sketch-decorative-concept-vector-illustration_1284-2997.jpg?w=740&t=st=1704101753~exp=1704102353~hmac=304754992a20ce29d33dcb98af8a96d612c901323966454fe83393d54f072cbc",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={[styles.text1, { padding: 10 }]}>
        <Ionicons name="people-outline" size={20} color="#900" /> Discover New Communities
      </Text>
      <View
          style={{
            borderBottomColor: "black", // Change the color as needed
            borderBottomWidth: 1,
            marginVertical: 1, // Adjust the margin as needed
            marginHorizontal: 20, //Adjust the margin as needed
          }} 
        ></View>
      <FlatList
        data={communites}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.rowContainer1}>
              <Image source={{ uri: item.imagePic }} style={styles.image} />
              <View style={[styles.textContainer, { marginLeft: 10 }]}>
                <Text style={styles.text2}>{item.name}</Text>
                <Text style={styles.text2}>{item.count}+ Members</Text>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default CommunityPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 40,
    fontFamily: "SpaceMono-Regular",
    fontWeight: "bold",
  },
  text1: {
    fontSize: 20,
    fontFamily: "SpaceMono-Regular",
    fontWeight: "bold",
  },
  text2: {
    fontSize: 18,
    fontFamily: "SpaceMono-Regular",
    fontWeight: "bold",
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  searchInput: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 50,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Android
  },
  image: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    resizeMode: "cover", // or 'contain' or 'stretch' or 'center'
    borderRadius: 8, // Adjust as needed for rounded corners
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center", // Optional: Align items vertically in the middle
  },
  rowContainer1: {
    flexDirection: "row", // Optional: Align items vertically in the middle
  },
  textContainer: {
    marginLeft: 1, // Add space between image and text
    flex: 1,
  },
  titlePriceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button1: {
    backgroundColor: "#808080", // Default background color
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
