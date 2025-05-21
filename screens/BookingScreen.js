import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Alert,
    Platform
} from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');

export default function BookingScreen({ route, navigation }) {
    const { showtimeId, roomName } = route.params;

    const [seats, setSeats] = useState([]);
    const [groupedSeats, setGroupedSeats] = useState({});
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchSeats() {
            try {
                const resRooms = await axios.get('http://192.168.1.103:8000/api-client/rooms');
                const allRooms = resRooms.data.member || [];
                const room = allRooms.find(r => r.name === roomName);
                if (!room) throw new Error(`Room "${roomName}" not found`);

                const resSeats = await axios.get(
                    `http://192.168.1.103:8000/api-client/seats?room.id=${room.id}&pagination=false`
                );
                const seatList = resSeats.data.member || [];

                const grouped = {};
                seatList.forEach(seat => {
                    if (!grouped[seat.rowLabel]) grouped[seat.rowLabel] = [];
                    grouped[seat.rowLabel].push(seat);
                });

                Object.values(grouped).forEach(row =>
                    row.sort((a, b) => a.seatNumber - b.seatNumber)
                );

                setSeats(seatList);
                setGroupedSeats(grouped);
            } catch (err) {
                console.error('Seat loading error:', err);
                Alert.alert('Error', 'Could not load seat map.');
            } finally {
                setLoading(false);
            }
        }

        fetchSeats();
    }, [roomName]);

    const toggleSeat = (seatId) => {
        setSelected(prev =>
            prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
        );
    };

    const isSelected = (id) => selected.includes(id);

    const handleContinue = () => {
        if (selected.length === 0) return;

        navigation.navigate('SelectFormula', {
            showtimeId,
            seats: selected
        });
    };
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    const statusStyle = (seat) => {
        if (seat.isBroken) return styles.broken;
        if (seat.isReserved || seat.currentlyReserved) return styles.reserved;
        if (seat.isPMR) return styles.pmr;
        return styles.standard;
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Select your seats</Text>
            </View>

            <View style={styles.mapContainer}>
                <View style={styles.grid}>
                    {Object.keys(groupedSeats).sort().map(row => (
                        <View key={row} style={[styles.row, { marginTop: 20 }]}>
                            <View style={styles.seatRow}>
                                {groupedSeats[row].map(seat => {
                                    const disabled = seat.isReserved || seat.isBroken || seat.currentlyReserved;
                                    return (
                                        <TouchableOpacity
                                            key={seat.id}
                                            style={[
                                                styles.seat,
                                                statusStyle(seat),
                                                isSelected(seat.id) && styles.selected,
                                                disabled && styles.disabled
                                            ]}
                                            disabled={disabled}
                                            onPress={() => toggleSeat(seat.id)}
                                        >
                                            <Text style={styles.seatText}>{seat.label}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.legend}>
                    <Legend color={styles.standard.backgroundColor} label="Standard" />
                    <Legend color={styles.pmr.backgroundColor} label="PMR" />
                    <Legend color={styles.reserved.backgroundColor} label="Reserved" />
                    <Legend color={styles.broken.backgroundColor} label="Broken" />
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.counter}>{selected.length} selected</Text>
                <TouchableOpacity
                    style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={selected.length === 0 || submitting}
                >
                    <Text style={styles.buttonText}>
                        {submitting ? 'Submitting...' : 'Continue'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

function Legend({ color, label }) {
    return (
        <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: color }]} />
            <Text style={styles.legendLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        flex: 1,
        padding: 16
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    },
    headerRow: {
        marginTop: Platform.OS === 'ios' ? 70 : 50,
        marginBottom: 32,
        alignItems: 'center'
    },
    backText: {
        color: '#1e90ff',
        fontSize: 16,
        marginBottom: 8,
        alignSelf: 'flex-start'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
        textAlign: 'center'
    },
    mapContainer: {
        alignItems: 'center',
        marginBottom: 32
    },
    grid: {
        width: '100%',
        maxWidth: 360
    },
    row: {
        marginBottom: 12
    },
    seatRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 6
    },
    seat: {
        width: 44,
        height: 44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 4
    },
    seatText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13
    },
    standard: { backgroundColor: '#2ecc71' },
    pmr: { backgroundColor: '#3498db' },
    reserved: { backgroundColor: '#bdc3c7' },
    broken: { backgroundColor: '#e74c3c' },
    selected: { borderWidth: 2, borderColor: '#1e90ff' },
    disabled: { opacity: 0.5 },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: 16,
        flexWrap: 'wrap'
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    legendColor: {
        width: 18,
        height: 18,
        borderRadius: 4
    },
    legendLabel: {
        color: '#ccc',
        fontSize: 14
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    counter: {
        color: '#fff',
        fontSize: 16
    },
    button: {
        backgroundColor: '#1e90ff',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8
    },
    buttonDisabled: {
        backgroundColor: '#555'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    }
});
