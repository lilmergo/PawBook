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

interface CreateCommentData {
    content: string
}

export const CreateComment = ({ refreshComments, postId, handleCommentMode }: { refreshComments: () => void, postId:string, handleCommentMode: ()=>void}) => {
    const [user] = useAuthState(auth);
    const [commentContent, setCommentContent] = useState("");
    const schema = yup.object().shape({
        content: yup.string().required("Can't be empty.")
    });

    const { register, handleSubmit, formState: { errors } } = useForm<CreateCommentData>({
        resolver: yupResolver(schema)
    })


    const postsRef = collection(db, "comments");
    const onCreateComment = async (data: CreateCommentData) => {
        await addDoc(postsRef, {
            //content: data.content,
            ...data,
            username: user?.displayName,
            userId: user?.uid,
            postId: postId,
            timeStamp: new Date
        });
        setCommentContent('');
        refreshComments();
        handleCommentMode();
    };

    return (
        <Card sx={{ maxWidth: 500, m: "auto", my: 4 }}>
            <CardContent>
                <Grid2 container spacing={2}>
                    <Grid2>
                        <Avatar src={user?.photoURL || ""} />
                    </Grid2>
                    <Grid2 size="grow">
                    <form onSubmit={handleSubmit(onCreateComment)}>
                        <TextField {...register("content")} fullWidth placeholder='Wuff wuff!' value={commentContent} onChange={(e)=>setCommentContent(e.target.value)}/>
                        <p style={{ color: "red" }}>{errors.content?.message}</p>
                        <input type='submit' value={'Post'} />
                    </form>
                    </Grid2>
                </Grid2>
            </CardContent>
        </Card>
    );

};