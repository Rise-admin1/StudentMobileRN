import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Image } from 'expo-image';

import React, { useEffect, useState } from "react";
import { router, usePathname } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ipURL } from "../utils/utils";
import { SIZES } from "../../constants";

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


const HomeFlatlist = ({ homeData, handleItemPress }) => {
  const [showAllText, setShowAllText] = useState(false);
  const maxLines = 2;
  console.log("homeData", homeData);

  const handlePressEdit = (item) => {
    console.log("Edit item", item._id);
    router.push(`../profile/editSubject/${item._id}`);
  };

  const handleIPressDelete = async (item) => {
    console.log("Delete item", item);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const resp = await axios.delete(
        `${ipURL}/api/subjects/${item._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Subject deleted successfully");
    } catch (error) {
      console.error("Error fetching subject data:", error);
    }
  };
  const routeInfo = usePathname();
  interface User {
    isTeacher?: boolean;
    subjects?: SubjectItem[];
  }
  interface SubjectItem {
    _id: string;
    subjectName: string;
    subjectDescription?: string;
    subjectImage?: string;
    subjectPrice?: number;
    subjectBoard?: string;
    subjectGrade?: number;
  }

  const [user, setUser] = useState<User>({});
  useEffect(() => {
    const getUser = async () => {
      const apiUser = await axios.get(`${ipURL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("authToken")}`,
        },
      });
      setUser(apiUser.data);
    };
    getUser();
  }, []);

  console.log("User>>>>", user);

  return (
    <View style={{ flex:1 }}>
      <View style={styles.cardsContainer}>
      <FlatList
        data={homeData}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View style={styles.card}>
              <View style={styles.titlePriceContainer}>
                <Text style={styles.text1}>{item.subjectName}</Text>
                <View>
                  <Text style={[styles.text2, styles.button2]}>
                    {item.subjectBoard}
                  </Text>
                  {routeInfo === "/profile" && user.isTeacher && (
                    <View style={styles.editButtonContainer}>
                      <TouchableOpacity onPress={() => handlePressEdit(item)}>
                        <Text style={[styles.text2, styles.button2]}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleIPressDelete(item)}
                      >
                        <Text style={[styles.text2, styles.button2]}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.rowContainer}>
                <Image
                  source={{ uri: item.subjectImage }}
                  style={styles.image}
                  placeholder={blurhash}
                  contentFit="cover"
                  transition={100}
                />
                <View style={styles.textContainer}>
                  <Text numberOfLines={showAllText ? undefined : maxLines}>
                    {item.subjectDescription}
                  </Text>
                  <View style={styles.priceGradeContainer}>
                    <Text style={styles.text2}>Price: {item.subjectPrice}</Text>
                    <Text style={styles.text2}>Grade: {item.subjectGrade}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
      />
      </View>
    </View>
  );
};

export default HomeFlatlist;

const styles = StyleSheet.create({
  text1: {
    fontSize: 20,
    fontFamily: "Roboto-Regular",
  },
  text2: {
    fontSize: 15,
    fontFamily: "Roboto-Regular",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    margin: 10,
    shadowColor: "orange",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 75,
    height: 75,
    resizeMode: "cover",
    borderRadius: 10,
  },
  rowContainer: {
    flexDirection: "row",
  },
  textContainer: {
    marginLeft: 5,
    flex: 1,
  },
  titlePriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 2,
    paddingBottom: 3,
  },
  button2: {
    backgroundColor: "orange",
    borderRadius: 20,
    paddingLeft: 6,
    paddingRight: 6,
    textAlign: "center",
  },
  editButtonContainer: {
    flexDirection: "row",
    paddingTop: 5,
  },
  priceGradeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
  },
  cardsContainer: {
    marginTop: SIZES.medium,
    gap: SIZES.small,
  },
});
