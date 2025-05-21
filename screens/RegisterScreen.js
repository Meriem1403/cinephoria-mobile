import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ImageBackground,
    StyleSheet,
    Alert,
    Dimensions,
} from 'react-native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const res = await axios.post('http://192.168.1.103:8000/api-client/users', {
                email,
                fullName,
                password
            });
            Alert.alert('Success', 'Account created successfully!');
            navigation.navigate('Login');
        } catch (err) {
            console.error('Registration error:', err);
            Alert.alert('Error', 'Registration failed');
        }
    };

    return (
        <ImageBackground
            source={require('../assets/aa2.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.title}>Register</Text>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <TextInput
                            placeholder="Full Name"
                            placeholderTextColor="#aaa"
                            style={styles.input}
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#aaa"
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#aaa"
                            secureTextEntry
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                        <Text style={styles.registerText}>Create Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginRedirect}>
                            Already have an account? <Text style={styles.link}>Log in</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
    },
    overlay: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 80,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    logo: {
        width: 200,
        height: 60,
        alignSelf: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        marginBottom: 12,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
    },
    registerButton: {
        backgroundColor: '#1e90ff',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    registerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginRedirect: {
        marginTop: 10,
        fontSize: 13,
        color: '#ccc',
        textAlign: 'center',
    },
    link: {
        color: '#1e90ff',
        fontWeight: 'bold',
    }
});
