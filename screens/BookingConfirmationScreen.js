import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
    Linking
} from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');

export default function BookingConfirmationScreen({ route }) {
    const { showtimeId, seats, total } = route.params;

    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);

    const reservationId = 190456; // 🧪 temporaire, peut être transmis dynamiquement

    useEffect(() => {
        async function fetchReservation() {
            try {
                const res = await axios.get(`http://localhost:8000/api-client/showtimes/${showtimeId}`);
                setReservation(res.data);
            } catch (err) {
                console.error('Error loading confirmation', err);
            } finally {
                setLoading(false);
            }
        }

        fetchReservation();
    }, [showtimeId]);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString();
    };

    const formatTime = (timeStr) => {
        const d = new Date(timeStr);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const downloadEticket = () => {
        Linking.openURL(`http://192.168.1.103:8000/booking/confirmation/${reservationId}/download`);
    };
    if (loading || !reservation) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    const {
        movie,
        room,
        date,
        startTime,
        endTime,
        chosenLanguage
    } = reservation;

    const hero = movie?.heroImage || '';
    const roomName = room?.name || '';
    const city = room?.cinema?.city || '';
    const movieTitle = movie?.title || '';
    const orderCode = reservationId;

    return (
        <ScrollView style={styles.container}>
            {/* Banner */}
            <Image
                source={{ uri: `http://192.168.1.103:8000/pictures/hero/${hero}` }}
                style={styles.banner}
            />

            <View style={styles.content}>
                <Text style={styles.title}>Thanks for your purchase</Text>
                <Text style={styles.subtitle}>We appreciate your order.</Text>

                <View style={styles.ticket}>
                    <View style={styles.ticketHeader}>
                        <Text style={styles.movieTitle}>{movieTitle}</Text>
                        <Text style={styles.eticket}>e-ticket</Text>
                    </View>

                    <View style={styles.row}>
                        <Label title="Date" value={formatDate(date)} />
                        <Label title="Seats" value={seats.join(', ')} />
                    </View>
                    <View style={styles.row}>
                        <Label title="Location" value={city} />
                        <Label title="Time" value={`${formatTime(startTime)} – ${formatTime(endTime)}`} />
                    </View>
                    <View style={styles.row}>
                        <Label title="Room" value={roomName} />
                        <Label title="Order" value={orderCode} />
                    </View>
                    <Label title="Total" value={`${total} €`} center />

                    <Image
                        source={{ uri: `http://192.168.1.103:8000/qr/${seats[0]}|${orderCode}` }}
                        style={styles.qr}
                    />

                    <Image
                        source={{ uri: 'http://192.168.1.103:8000/pictures/logo.png' }}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <TouchableOpacity style={styles.download} onPress={downloadEticket}>
                    <Text style={styles.downloadText}>Download E-Ticket</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

function Label({ title, value, center }) {
    return (
        <View style={[styles.labelGroup, center && { alignItems: 'center' }]}>
            <Text style={styles.labelTitle}>{title}</Text>
            <Text style={styles.labelValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    },
    banner: {
        width: '100%',
        height: 200
    },
    content: {
        padding: 20,
        alignItems: 'center'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 12
    },
    subtitle: {
        color: '#ccc',
        marginBottom: 20
    },
    ticket: {
        backgroundColor: '#f3f4f6',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        marginBottom: 24
    },
    ticketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    movieTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#111'
    },
    eticket: {
        color: '#b91c1c',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 12
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    labelGroup: {
        flex: 1
    },
    labelTitle: {
        fontSize: 10,
        color: '#888',
        textTransform: 'uppercase'
    },
    labelValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111'
    },
    qr: {
        width: 140,
        height: 140,
        alignSelf: 'center',
        marginTop: 16
    },
    logo: {
        height: 30,
        marginTop: 12,
        alignSelf: 'center'
    },
    download: {
        backgroundColor: '#333',
        paddingVertical: 14,
        paddingHorizontal: 36,
        borderRadius: 30
    },
    downloadText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
});
