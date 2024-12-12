import { getDocs, collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useEffect, useState } from 'react';
import { Post } from './post/post';
import { Typography } from '@mui/material';
import { CreateForm } from '../../components/create-form';

export interface Post {
    id: string,
    userId: string,
    username: string,
    content: string,
    timeStamp: Timestamp
}

export const Main = () => {
    const postsRef = query(collection(db, 'posts'), orderBy('timeStamp', 'desc')) ;
    const [postsList, setPostsList] = useState<Post[] | null>(null);

    const getPosts = async () => {
        const data = await getDocs(postsRef);
        setPostsList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[]);
    };

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <>
            <div>
                <CreateForm refreshElements={getPosts} type='post' />
            </div>
            <div>
                {postsList?.map((post) => <Post post={post}/>)}
            </div>
        </>
    )
}