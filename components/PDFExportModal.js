import React, { useState } from 'react';
import { View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Modal, Card, Text, Divider, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { api } from '../utils/api';

export default function PDFExportModal({ visible, onDismiss, hisabs, personName }) {
    const [startDate, setStartDate] = useState(startOfDay(new Date(new Date().setMonth(new Date().getMonth() - 1))));
    const [endDate, setEndDate] = useState(endOfDay(new Date()));
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);

    const generatePDF = async () => {
        try {
            setPdfLoading(true);

            // Filter hisabs based on date range with timezone-safe comparison
            const filteredHisabs = hisabs.filter(hisab => {
                const hisabDate = parseISO(hisab.date);
                return isWithinInterval(hisabDate, {
                    start: startOfDay(startDate),
                    end: endOfDay(endDate)
                });
            });

            if (filteredHisabs.length === 0) {
                Alert.alert('No Transactions', 'There are no transactions in the selected date range.');
                setPdfLoading(false);
                return;
            }

            // Format dates for the API (use local date strings)
            const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');

            // Call the API to generate PDF
            const response = await api.post('/generate_hisab_pdf/', {
                hisabs: filteredHisabs,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                personName
            }, { responseType: 'blob' });

            const fileName = `Hisab_Report_${personName}_${formattedStartDate}_${formattedEndDate}.pdf`;
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;

            const fr = new FileReader();
            fr.onload = async () => {
                const base64data = fr.result.split(',')[1];
                await FileSystem.writeAsStringAsync(fileUri, base64data, { encoding: FileSystem.EncodingType.Base64 });

                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(fileUri);
                } else {
                    Alert.alert('Success', `PDF saved to ${fileUri}`);
                }

                onDismiss();
                setPdfLoading(false);
            };
            fr.readAsDataURL(response.data);

        } catch (error) {
            console.error("Failed to generate PDF:", error);
            Alert.alert('❌ Error', 'Failed to generate PDF. Please try again.');
            setPdfLoading(false);
        }
    };

    const onStartDateChange = (event, selectedDate) => {
        setShowStartDatePicker(false);
        if (selectedDate) {
            setStartDate(startOfDay(selectedDate)); // Normalize to start of day
        }
    };

    const onEndDateChange = (event, selectedDate) => {
        setShowEndDatePicker(false);
        if (selectedDate) {
            setEndDate(endOfDay(selectedDate)); // Normalize to end of day
        }
    };

    return (
        <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
            <Card style={styles.modalCard}>
                <Card.Content style={styles.cardContent}>
                    <View style={styles.header}>
                        <View style={styles.iconBadge}>
                            <Icon name="file-pdf-box" size={24} color="#FFFFFF" />
                        </View>
                        <Text style={styles.modalTitle}>Export as PDF</Text>
                    </View>
                    <Divider style={styles.modalDivider} />

                    <Text style={styles.modalSubtitle}>Select Date Range</Text>

                    <View style={styles.datePickerContainer}>
                        <Text style={styles.datePickerLabel}>From</Text>
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => setShowStartDatePicker(true)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.dateInputText}>
                                {format(startDate, 'dd MMM yyyy')}
                            </Text>
                            <Icon name="calendar" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.datePickerContainer}>
                        <Text style={styles.datePickerLabel}>To</Text>
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => setShowEndDatePicker(true)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.dateInputText}>
                                {format(endDate, 'dd MMM yyyy')}
                            </Text>
                            <Icon name="calendar" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {showStartDatePicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            onChange={onStartDateChange}
                            maximumDate={endDate}
                        />
                    )}

                    {showEndDatePicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display="default"
                            onChange={onEndDateChange}
                            minimumDate={startDate}
                            maximumDate={new Date()}
                        />
                    )}
                </Card.Content>
                <Card.Actions style={styles.modalActions}>
                    <Button
                        mode="outlined"
                        onPress={onDismiss}
                        style={styles.cancelButton}
                        labelStyle={styles.cancelButtonLabel}
                        textColor="#AAAAAA"
                    >
                        Cancel
                    </Button>
                    <Button
                        mode="contained"
                        onPress={generatePDF}
                        style={styles.generateButton}
                        labelStyle={styles.generateButtonLabel}
                        loading={pdfLoading}
                        disabled={pdfLoading}
                        buttonColor="#FFFFFF"
                        textColor="#000000"
                    >
                        {pdfLoading ? 'Generating...' : 'Generate PDF'}
                    </Button>
                </Card.Actions>
            </Card>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    cardContent: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconBadge: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#2A2A2A',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    modalTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    modalDivider: {
        backgroundColor: '#2A2A2A',
        marginBottom: 20,
        height: 1,
    },
    modalSubtitle: {
        color: '#AAAAAA',
        fontSize: 15,
        marginBottom: 20,
        fontWeight: '500',
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    datePickerLabel: {
        color: '#AAAAAA',
        width: 60,
        fontSize: 15,
        fontWeight: '500',
    },
    dateInput: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#000000',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    dateInputText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    modalActions: {
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: 8,
    },
    cancelButton: {
        borderColor: '#2A2A2A',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 8,
    },
    cancelButtonLabel: {
        color: '#AAAAAA',
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    generateButton: {
        borderRadius: 12,
        paddingHorizontal: 8,
    },
    generateButtonLabel: {
        fontWeight: '600',
        letterSpacing: 0.3,
    },
});