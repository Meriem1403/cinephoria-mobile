// src/screens/LoginScreen.js
import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Image,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import API from '../api'; // Import corrigé
import { AuthContext } from '../security/AuthProvider';

export default function LoginScreen() {
    const navigation = useNavigation();
    const { login: signIn } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const res = await API.post('/api/login', { email, password }); // Appel corrigé
            const token = res.data.token;
            console.log('Token reçu:', token);
            signIn(token);
        } catch (err) {
            console.error('Erreur de connexion:', err);
            Alert.alert('Erreur', 'Identifiants invalides');
        }
    };

    return (
        <ImageBackground source={require('../assets/aa2.jpg')} style={styles.background}>
            <View style={styles.overlay}>
                <View style={styles.innerContainer}>
                    <Image source={require('../assets/logo.png')} style={styles.logo} />

                    <View style={styles.form}>
                        <Text style={styles.title}>Log In</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Your email"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoComplete="email"
                        />
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.subLink}>
                                You don’t have an account? <Text style={styles.link}>Click here</Text>
                            </Text>
                        </TouchableOpacity>

                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Log In</Text>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Text style={styles.forgot}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '85%',
    },
    logo: {
        width: 220,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 40,
    },
    form: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#1e90ff',
        paddingVertical: 12,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    forgot: {
        color: '#1e90ff',
        fontSize: 14,
        marginTop: 10,
    },
    subLink: {
        color: '#ccc',
        fontSize: 12,
        marginBottom: 16,
    },
    link: {
        color: '#1e90ff',
        fontWeight: 'bold',
    },
});
