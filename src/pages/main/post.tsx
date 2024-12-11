import { Post as IPost } from "./Main";
import { auth, db } from "../../config/firebase";
import { addDoc, collection, query, where, getDocs, deleteDoc, doc, getDoc, Timestamp, orderBy } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, Box, Avatar, Grid2, IconButton, Icon, TextField } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { CreateComment } from "../../components/create-comment";

interface Props {
    post: IPost;
}
interface Like {
    likeId: string;
    userId: string;
}
interface Comment {
    id: string,
    userId: string,
    username: string,
    content: string,
    timeStamp: Timestamp
}

export const Post = (props: Props) => {
    const { post } = props;
    const [user] = useAuthState(auth);
    const likesRef = collection(db, "likes");
    const likesDoc = query(likesRef, where("postId", "==", post.id));

    const [commentsList, setCommentsList] = useState<Comment[] | null>(null);
    const commentsRef = collection(db, "comments");
    const commentsDoc = query(commentsRef, orderBy('timeStamp', 'asc'), where("postId", "==", post.id));


    const [likes, setLikes] = useState<Like[] | null>(null);//array of userIds that have liked this post.
    const [photoURL, setPhotoURL] = useState(""); // State to hold the photoURL

    const getLikes = async () => {
        const data = await getDocs(likesDoc);
        setLikes(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id })));
    }

    const addLike = async () => {
        try {
            const newDoc = await addDoc(likesRef, {
                userId: user?.uid,
                postId: post.id
            });
            if (user) {
                setLikes((prev) => prev ? [...prev, { userId: user?.uid, likeId: newDoc.id }] : [{ userId: user?.uid, likeId: newDoc.id }])
            }
        } catch (err) {
            console.log(err);
        }
    };

    const removeLike = async () => {
        try {
            const likeToDeleteQuery = query(likesRef,
                where("postId", "==", post.id),
                where("userId", "==", user?.uid)
            );
            const likeToDeleteData = await getDocs(likeToDeleteQuery);
            const likeId = likeToDeleteData.docs[0].id;
            const likeToDelete = doc(db, "likes", likeId);

            await deleteDoc(likeToDelete);

            if (user) {
                setLikes((prev) => prev && prev.filter((like) => like.likeId !== likeId)
                );

            }
        } catch (err) {
            console.log(err);
        }
    }

    const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

    const fetchAvatar = async () => {
        try {
            const usersRef = collection(db, "users");
            const usersDoc = query(usersRef, where("userId", "==", post.userId));
            const userAvatar = await getDocs(usersDoc);

            const fetchedPhotoUrl = userAvatar.docs[0]?.data()['photoURL'];
            setPhotoURL(fetchedPhotoUrl || ""); // Update state with fetched photoURL
        } catch (error) {
            console.error("Error fetching avatar:", error);
        }
    };

    const [commentMode, setCommentMode] = useState(false);
    const handleCommentMode = () => {
        setCommentMode(!commentMode);
    }

    const getComments = async () => {
        const data = await getDocs(commentsDoc);
        setCommentsList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Comment[]);
    };

    useEffect(() => {
        getLikes();
        fetchAvatar();
        getComments();
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
                    </Box>

                    {commentMode && <CreateComment refreshComments={getComments} postId={post.id} handleCommentMode={handleCommentMode} />}
                    {commentsList?.map((comment) => <Post post={comment}/>)}

                </Grid2>
            </Grid2>

        </CardContent>
    </Card>);
}

function register(arg0: string): import("react/jsx-runtime").JSX.IntrinsicAttributes & { variant?: import("@mui/material").TextFieldVariants | undefined; } & Omit<import("@mui/material").FilledTextFieldProps | import("@mui/material").OutlinedTextFieldProps | import("@mui/material").StandardTextFieldProps, "variant"> {
    throw new Error("Function not implemented.");
}
