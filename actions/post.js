import firebase from 'firebase';
import db from '../config/firebase';

export const updateDescription = (text) => {
  return { type: 'UPDATE_DESCRIPTION', payload: text }
}

export const uploadPost = () => {
  return async (dispatch, getState) => {
    try {
      const { post, user } = getState()

      const upload = {
        postPhoto: 'https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/md80x73.jpg?alt=media&token=e0a7bce2-1cd1-48c8-bc94-c2cd4269c412',
        postDescription: post.description,
        uid: user.uid,
        photo: user.photo,
        username: user.username,
      }

      const ref = await db.collection('posts').doc()
      upload.id = ref.id
      ref.set(upload)

    } catch (e) {
      alert(e)
    }
  }
}

export const getPosts = () => {
  return async (dispatch, getState) => {
    try {
      const posts = await db.collection('posts').get()

      let array = []
      posts.forEach((post) => {
        array.push(post.data())
      })
      dispatch({ type: 'GET_POSTS', payload: array })
    } catch (e) {
      alert(e)
    }
  }
}
