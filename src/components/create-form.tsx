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
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface CreateFormData {
    content: string,
    attachment?: FileList,
}

interface Props {
    type: string;
    refreshElements: () => Promise<void>;
    postId?: string;
    handleCommentMode?: () => void;
}

const buttonStyle =
{
    borderRadius: '3px',
    fontWeight: 600,
    backgroundColor: '#748B75',
    color: '#ffffff',
    borderStyle: 'none',
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
}



export const CreateForm = (props: Props) => {
    const { type, postId, refreshElements, handleCommentMode } = props;
    const [user] = useAuthState(auth);
    const [cardContent, setCardContent] = useState("");
    const schema = yup.object().shape({
        content: yup.string().required("Can't be empty."),
        attachment: yup.mixed()
    });

    const { register, handleSubmit, formState: { errors } } = useForm<CreateFormData>({
        resolver: yupResolver(schema)
    });

    const postsRef = collection(db, type == "post" ? "posts" : "comments");

    const docConfig = {
        username: user?.displayName || null,
        postId: postId || null,
        userId: user?.uid || null,
        timeStamp: new Date,

    }
    const onCreateContent = async (data: CreateFormData) => {
        let attachmentUrl = null;
        try {
            if (data.attachment ) {
                const file = data.attachment[0];
                const fileRef = ref(storage, `attachments/${user?.uid}/${file.name}`);
                const snapshot = await uploadBytes(fileRef, file);
                attachmentUrl = await getDownloadURL(snapshot.ref);
            }

        } catch {
            console.log("error uploading file.");
        }
        await addDoc(postsRef, {
            ...data,
            attachment: attachmentUrl,
            ...docConfig
        });
        setCardContent('');
        refreshElements();
        (type == "comment" && handleCommentMode) && handleCommentMode();
    };

    return (
        <Card sx={{ maxWidth: 500, m: "auto", my: 4 }}>
            <CardContent>
                <Grid2 container spacing={2}>
                    <Grid2>
                        <Avatar src={user?.photoURL || ""} />
                    </Grid2>
                    <Grid2 size="grow">
                        <form onSubmit={handleSubmit(onCreateContent)}>
                            <TextField {...register("content")} fullWidth placeholder='Wuff wuff!' value={cardContent} onChange={(e) => setCardContent(e.target.value)} />
                            <p style={{ color: "red" }}>{errors.content?.message}</p>
                            <input type='file' {...register("attachment")} />
                            <input type='submit' value={'Post'} style={buttonStyle} />
                            {/* Attachment Button */}

                        </form>
                    </Grid2>
                </Grid2>
            </CardContent>
        </Card>
    );

};