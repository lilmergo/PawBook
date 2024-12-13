import { Post as IPost } from "../Main";
import { auth, db } from "../../../config/firebase";
import { collection, query, where, getDocs, deleteDoc, doc, getDoc, Timestamp, orderBy } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, Box, Avatar, Grid2, IconButton, Icon, TextField } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { CreateForm } from "../../../components/create-form";
import { useLikes } from "./useLikes";
import { useComments } from "./useComments";

interface Props {
    post: IPost;
}

export const Post = (props: Props) => {
    const { post } = props;
    const [user] = useAuthState(auth);
    
    const [photoURL, setPhotoURL] = useState(""); 

    const { likes, addLike, removeLike, hasUserLiked } = useLikes(post.id, user?.uid);
    const { commentsList, getComments } = useComments(post.id);
    
    const [commentMode, setCommentMode] = useState(false);    
    const handleCommentMode = () => {
        setCommentMode(!commentMode);
    }

    const fetchAvatar = async () => {
        try {
            const usersRef = collection(db, "users");
            const usersDoc = query(usersRef, where("userId", "==", post.userId));
            const userAvatar = await getDocs(usersDoc);

            const fetchedPhotoUrl = userAvatar.docs[0]?.data()['photoURL'];
            setPhotoURL(fetchedPhotoUrl || ""); 
        } catch (error) {
            console.error("Error fetching avatar:", error);
        }
    };

    useEffect(() => {
        fetchAvatar()
    }, [post])


    return (<Card sx={{ maxWidth: 500, m: "auto", my: 4 }}>
        <CardContent>
            <Grid2 container spacing={2}>
                <Grid2>
                    <Avatar src={photoURL} />
                </Grid2>
                <Grid2 size="grow">
                    {/* Username and "posted" */}

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        {post.username}
                    </Typography>

                    {/* Post Description */}
                    <Typography variant="body1" color="text.primary">
                        {post.content}
                    </Typography>
                    {post.attachment && <img src={post.attachment} style={{maxWidth:"inherit"}}/>}

                    <Box>
                        {/* Like Button */}
                        <IconButton onClick={hasUserLiked ? removeLike : addLike}>
                            {hasUserLiked ? <ThumbUpAltIcon style={{ color: '#748B75' }} /> : <ThumbUpAltIcon style={{ color: '#A3A89D' }} />}
                        </IconButton>
                        <Typography variant="body2" color="text.primary" display="inline">{likes?.length}</Typography>
                        
                        {/* Comment Button */}
                        <IconButton onClick={handleCommentMode}>
                            <ChatBubbleIcon style={{ color: '#A3A89D' }} />
                        </IconButton>
                        <Typography variant="body2" color="text.primary" display="inline">Reply</Typography>
                        
                    </Box>

                    {commentMode && <CreateForm refreshElements={getComments} postId={post.id} handleCommentMode={handleCommentMode} type='comment'/>}
                    {commentsList?.map((comment) => <Post post={comment}/>)}

                </Grid2>
            </Grid2>

        </CardContent>
    </Card>);
}
