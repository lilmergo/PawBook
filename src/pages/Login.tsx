import { auth, db, provider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { doc, setDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export const Login = () => {
    const navigate = useNavigate();
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            navigate('/');
            if (auth.currentUser) {
                try {
                    // Save user data to Firestore
                    await setDoc(doc(db, "users", user.uid), {
                        userId: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        email: user.email,
                        lastLogin: new Date().toISOString(), // Optionally track last login
                    }, { merge: true }); // Merge to avoid overwriting existing fields        

                } catch (e) {
                    console.error("Error saving user information to collection:", e);
                }
            }

        } catch (error) {
            console.error("Error signing in with Google:", error);
        }

    };

    return (
        <Box sx={{ bgcolor: '#1A2824', height: '100vh' }} display="flex">
            <Card sx={{ width: 600, m: "auto" }}>
                <CardContent >
                    <Typography variant='h1' color='secondary' sx={{ m: '10px' }}>
                        PawBook
                    </Typography>
                    <Typography variant="body1" color="text.primary" sx={{ m: '10px' }}>
                        Connect with new paw pals today!
                    </Typography>
                    <Button
                        variant="contained"
                        color={"primary"}
                        onClick={signInWithGoogle}
                        sx={{ m: '5px' }}
                    >
                        Google Sign In
                    </Button>
                </CardContent>
            </Card>
        </Box>

    )
}