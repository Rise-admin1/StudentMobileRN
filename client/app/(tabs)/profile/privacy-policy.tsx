import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONT } from '../../../constants';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/metrics';
import {
  PRIVACY_POLICY_META,
  PRIVACY_POLICY_SECTIONS,
  PrivacyPolicyBlock,
  PrivacyPolicySection,
} from '../../constants/privacyPolicyContent';

const isSubsection = (id: string) => id.includes('.');

const renderBlock = (block: PrivacyPolicyBlock, key: string) => {
  if (block.type === 'paragraph') {
    const isEmailLine = block.text.startsWith('Email: privacy@coachacadem.com');
    const isPrivacyContact =
      block.text.startsWith('Privacy contact: privacy@coachacadem.com');

    if (isEmailLine || isPrivacyContact) {
      return (
        <Text key={key} style={styles.paragraph}>
          {isEmailLine ? 'Email: ' : 'Privacy contact: '}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL(`mailto:${PRIVACY_POLICY_META.privacyEmail}`)}
          >
            {PRIVACY_POLICY_META.privacyEmail}
          </Text>
          {isPrivacyContact
            ? ' — for any question, concern, or request relating to this Policy or your personal data.'
            : ''}
        </Text>
      );
    }

    return (
      <Text key={key} style={styles.paragraph}>
        {block.text}
      </Text>
    );
  }

  if (block.type === 'bullet') {
    return (
      <View key={key} style={styles.bulletList}>
        {block.items.map((item, index) => (
          <View key={`${key}-${index}`} style={styles.bulletRow}>
            <Text style={styles.bulletMarker}>{'\u2022'}</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View key={key} style={styles.tableContainer}>
      {block.rows.map((row, index) => (
        <View key={`${key}-row-${index}`} style={styles.purposeCard}>
          <Text style={styles.purposeTitle}>{row.purpose}</Text>
          <Text style={styles.purposeMeta}>
            <Text style={styles.purposeLabel}>Example: </Text>
            {row.example}
          </Text>
          <Text style={styles.purposeMeta}>
            <Text style={styles.purposeLabel}>Legal basis: </Text>
            {row.legalBasis}
          </Text>
        </View>
      ))}
    </View>
  );
};

const renderSection = (section: PrivacyPolicySection) => {
  const subsection = isSubsection(section.id);

  return (
    <View key={section.id} style={styles.section}>
      <Text style={subsection ? styles.subheading : styles.heading}>
        {section.heading}
      </Text>
      {section.blocks.map((block, index) =>
        renderBlock(block, `${section.id}-block-${index}`)
      )}
    </View>
  );
};

const PrivacyPolicyPage = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={24} color="#12263A" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <Text style={styles.headerSubtitle}>CoachAcadem</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.docTitle}>{PRIVACY_POLICY_META.title}</Text>
        <Text style={styles.audience}>{PRIVACY_POLICY_META.audienceLine}</Text>
        <Text style={styles.orgLine}>{PRIVACY_POLICY_META.orgLine}</Text>

        {PRIVACY_POLICY_SECTIONS.map(renderSection)}

        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => Linking.openURL(`mailto:${PRIVACY_POLICY_META.privacyEmail}`)}
          accessibilityRole="button"
          accessibilityLabel="Email privacy contact"
        >
          <Ionicons name="mail-outline" size={18} color="#1A4C6E" />
          <Text style={styles.emailButtonText}>{PRIVACY_POLICY_META.privacyEmail}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: verticalScale(4),
    paddingBottom: verticalScale(12),
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 4,
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: moderateScale(24),
    color: '#12263A',
  },
  headerSubtitle: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: moderateScale(14),
    color: '#5C6B76',
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(40),
  },
  docTitle: {
    fontFamily: FONT.bold,
    fontSize: moderateScale(20),
    color: '#12263A',
    marginBottom: verticalScale(6),
  },
  audience: {
    fontFamily: FONT.medium,
    fontSize: moderateScale(14),
    color: '#5C6B76',
    marginBottom: verticalScale(10),
  },
  orgLine: {
    fontFamily: FONT.regular,
    fontSize: moderateScale(14),
    color: '#12263A',
    lineHeight: verticalScale(22),
    marginBottom: verticalScale(20),
  },
  section: {
    marginBottom: verticalScale(16),
  },
  heading: {
    fontFamily: FONT.bold,
    fontSize: moderateScale(17),
    color: '#12263A',
    marginBottom: verticalScale(8),
  },
  subheading: {
    fontFamily: FONT.bold,
    fontSize: moderateScale(15),
    color: '#1A4C6E',
    marginBottom: verticalScale(6),
  },
  paragraph: {
    fontFamily: FONT.regular,
    fontSize: moderateScale(14),
    color: '#12263A',
    lineHeight: verticalScale(22),
    marginBottom: verticalScale(10),
  },
  link: {
    fontFamily: FONT.medium,
    color: '#1A4C6E',
    textDecorationLine: 'underline',
  },
  bulletList: {
    marginBottom: verticalScale(10),
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: verticalScale(6),
    paddingRight: horizontalScale(8),
  },
  bulletMarker: {
    fontFamily: FONT.regular,
    fontSize: moderateScale(14),
    color: '#12263A',
    width: 16,
    lineHeight: verticalScale(22),
  },
  bulletText: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: moderateScale(14),
    color: '#12263A',
    lineHeight: verticalScale(22),
  },
  tableContainer: {
    marginBottom: verticalScale(10),
    gap: verticalScale(10),
  },
  purposeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6EBF0',
    padding: moderateScale(12),
  },
  purposeTitle: {
    fontFamily: FONT.bold,
    fontSize: moderateScale(14),
    color: '#12263A',
    marginBottom: verticalScale(6),
  },
  purposeMeta: {
    fontFamily: FONT.regular,
    fontSize: moderateScale(13),
    color: '#5C6B76',
    lineHeight: verticalScale(20),
    marginBottom: verticalScale(2),
  },
  purposeLabel: {
    fontFamily: FONT.medium,
    color: '#12263A',
  },
  emailButton: {
    marginTop: verticalScale(8),
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6EBF0',
    gap: 8,
  },
  emailButtonText: {
    fontFamily: FONT.medium,
    fontSize: moderateScale(14),
    color: '#1A4C6E',
  },
});

export default PrivacyPolicyPage;
