// HomeScreen.js
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
    StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = 'http://192.168.1.103:8000/api-client/movies';
const POSTER_BASE = 'http://192.168.1.103:8000/pictures/films/';
const HERO_BASE = 'http://192.168.1.103:8000/pictures/hero/';
const LOGO_URL = 'http://192.168.1.103:8000/pictures/logo.png';

const { width, height } = Dimensions.get('window');
const HERO_HEIGHT = height * 0.48;
const genres = ['drama', 'action', 'fantasy', 'animation'];

export default function HomeScreen({ navigation }) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef();
    const heroScrollRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);
    const autoplayInterval = useRef();

    useEffect(() => {
        axios.get(API_URL)
            .then(res => {
                setMovies(res.data.member || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error API :', err);
                setLoading(false);
            });
    }, []);

    const heroImages = movies
        .filter(m => m.heroImage)
        .map(m => HERO_BASE + m.heroImage)
        .slice(0, 5);

    useEffect(() => {
        if (heroImages.length === 0) return;

        autoplayInterval.current = setInterval(() => {
            setCurrentIndex(prevIndex => {
                const nextIndex = (prevIndex + 1) % heroImages.length;
                heroScrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
                return nextIndex;
            });
        }, 5000);

        return () => clearInterval(autoplayInterval.current);
    }, [heroImages]);

    const renderMovieCard = (movie) => (
        <TouchableOpacity
            key={movie.id}
            style={styles.movieCard}
            onPress={() => navigation.navigate('MovieDetails', { movie })}
        >
            <Image
                source={{ uri: POSTER_BASE + movie.posterUrl }}
                style={styles.poster}
            />
            <Text style={styles.movieTitle}>{movie.title}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <>
            <StatusBar barStyle="light-content" />

            <ScrollView ref={scrollRef} style={styles.container}>
                {/* HERO */}
                <View style={styles.heroWrapper}>
                    <ScrollView
                        ref={heroScrollRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        style={styles.heroCarousel}
                    >
                        {heroImages.map((uri, index) => (
                            <Image
                                key={index}
                                source={{ uri }}
                                style={styles.heroImage}
                            />
                        ))}
                    </ScrollView>

                    {/* Dégradé bas */}
                    <LinearGradient
                        colors={['transparent', 'black']}
                        style={styles.heroGradient}
                    />

                    {/* Logo avec overlay */}
                    <View style={styles.logoContainer}>
                        <View style={styles.logoOverlay}>
                            <Image source={{ uri: LOGO_URL }} style={styles.logo} />
                        </View>
                    </View>

                    {/* Loupe stylisée */}
                    <TouchableOpacity style={styles.searchButton} onPress={() => console.log('Recherche')}>
                        <View style={styles.searchCircle}>
                            <Ionicons name="search" size={20} color="white" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* MOVIE SECTIONS */}
                <View style={styles.movieSection}>
                    <Text style={styles.sectionTitle}>Movie at the cinema</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        {movies.filter(m => m.atCinema).map(renderMovieCard)}
                    </ScrollView>

                    {genres.map(genre => {
                        const genreMovies = movies.filter(m => m.genre.includes(genre));
                        if (genreMovies.length === 0) return null;

                        return (
                            <View key={genre}>
                                <Text style={styles.sectionTitle}>
                                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                                </Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                                    {genreMovies.map(renderMovieCard)}
                                </ScrollView>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        flex: 1
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    },
    heroWrapper: {
        position: 'relative'
    },
    heroCarousel: {
        height: HERO_HEIGHT,
        width: width
    },
    heroImage: {
        width: width,
        height: HERO_HEIGHT,
        resizeMode: 'cover'
    },
    heroGradient: {
        position: 'absolute',
        bottom: 0,
        height: 100,
        width: '100%',
        zIndex: 10
    },
    logoContainer: {
        position: 'absolute',
        top: 64,
        left: 20,
        zIndex: 20
    },
    logoOverlay: {
        backgroundColor: '#000000aa',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        height: 44,
        justifyContent: 'center'
    },
    logo: {
        width: 150,
        height: 50,
        resizeMode: 'contain'
    },
    searchButton: {
        position: 'absolute',
        top: 64,
        right: 20,
        zIndex: 20
    },
    searchCircle: {
        backgroundColor: '#000000aa',
        width: 44,
        height: 44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    movieSection: {
        paddingHorizontal: 12,
        paddingTop: 36,
        paddingBottom: 24
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginVertical: 16
    },
    horizontalScroll: {
        marginBottom: 10
    },
    movieCard: {
        width: 120,
        marginRight: 12,
        alignItems: 'center'
    },
    poster: {
        width: 110,
        height: 160,
        borderRadius: 8
    },
    movieTitle: {
        marginTop: 6,
        fontSize: 14,
        color: '#fff',
        textAlign: 'center'
    }
});
