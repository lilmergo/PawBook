import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../../../config/firebase";

interface Comment {
    id: string,
    userId: string,
    username: string,
    content: string,
    timeStamp: Timestamp
}

export const useComments = (postId: string) => {
  const [commentsList, setCommentsList] = useState<Comment[] | null>(null);

  const commentsRef = collection(db, "comments");
  const commentsDoc = query(commentsRef, orderBy("timeStamp", "asc"), where("postId", "==", postId));

  const getComments = async () => {
    const data = await getDocs(commentsDoc);
    setCommentsList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Comment[]);
  };

  useEffect(() => {
    getComments();
  }, [postId]);

  return { commentsList, getComments };
};
