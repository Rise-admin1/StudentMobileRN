import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,

} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FONT } from '../../../constants/theme';
import { horizontalScale, verticalScale, moderateScale } from '../../utils/metrics';
import { SafeAreaView } from "react-native-safe-area-context";
import { helpCategories } from './helpContent';


const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return helpCategories;

    return helpCategories
      .map((category) => {
        const items = category.items.filter((item) =>
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query) ||
          category.title.toLowerCase().includes(query)
        );
        return items.length > 0 ? { ...category, items } : null;
      })
      .filter(Boolean);
  }, [searchQuery]);

  const handleHelpItemPress = (item) => {
    router.push({
      pathname: '/(tabs)/profile/help-item',
      params: { id: item.id },
    });
  };

  const renderCategory = (category) => (
    <View key={category.title} style={styles.categoryContainer}>
      <View style={styles.categoryHeader}>
        <Ionicons name={category.icon} size={moderateScale(24)} color="#1A4C6E" />
        <Text style={styles.categoryTitle}>{category.title}</Text>
      </View>
      {category.items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.helpItem}
          onPress={() => handleHelpItemPress(item)}
        >
          <Text style={styles.helpItemText}>{item.title}</Text>
          <Ionicons name="chevron-forward" size={moderateScale(20)} color="#64748B" />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#1A4C6E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
      </View>
      <Text style={styles.headerSubtitle}>
        Guides for students, tutors, organizations, and parents.
      </Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={moderateScale(20)} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for help..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={moderateScale(20)} color="#64748B" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Contact Support Button */}
      <TouchableOpacity
        style={styles.contactButton}
        onPress={() => router.push('/(tabs)/profile/contact-us')}
      >
        <Ionicons name="mail-outline" size={moderateScale(20)} color="#FFFFFF" />
        <Text style={styles.contactButtonText}>Contact Support</Text>
      </TouchableOpacity>

      {/* Help Categories */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {filteredCategories.length > 0 ? (
          filteredCategories.map(renderCategory)
        ) : (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search" size={moderateScale(48)} color="#64748B" />
            <Text style={styles.noResultsText}>No results found</Text>
            <Text style={styles.noResultsSubtext}>Try different keywords or contact support</Text>
          </View>
        )}
        
        {/* Developer Credit */}
       
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: moderateScale(8),
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontFamily: FONT.bold,
    color: '#1A4C6E',
    marginLeft: horizontalScale(12),
  },
  headerSubtitle: {
    fontSize: moderateScale(14),
    fontFamily: FONT.regular,
    color: '#64748B',
    paddingHorizontal: moderateScale(16),
    paddingTop: verticalScale(12),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    margin: moderateScale(16),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(12),
    height: verticalScale(48),
  },
  searchInput: {
    flex: 1,
    marginLeft: horizontalScale(8),
    fontSize: moderateScale(16),
    fontFamily: FONT.regular,
    color: '#1A4C6E',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A4C6E',
    margin: moderateScale(16),
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontFamily: FONT.semiBold,
    marginLeft: horizontalScale(8),
  },
  scrollView: {
    flex: 1,
  },
  categoryContainer: {
    marginBottom: verticalScale(24),
    paddingHorizontal: moderateScale(16),
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  categoryTitle: {
    fontSize: moderateScale(18),
    fontFamily: FONT.semiBold,
    color: '#1A4C6E',
    marginLeft: horizontalScale(12),
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(8),
  },
  helpItemText: {
    fontSize: moderateScale(16),
    fontFamily: FONT.regular,
    color: '#1A4C6E',
    flex: 1,
  },
  developerCreditContainer: {
    alignItems: 'center',
    marginTop: verticalScale(30),
    marginBottom: verticalScale(20),
    paddingHorizontal: moderateScale(16),
  },
  developerCreditLine: {
    width: moderateScale(40),
    height: 2,
    backgroundColor: '#1A4C6E',
    marginBottom: verticalScale(12),
    opacity: 0.3,
  },
  developerCreditText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  developerCreditLabel: {
    fontSize: moderateScale(10),
    fontFamily: FONT.regular,
    color: '#64748B',
  },
  developerName: {
    fontSize: moderateScale(10),
    fontFamily: FONT.semiBold,
    color: '#1A4C6E',
  },
  clearButton: {
    padding: moderateScale(4),
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(32),
  },
  noResultsText: {
    fontSize: moderateScale(18),
    fontFamily: FONT.semiBold,
    color: '#1A4C6E',
    marginTop: verticalScale(16),
  },
  noResultsSubtext: {
    fontSize: moderateScale(14),
    fontFamily: FONT.regular,
    color: '#64748B',
    marginTop: verticalScale(8),
    textAlign: 'center',
  },
});

export default HelpCenter; 