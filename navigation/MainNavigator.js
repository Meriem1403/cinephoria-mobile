import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import CinemasScreen from '../screens/CinemasScreen';
import SearchScreen from '../screens/SearchScreen';
import TicketsScreen from '../screens/TicketsScreen';
import AccountScreen from '../screens/AccountScreen';
import BookingScreen from '../screens/BookingScreen';
import SelectFormulaScreen from '../screens/SelectFormulaScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';

// 1. Create Stack and Tab navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 2. Wrap all Tabs inside a custom Tab Navigator
function TabScreens() {
    return (
        <Tab.Navigator
            id="main"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#ffffff',
                tabBarInactiveTintColor: '#999999',
                tabBarStyle: {
                    backgroundColor: '#1a1a1a',
                    borderTopWidth: 0,
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Movies':
                            iconName = 'film-outline';
                            break;
                        case 'Cinemas':
                            iconName = 'location-outline';
                            break;
                        case 'Search':
                            iconName = 'search-outline';
                            break;
                        case 'Tickets':
                            iconName = 'ticket-outline';
                            break;
                        case 'Account':
                            iconName = 'person-outline';
                            break;
                        default:
                            iconName = 'ellipse-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Movies" component={HomeScreen} />
            <Tab.Screen name="Cinemas" component={CinemasScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Tickets" component={TicketsScreen} />
            <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
    );
}

// 3. Export global navigator with Stack
export default function MainNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* Bottom Tabs inside the stack */}
                <Stack.Screen name="Tabs" component={TabScreens} />

                {/* Extra screen accessible from anywhere */}
                <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
                <Stack.Screen name="Booking" component={BookingScreen} />
                <Stack.Screen name="SelectFormula" component={SelectFormulaScreen} />
                <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
