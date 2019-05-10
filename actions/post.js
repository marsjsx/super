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
        postPhoto: 'https://firebasestorage.googleapis.com/v0/b/instagram-tutorial-1a335.appspot.com/o/philly.jpg?alt=media&token=bb2c4267-3952-43f9-8342-5d46fa1f86f9',
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
