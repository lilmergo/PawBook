import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import TextField from '@mui/material/TextField';
import { Avatar, Card, CardContent, Grid2 } from '@mui/material';
import { useState } from 'react';

interface CreateFormData {
    content: string
}

export const CreateForm = ({ refreshPosts }: { refreshPosts: () => void }) => {
    const [user] = useAuthState(auth);
    const [postContent, setPostContent] = useState("");
    const schema = yup.object().shape({
        content: yup.string().required("Can't be empty.")
    });

    const { register, handleSubmit, formState: { errors } } = useForm<CreateFormData>({
        resolver: yupResolver(schema)
    })


    const postsRef = collection(db, "posts");
    const onCreatePost = async (data: CreateFormData) => {
        await addDoc(postsRef, {
            ...data,
            username: user?.displayName,
            userId: user?.uid,
            timeStamp: new Date
        });
        setPostContent('');
        refreshPosts();
    };

    return (
        <Card sx={{ maxWidth: 500, m: "auto", my: 4 }}>
            <CardContent>
                <Grid2 container spacing={2}>
                    <Grid2>
                        <Avatar src={user?.photoURL || ""} />
                    </Grid2>
                    <Grid2 size="grow">
                    <form onSubmit={handleSubmit(onCreatePost)}>
                        <TextField {...register("content")} fullWidth placeholder='Wuff wuff!' value={postContent} onChange={(e)=>setPostContent(e.target.value)}/>
                        <p style={{ color: "red" }}>{errors.content?.message}</p>
                        <input type='submit' value={'Post'} />
                    </form>
                    </Grid2>
                </Grid2>
            </CardContent>
        </Card>
    );

};