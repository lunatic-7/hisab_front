import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert, Dimensions, TouchableOpacity, SectionList } from 'react-native';
import { Text, Card, IconButton, FAB, Divider, ActivityIndicator, Modal, Portal, Button, TextInput } from 'react-native-paper';
import { api } from '../utils/api';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, parseISO, eachMonthOfInterval, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');

export default function ViewHisabsScreen({ route, navigation }) {
    const { personId, personName } = route.params;
    const [hisabs, setHisabs] = useState([]);
    const [filteredHisabs, setFilteredHisabs] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('months'); // 'months' or 'transactions'
    const [selectedMonth, setSelectedMonth] = useState(null);

    // PDF Export States
    const [pdfModalVisible, setPdfModalVisible] = useState(false);
    const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);

    const fetchHisabs = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/persons/${personId}/hisabs/`);
            const sortedHisabs = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));

            setHisabs(sortedHisabs.reverse());

            const total = sortedHisabs.reduce((sum, hisab) => sum + parseFloat(hisab.price || 0), 0);
            setTotalAmount(total);

        } catch (error) {
            console.error("Failed to fetch hisabs:", error);
            Alert.alert('❌ Error', 'Failed to load hisabs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchHisabs);
        return unsubscribe;
    }, [navigation, personId]);

    // Add this useEffect after existing useEffect hooks
    useEffect(() => {
        if (viewMode === 'transactions' && selectedMonth) {
            const monthHisabs = hisabs
                .filter(hisab => {
                    const hisabDate = parseISO(hisab.date);
                    return isWithinInterval(hisabDate, {
                        start: selectedMonth.startDate,
                        end: selectedMonth.endDate
                    });
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            setFilteredHisabs(monthHisabs);
        }
    }, [hisabs, selectedMonth, viewMode]);

    // Group hisabs by month
    const getMonthlySummary = () => {
        if (hisabs.length === 0) return [];

        // Get all unique months that have transactions
        const monthMap = {};
        hisabs.forEach(hisab => {
            const date = parseISO(hisab.date);
            const monthKey = format(date, 'yyyy-MM');
            const monthName = format(date, 'MMMM yyyy');

            if (!monthMap[monthKey]) {
                monthMap[monthKey] = {
                    monthKey,
                    monthName,
                    startDate: startOfMonth(date),
                    endDate: endOfMonth(date),
                    count: 0,
                    total: 0
                };
            }

            monthMap[monthKey].count++;
            monthMap[monthKey].total += parseFloat(hisab.price);
        });

        // Convert to array and sort by date (newest first)
        return Object.values(monthMap).sort((a, b) => b.startDate - a.startDate);
    };

    const handleMonthPress = (month) => {
        setSelectedMonth(month);
        // Filter hisabs for the selected month and sort by date (newest first)
        const monthHisabs = hisabs
            .filter(hisab => {
                const hisabDate = parseISO(hisab.date);
                return isWithinInterval(hisabDate, {
                    start: month.startDate,
                    end: month.endDate
                });
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

        setFilteredHisabs(monthHisabs);
        setViewMode('transactions');
    };

    const handleBackToMonths = () => {
        setViewMode('months');
        setSelectedMonth(null);
    };

    const deleteHisab = async (hisabId) => {
        Alert.alert(
            '🗑️ Uda de moti ji?',
            'Are you sure you want to delete this transaction?',
            [
                {
                    text: 'Nhi nhi',
                    style: 'cancel'
                },
                {
                    text: 'Chle na',
                    style: 'destructive',
                    onPress: async () => {
                        await api.delete(`/hisabs/${hisabId}/delete/`);
                        await fetchHisabs();
                    }
                }
            ]
        );
    };

    const generatePDF = async () => {
        try {
            setPdfLoading(true);

            // Filter hisabs based on date range
            const filteredHisabs = hisabs.filter(hisab => {
                const hisabDate = parseISO(hisab.date);
                return hisabDate >= startDate && hisabDate <= endDate;
            });

            if (filteredHisabs.length === 0) {
                Alert.alert('No Transactions', 'There are no transactions in the selected date range.');
                setPdfLoading(false);
                return;
            }

            // Format dates for the API
            const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');

            // Call the API to generate PDF
            const response = await api.post('/generate_hisab_pdf/', {
                hisabs: filteredHisabs,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                personName
            }, {
                responseType: 'blob'
            });

            // Save the PDF file
            const fileName = `Hisab_Report_${personName}_${formattedStartDate}_${formattedEndDate}.pdf`;
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;

            // Convert the blob to base64
            const fr = new FileReader();
            fr.onload = async () => {
                const base64data = fr.result.split(',')[1];

                // Write the file
                await FileSystem.writeAsStringAsync(fileUri, base64data, { encoding: FileSystem.EncodingType.Base64 });

                // Share the file
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(fileUri);
                } else {
                    Alert.alert('Success', `PDF saved to ${fileUri}`);
                }

                setPdfModalVisible(false);
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
            setStartDate(selectedDate);
        }
    };

    const onEndDateChange = (event, selectedDate) => {
        setShowEndDatePicker(false);
        if (selectedDate) {
            setEndDate(selectedDate);
        }
    };

    const renderMonthCard = ({ item }) => (
        <Animatable.View
            animation="fadeInUp"
            duration={800}
            useNativeDriver
        >
            <TouchableOpacity onPress={() => handleMonthPress(item)}>
                <Card style={styles.monthCard}>
                    <Card.Content>
                        <View style={styles.monthHeader}>
                            <Text style={styles.monthName}>{item.monthName}</Text>
                            <Icon name="chevron-right" size={24} color="#6C63FF" />
                        </View>
                        <Divider style={styles.divider} />
                        <View style={styles.monthStats}>
                            <View style={styles.statItem}>
                                <Icon name="receipt" size={16} color="#AAA" />
                                <Text style={styles.statText}>{item.count} transactions</Text>
                            </View>
                            <View style={styles.statItem}>
                                {/* <Icon name="currency-inr" size={16} color="#AAA" /> */}
                                <Text style={styles.statText}>₹{item.total.toFixed(2)}</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        </Animatable.View>
    );

    const renderHisab = ({ item, index }) => (
        <Animatable.View
            animation="fadeInUp"
            duration={600}
            delay={index * 80}
            useNativeDriver
        >
            <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    {/* Top Row - Item and Price */}
                    <View style={styles.topRow}>
                        <View style={styles.titleContainer}>
                            <Icon
                                name={item.if_online ? "web" : "cash"}
                                size={18}
                                color={item.if_online ? "#3B82F6" : "#10B981"}
                                style={styles.icon}
                            />
                            <Text style={styles.itemName} numberOfLines={1}>
                                {item.item}
                            </Text>
                        </View>
                        <Text style={styles.itemPrice}>
                            ₹{parseFloat(item.price).toFixed(2)}
                        </Text>
                    </View>

                    {/* Description */}
                    {item.description && (
                        <Text style={styles.description} numberOfLines={2}>
                            {item.description}
                        </Text>
                    )}

                    {/* Bottom Row - Meta Info and Actions */}
                    <View style={styles.bottomRow}>
                        <View style={styles.metaContainer}>
                            <Icon name="calendar" size={12} color="#64748B" />
                            <Text style={styles.metaText}>
                                {format(parseISO(item.date), 'dd MMM')}
                            </Text>
                            {item.if_online && (
                                <>
                                    <View style={styles.dotSeparator} />
                                    <Icon name="web" size={12} color="#64748B" />
                                    <Text style={styles.metaText}>
                                        {item.platform}
                                    </Text>
                                </>
                            )}
                        </View>
                        <IconButton
                            icon="trash-can-outline"
                            iconColor="#64748B"
                            size={16}
                            onPress={() => deleteHisab(item.id)}
                            style={styles.deleteButton}
                        />
                    </View>
                </Card.Content>
            </Card>
        </Animatable.View>
    );

    const monthlySummary = getMonthlySummary();

    return (
        <View style={styles.container}>
            {/* Summary Card */}
            <Animatable.View
                animation="fadeInDown"
                duration={600}
                useNativeDriver
            >
                <Card style={styles.summaryCard}>
                    <Card.Content style={styles.summaryContent}>
                        <View style={styles.summaryHeader}>
                            <Text style={styles.personName}>{personName} ka hisab</Text>
                            <IconButton
                                icon="file-pdf-box"
                                iconColor="#FF5252"
                                size={24}
                                onPress={() => setPdfModalVisible(true)}
                            />
                        </View>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalAmount}>₹{totalAmount.toFixed(2)}</Text>
                        </View>
                    </Card.Content>
                </Card>
            </Animatable.View>

            {/* Back button when viewing transactions */}
            {viewMode === 'transactions' && (
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBackToMonths}
                >
                    <Icon name="arrow-left" size={20} color="#6C63FF" />
                    <Text style={styles.backButtonText}>Back to months</Text>
                </TouchableOpacity>
            )}

            {/* Month selection or transactions list */}
            {loading && hisabs.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator animating={true} color="#6C63FF" size="large" />
                    <Text style={styles.loadingText}>Loading transactions...</Text>
                </View>
            ) : viewMode === 'months' ? (
                <FlatList
                    data={monthlySummary}
                    keyExtractor={(item) => item.monthKey}
                    renderItem={renderMonthCard}
                    ListEmptyComponent={
                        <Animatable.View
                            animation="fadeIn"
                            duration={1000}
                            style={styles.emptyContainer}
                        >
                            <Icon name="receipt" size={60} color="#444" />
                            <Text style={styles.emptyText}>No transactions yet</Text>
                            <Text style={styles.emptySubtext}>Add a new hisab to get started</Text>
                        </Animatable.View>
                    }
                    contentContainerStyle={monthlySummary.length === 0 && styles.emptyList}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <FlatList
                    data={filteredHisabs}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderHisab}
                    ListEmptyComponent={
                        <Animatable.View
                            animation="fadeIn"
                            duration={1000}
                            style={styles.emptyContainer}
                        >
                            <Icon name="receipt" size={60} color="#444" />
                            <Text style={styles.emptyText}>No transactions for this month</Text>
                        </Animatable.View>
                    }
                    contentContainerStyle={filteredHisabs.length === 0 && styles.emptyList}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* PDF Export Modal */}
            <Portal>
                <Modal
                    visible={pdfModalVisible}
                    onDismiss={() => setPdfModalVisible(false)}
                    contentContainerStyle={styles.modalContainer}
                >
                    <Animatable.View
                        animation="fadeIn"
                        duration={300}
                        useNativeDriver
                    >
                        <Card style={styles.modalCard}>
                            <Card.Content>
                                <Text style={styles.modalTitle}>Export Transactions as PDF</Text>
                                <Divider style={styles.modalDivider} />

                                <Text style={styles.modalSubtitle}>Select Date Range</Text>

                                <View style={styles.datePickerContainer}>
                                    <Text style={styles.datePickerLabel}>From:</Text>
                                    <TouchableOpacity
                                        style={styles.dateInput}
                                        onPress={() => setShowStartDatePicker(true)}
                                    >
                                        <Text style={styles.dateInputText}>
                                            {format(startDate, 'dd MMM yyyy')}
                                        </Text>
                                        <Icon name="calendar" size={18} color="#6C63FF" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.datePickerContainer}>
                                    <Text style={styles.datePickerLabel}>To:</Text>
                                    <TouchableOpacity
                                        style={styles.dateInput}
                                        onPress={() => setShowEndDatePicker(true)}
                                    >
                                        <Text style={styles.dateInputText}>
                                            {format(endDate, 'dd MMM yyyy')}
                                        </Text>
                                        <Icon name="calendar" size={18} color="#6C63FF" />
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
                                    onPress={() => setPdfModalVisible(false)}
                                    style={styles.cancelButton}
                                    labelStyle={styles.cancelButtonLabel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    mode="contained"
                                    onPress={generatePDF}
                                    style={styles.generateButton}
                                    loading={pdfLoading}
                                    disabled={pdfLoading}
                                >
                                    {pdfLoading ? 'Generating...' : 'Generate PDF'}
                                </Button>
                            </Card.Actions>
                        </Card>
                    </Animatable.View>
                </Modal>
            </Portal>

            {/* Add FAB */}
            <Animatable.View
                animation="pulse"
                easing="ease-out"
                iterationCount="infinite"
                duration={2000}
            >
                <FAB
                    icon="plus"
                    style={styles.fab}
                    onPress={() => navigation.navigate('AddHisab', { personId, personName })}
                    color="white"
                    animated
                    customSize={60}
                    theme={{ colors: { accent: '#6C63FF' } }}
                />
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#121212',
    },
    summaryCard: {
        borderRadius: 12,
        backgroundColor: '#1E1E1E',
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    summaryContent: {
        padding: 20,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    personName: {
        color: '#AAA',
        fontSize: 16,
        marginBottom: 8,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 18,
        color: '#AAA',
    },
    totalAmount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6C63FF',
    },
    monthCard: {
        marginVertical: 8,
        borderRadius: 12,
        backgroundColor: '#1E1E1E',
        elevation: 2,
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    monthName: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
    },
    monthStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        color: '#AAA',
        fontSize: 14,
        marginLeft: 8,
    },
    card: {
        marginVertical: 8,
        borderRadius: 12,
        backgroundColor: '#1E1E1E',
        elevation: 2,
    },
    hisabHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginBottom: 12,
    },
    hisabTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemName: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
        marginLeft: 10,
    },
    itemPrice: {
        color: '#81C784',
        fontSize: 18,
        fontWeight: 'bold',
    },
    divider: {
        backgroundColor: '#333',
        marginBottom: 8,
    },
    description: {
        color: '#CCC',
        fontSize: 14,
        marginBottom: 8,
    },
    label: {
        color: '#AAA',
        fontWeight: '500',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateText: {
        color: '#AAA',
        fontSize: 12,
    },
    platformText: {
        color: '#AAA',
        fontSize: 12,
    },
    cardActions: {
        justifyContent: 'flex-end',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 2,
        backgroundColor: '#6C63FF',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        color: '#888',
        fontSize: 18,
        marginTop: 16,
        fontWeight: '500',
    },
    emptySubtext: {
        color: '#555',
        fontSize: 14,
        marginTop: 8,
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#AAA',
        marginTop: 16,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
    },
    backButtonText: {
        color: '#6C63FF',
        marginLeft: 8,
        fontSize: 16,
    },
    // Modal styles
    modalContainer: {
        padding: 20,
    },
    modalCard: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
    },
    modalTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    modalDivider: {
        backgroundColor: '#333',
        marginBottom: 16,
    },
    modalSubtitle: {
        color: '#AAA',
        fontSize: 16,
        marginBottom: 16,
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    datePickerLabel: {
        color: '#CCC',
        width: 50,
        fontSize: 16,
    },
    dateInput: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#444',
    },
    dateInputText: {
        color: 'white',
        fontSize: 16,
    },
    modalActions: {
        justifyContent: 'space-between',
        padding: 12,
    },
    cancelButton: {
        borderColor: '#555',
        borderWidth: 1,
    },
    cancelButtonLabel: {
        color: '#AAA',
    },
    generateButton: {
        backgroundColor: '#6C63FF',
    },

    card: {
        borderRadius: 12,
        marginVertical: 4,
        marginHorizontal: 8,
        backgroundColor: '#FFFFFF',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    cardContent: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    icon: {
        marginRight: 8,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1E293B',
        flexShrink: 1,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
    },
    description: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 8,
        lineHeight: 18,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        color: '#64748B',
        marginLeft: 4,
    },
    dotSeparator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#CBD5E1',
        marginHorizontal: 6,
    },
    deleteButton: {
        margin: -8,
        marginRight: -8,
    },
});