import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../config/firebase"; // Import Firebase auth & Firestore
import { doc, getDoc, setDoc } from "firebase/firestore";

// Define user type (including Firestore fields)
interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    lastLogin: string | null;
}

// Define context type
interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    logout: () => Promise<void>;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userRef = doc(db, "users", firebaseUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    // User exists in Firestore, merge Firestore and Auth data
                    const userData = userSnap.data();
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: userData.displayName || firebaseUser.displayName,
                        photoURL: userData.photoURL || firebaseUser.photoURL,
                        lastLogin: userData.lastLogin || null,
                    });

                    // Update lastLogin timestamp in Firestore
                    await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
                } else {
                    // User not found in Firestore → Create a new user document
                    const newUser: AuthUser = {
                        displayName: firebaseUser.displayName || "New User",
                        email: firebaseUser.email,
                        photoURL: firebaseUser.photoURL || "",
                        uid: firebaseUser.uid,
                        lastLogin: new Date().toISOString(),
                    };
                    await setDoc(userRef, newUser);
                    setUser(newUser);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
