import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { api } from '../utils/api';
import { parseISO, format, startOfMonth, endOfMonth } from 'date-fns';
import SummaryCard from '../components/SummaryCard';
import MonthCard from '../components/MonthCard';
import HisabCard from '../components/HisabCard';
import PDFExportModal from '../components/PDFExportModal';
import AddFAB from '../components/AddFAB';
import BackButton from '../components/BackButton';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ViewHisabsScreen({ route, navigation }) {
    const { personId, personName } = route.params;
    const [hisabs, setHisabs] = useState([]);
    const [filteredHisabs, setFilteredHisabs] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [monthlyTotalAmount, setMonthlyTotalAmount] = useState(0); // New state for monthly total
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('months');
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [pdfModalVisible, setPdfModalVisible] = useState(false);

    const fetchHisabs = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/persons/${personId}/hisabs/`);
            const sortedHisabs = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setHisabs(sortedHisabs);

            setTotalAmount(sortedHisabs.reduce((sum, hisab) => sum + parseFloat(hisab.price || 0), 0));
        } catch (error) {
            console.error("Failed to fetch hisabs:", error);
            Alert.alert('❌ Error', 'Failed to load hisabs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchHisabs);
        fetchHisabs();
        return unsubscribe;
    }, [navigation, personId]);

    useEffect(() => {
        if (viewMode === 'transactions' && selectedMonth) {
            const monthHisabs = hisabs
                .filter(hisab => {
                    const hisabDate = parseISO(hisab.date);
                    return hisabDate >= selectedMonth.startDate && hisabDate <= selectedMonth.endDate;
                })
                .sort((a, b) => b.date - a.date);

            setFilteredHisabs(monthHisabs);

            // Calculate monthly total amount
            const monthlyTotal = monthHisabs.reduce((sum, hisab) => sum + parseFloat(hisab.price || 0), 0);
            setMonthlyTotalAmount(monthlyTotal);
        }
    }, [hisabs, selectedMonth, viewMode]);

    const getMonthlySummary = () => {
        if (hisabs.length === 0) return [];

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

        return Object.values(monthMap).sort((a, b) => b.startDate - a.startDate);
    };

    const handleMonthPress = (month) => {
        setSelectedMonth(month);
        setViewMode('transactions');
    };

    const handleBackToMonths = () => {
        setViewMode('months');
        setSelectedMonth(null);
        setMonthlyTotalAmount(0); // Reset monthly total when going back
    };

    const deleteHisab = async (hisabId) => {
        Alert.alert(
            '🗑️ Uda de moti ji?',
            'Are you sure you want to delete this transaction?',
            [
                { text: 'Nhi nhi', style: 'cancel' },
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

    const monthlySummary = getMonthlySummary();

    return (
        <View style={styles.container}>
            <SummaryCard
                personName={personName}
                totalAmount={viewMode === 'months' ? totalAmount : monthlyTotalAmount}
                onPDFPress={() => setPdfModalVisible(true)}
                subtitle={viewMode === 'transactions' ? selectedMonth?.monthName : 'Total Amount'}
            />

            {viewMode === 'transactions' && (
                <BackButton onPress={handleBackToMonths} />
            )}

            {loading ? (
                <LoadingSpinner text="Loading hisabs..." />
            ) : viewMode === 'months' ? (
                <FlatList
                    data={monthlySummary}
                    keyExtractor={(item) => item.monthKey}
                    renderItem={({ item }) => (
                        <MonthCard month={item} onPress={() => handleMonthPress(item)} />
                    )}
                    ListEmptyComponent={
                        <EmptyState
                            icon="receipt"
                            title="No transactions yet"
                            subtitle="Add a new hisab to get started"
                        />
                    }
                    contentContainerStyle={monthlySummary.length === 0 && styles.emptyList}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <FlatList
                    data={filteredHisabs}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        <HisabCard
                            hisab={item}
                            index={index}
                            onPress={() => navigation.navigate('AddHisab', {
                                hisab: item,
                                personId: item.person,
                                personName,
                                mode: 'edit'
                            })}
                            onDelete={() => deleteHisab(item.id)}
                        />
                    )}
                    ListEmptyComponent={
                        <EmptyState
                            icon="receipt"
                            title="No transactions for this month"
                        />
                    }
                    contentContainerStyle={filteredHisabs.length === 0 && styles.emptyList}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <PDFExportModal
                visible={pdfModalVisible}
                onDismiss={() => setPdfModalVisible(false)}
                hisabs={hisabs}
                personName={personName}
            />

            <AddFAB
                icon="note-plus"
                onPress={() => navigation.navigate('AddHisab', {
                    personId,
                    personName,
                    onGoBack: fetchHisabs
                })}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#000000', // Pure black background
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
    },
});