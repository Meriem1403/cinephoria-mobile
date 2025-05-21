import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform
} from 'react-native';
import axios from 'axios';

export default function SelectFormulaScreen({ route, navigation }) {
    const { showtimeId, seats } = route.params;

    const [loading, setLoading] = useState(true);
    const [priceStandard, setPriceStandard] = useState(0);
    const [useSpecial, setUseSpecial] = useState(false);
    const [specialPrices, setSpecialPrices] = useState([]);
    const [specialCounts, setSpecialCounts] = useState([]);
    const [standardCount, setStandardCount] = useState(seats.length);

    useEffect(() => {
        async function fetchShowtime() {
            try {
                const res = await axios.get(`http://192.168.1.103:8000/api-client/showtimes/${showtimeId}`);
                const showtime = res.data;
                setPriceStandard(showtime.price / 100);
                setUseSpecial(showtime.specialPrice);
                setSpecialPrices(showtime.specialPrices || []);
                setSpecialCounts(new Array(showtime.specialPrices?.length || 0).fill(0));
            } catch (err) {
                console.error('Error loading showtime', err);
                Alert.alert('Error', 'Could not load pricing info.');
            } finally {
                setLoading(false);
            }
        }

        fetchShowtime();
    }, []);

    const increment = (type, index = null) => {
        if (totalCount() >= seats.length) return;

        if (type === 'standard') {
            setStandardCount(prev => prev + 1);
        } else {
            const copy = [...specialCounts];
            copy[index]++;
            setSpecialCounts(copy);
            setStandardCount(seats.length - copy.reduce((a, b) => a + b, 0));
        }
    };

    const decrement = (type, index = null) => {
        if (type === 'standard') {
            setStandardCount(prev => Math.max(0, prev - 1));
        } else {
            const copy = [...specialCounts];
            copy[index] = Math.max(0, copy[index] - 1);
            setSpecialCounts(copy);
            setStandardCount(seats.length - copy.reduce((a, b) => a + b, 0));
        }
    };

    const totalCount = () => {
        return useSpecial ? standardCount + specialCounts.reduce((a, b) => a + b, 0) : standardCount;
    };

    const totalPrice = () => {
        let total = standardCount * priceStandard;
        specialPrices.forEach((sp, i) => {
            total += specialCounts[i] * sp.price;
        });
        return total.toFixed(2);
    };

    const handleSubmit = async () => {
        const form = new FormData();
        seats.forEach(id => form.append('seats[]', id.toString()));

        if (useSpecial) {
            specialCounts.forEach((count, i) => {
                form.append(`specialCount[${i}]`, count.toString());
            });
        } else {
            form.append('standardCount', standardCount.toString());
        }

        try {
            const res = await fetch(`http://192.168.1.103:8000/booking/formulas/${showtimeId}`, {
                method: 'POST',
                headers: { Accept: 'text/html' },
                body: form
            });

            const html = await res.text();
            console.log('✔️ Booking complete:', html);

            // ✅ Redirection vers page de confirmation
            navigation.navigate('BookingConfirmation', {
                showtimeId,
                total: totalPrice(),
                seats
            });
        } catch (err) {
            console.error('Reservation error', err);
            Alert.alert('Error', 'Could not complete booking.');
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.back}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Select your rates</Text>

            <View style={styles.formulaGroup}>
                <Text style={styles.label}>Standard – {priceStandard.toFixed(2)} €</Text>
                <View style={styles.counterRow}>
                    <TouchableOpacity onPress={() => decrement('standard')} style={styles.counterBtn}>
                        <Text style={styles.counterText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.counterVal}>{standardCount}</Text>
                    <TouchableOpacity onPress={() => increment('standard')} style={styles.counterBtn}>
                        <Text style={styles.counterText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {useSpecial &&
                specialPrices.map((sp, i) => (
                    <View key={i} style={styles.formulaGroup}>
                        <Text style={styles.label}>
                            {sp.label} ({sp.note}) – {sp.price.toFixed(2)} €
                        </Text>
                        <View style={styles.counterRow}>
                            <TouchableOpacity onPress={() => decrement('special', i)} style={styles.counterBtn}>
                                <Text style={styles.counterText}>−</Text>
                            </TouchableOpacity>
                            <Text style={styles.counterVal}>{specialCounts[i]}</Text>
                            <TouchableOpacity onPress={() => increment('special', i)} style={styles.counterBtn}>
                                <Text style={styles.counterText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

            <Text style={styles.total}>Total: {totalPrice()} €</Text>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Book Now</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 90 : 70
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    },
    back: {
        color: '#1e90ff',
        fontSize: 16,
        marginBottom: 16
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 24,
        textAlign: 'center'
    },
    formulaGroup: {
        marginBottom: 24
    },
    label: {
        color: '#ccc',
        fontSize: 16,
        marginBottom: 8
    },
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    counterBtn: {
        backgroundColor: '#333',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 6
    },
    counterText: {
        fontSize: 20,
        color: '#fff'
    },
    counterVal: {
        fontSize: 18,
        color: '#fff',
        marginHorizontal: 20,
        minWidth: 32,
        textAlign: 'center'
    },
    total: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e90ff',
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 12
    },
    button: {
        backgroundColor: '#1e90ff',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
});
