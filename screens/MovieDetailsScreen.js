import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = width * 1.4;

export default function MovieDetailsScreen({ route, navigation }) {
    const { movie } = route.params;

    const [showtimes, setShowtimes] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [cinemas, setCinemas] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        async function fetchAll() {
            try {
                const [showtimeRes, roomRes, cinemaRes, reservationRes] = await Promise.all([
                    axios.get('http://localhost:8000/api-client/showtimes'),
                    axios.get('http://localhost:8000/api-client/rooms'),
                    axios.get('http://localhost:8000/api-client/cinemas'),
                    axios.get('http://localhost:8000/api-client/reservations')
                ]);
                setShowtimes(showtimeRes.data.member || []);
                setRooms(roomRes.data.member || []);
                setCinemas(cinemaRes.data.member || []);
                setReservations(reservationRes.data.member || []);
            } catch (error) {
                console.error('Error loading data', error);
            } finally {
                setLoading(false);
            }
        }

        fetchAll();
    }, []);

    const formatTime = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const getCinemaFromRoom = (room) => {
        return cinemas.find(c => `/api-client/cinemas/${c.id}` === room?.cinema);
    };

    const handleBooking = (showtime) => {
        const room = showtime.room;
        if (!room || !room.name) {
            console.warn('Room missing or invalid in showtime:', showtime);
            return;
        }

        navigation.navigate('Booking', {
            showtimeId: showtime.id,
            roomName: room.name,
            userId: 4 // adapter selon utilisateur connecté
        });
    };
    const filteredShowtimes = showtimes.filter(s => s.movie === `/api-client/movies/${movie.id}`);

    const showtimesByCinema = {};
    filteredShowtimes.forEach(st => {
        const roomId = parseInt(st.room.split('/').pop());
        const room = rooms.find(r => r.id === roomId);
        const cinema = getCinemaFromRoom(room);
        if (!cinema || !room) return;
        const key = cinema.name;
        if (!showtimesByCinema[key]) {
            showtimesByCinema[key] = { cinema, showtimes: [] };
        }
        showtimesByCinema[key].showtimes.push({ ...st, room });
    });

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.heroContainer}>
                <Image
                    source={{ uri: `http://192.168.1.103:8000/pictures/hero/${movie.heroImage}` }}
                    style={styles.heroImage}
                />
                <LinearGradient
                    colors={['transparent', 'black']}
                    style={styles.heroGradient}
                />
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{movie.title}</Text>
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.iconButton}><Ionicons name="heart-outline" size={20} color="#fff" /></TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}><Ionicons name="star-outline" size={20} color="#fff" /></TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}><Ionicons name="share-outline" size={20} color="#fff" /></TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.details}>
                    {movie.duration} min · +{movie.ageRating} · {formatDate(movie.releaseDate)}
                </Text>

                <Text style={styles.meta}>
                    🎞 {movie.genre?.join(', ')} | 🌐 {movie.language?.join(', ')} | ⭐ {movie.reviews?.length > 0 ? movie.rating : 'Not rated yet'}
                </Text>

                <Text style={styles.description}>
                    {movie.description?.replace(/<\/?[^>]+(>|$)/g, '') || 'No description.'}
                </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateFilter}>
                {Array.from({ length: 7 }).map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() + i);
                    const dStr = d.toISOString().split('T')[0];
                    const label = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
                    return (
                        <TouchableOpacity key={dStr} style={[styles.dateButton, selectedDate === dStr && styles.dateButtonActive]} onPress={() => setSelectedDate(dStr)}>
                            <Text style={[styles.dateText, selectedDate === dStr && styles.dateTextActive]}>{label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.sessions}>
                <Text style={styles.sectionTitle}>Choose your cinema</Text>
                {Object.values(showtimesByCinema).map(({ cinema, showtimes }) => {
                    const filtered = showtimes.filter(s => s.date.startsWith(selectedDate));
                    if (!filtered.length) return null;

                    return (
                        <View key={cinema.id} style={styles.sessionGroup}>
                            <View style={styles.sessionHeader}>
                                <View>
                                    <Text style={styles.city}>{cinema.city}</Text>
                                    <Text style={styles.cinema}>{cinema.name}</Text>
                                </View>
                                <TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cinema.address)}`)}>
                                    <Text style={styles.mapLink}>View on map</Text>
                                </TouchableOpacity>
                            </View>

                            {filtered.map(st => (
                                <View key={st.id} style={styles.showtimeBox}>
                                    <View>
                                        <Text style={styles.time}>{formatTime(st.startTime)}</Text>
                                        <View style={styles.badgeRow}>
                                            {st.chosenLanguage && <View style={styles.badge}><Text style={styles.badgeText}>{st.chosenLanguage}</Text></View>}
                                            {st.room?.projectionEquipment?.map(eq => (
                                                <View key={eq} style={styles.badge}><Text style={styles.badgeText}>{eq}</Text></View>
                                            ))}
                                        </View>
                                        <Text style={styles.seats}>{st.availableSeats} seats available</Text>
                                    </View>
                                    <TouchableOpacity style={styles.bookButton} onPress={() => handleBooking(st)}>
                                        <Text style={styles.bookText}>Book Now</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}
    const styles = StyleSheet.create({
    container: { backgroundColor: '#000', flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    heroContainer: { position: 'relative', marginBottom: 24 },
    heroImage: { width: width, height: HERO_HEIGHT, resizeMode: 'cover' },
    heroGradient: { position: 'absolute', bottom: 0, height: 100, width: '100%' },
    backButton: { position: 'absolute', top: 50, left: 20, backgroundColor: '#000000aa', padding: 8, borderRadius: 8, zIndex: 10 },
    content: { paddingHorizontal: 20, paddingBottom: 20 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#fff', flex: 1, marginRight: 10 },
    actions: { flexDirection: 'row', marginTop: 2 },
    iconButton: { backgroundColor: '#222', padding: 8, marginLeft: 6, borderRadius: 8 },
    details: { fontSize: 14, color: '#ccc', marginBottom: 8 },
    meta: { fontSize: 14, color: '#aaa', marginBottom: 24 },
    description: { fontSize: 16, lineHeight: 24, color: '#eee' },
    dateFilter: { flexDirection: 'row', marginHorizontal: 20, marginTop: 8, marginBottom: 24 },
    dateButton: { backgroundColor: '#222', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 10 },
    dateButtonActive: { backgroundColor: '#1e90ff' },
    dateText: { color: '#ccc', fontSize: 14 },
    dateTextActive: { color: '#fff', fontWeight: '600' },
    sessions: { paddingHorizontal: 20, paddingBottom: 40 },
    sectionTitle: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 24 },
    sessionGroup: { marginBottom: 32 },
    sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    city: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
    cinema: { fontSize: 14, color: '#ccc' },
    mapLink: { color: '#1e90ff', fontSize: 14 },
    showtimeBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111', borderRadius: 10, padding: 16, marginBottom: 12 },
    time: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 4 },
    badgeRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
    badge: { backgroundColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginRight: 6, marginBottom: 4 },
    badgeText: { color: '#fff', fontSize: 12 },
    seats: { color: '#aaa', fontSize: 14 },
    bookButton: { backgroundColor: '#1e90ff', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
    bookText: { color: '#fff', fontWeight: '600' }
});
