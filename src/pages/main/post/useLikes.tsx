import { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../config/firebase";
interface Like {
    likeId: string;
    userId: string;
}

export const useLikes = (postId: string, userId?: string) => {
  const [likes, setLikes] = useState<Like[] | null>(null);

  const likesRef = collection(db, "likes");
  const likesDoc = query(likesRef, where("postId", "==", postId));

  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    setLikes(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id })));
  };

  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, { userId, postId });
      if (userId) {
        setLikes((prev) => (prev ? [...prev, { userId, likeId: newDoc.id }] : [{ userId, likeId: newDoc.id }]));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeLike = async () => {
    try {
      const likeToDeleteQuery = query(likesRef, where("postId", "==", postId), where("userId", "==", userId));
      const likeToDeleteData = await getDocs(likeToDeleteQuery);
      const likeId = likeToDeleteData.docs[0]?.id;
      const likeToDelete = doc(db, "likes", likeId);
      await deleteDoc(likeToDelete);
      setLikes((prev) => prev?.filter((like) => like.likeId !== likeId) || null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getLikes();
  }, [postId]);

  const hasUserLiked = likes?.some((like) => like.userId === userId);

  return { likes, addLike, removeLike, hasUserLiked };
};
