import firestore from "@react-native-firebase/firestore";
import uuid from "uuid";
export const uploadChannels = () => {
  let channels = [
    {
      name: "SURF",
      desc: "",
      background: "https://cdn.wallpapersafari.com/86/22/GB49kZ.jpg",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "SNOW",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Fsnow.jpeg?alt=media&token=94744796-8dec-43c8-8ae2-610f96051b8b",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "SKATE",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Fskate.jpeg?alt=media&token=73c51ea0-9634-43f0-beef-bc7c2ce93cc4",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "TECHNOLOGY",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Ftechnology.jpeg?alt=media&token=ab8e9e16-08b3-42de-96ea-3340c1a80e14",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "TRAVEL",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Ftravel.jpeg?alt=media&token=78c7cb96-8406-4a07-95ce-63b4aa21e844",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "FASHION",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Ffashion.jpeg?alt=media&token=cc70e039-e8ec-48d3-b8d6-fc92bf70c296",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "BEAUTY",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Fbeauty.jpeg?alt=media&token=251365c3-3cf8-4b9a-9fe9-328ae8373c28",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "MUSIC",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Fmusic.jpeg?alt=media&token=5b86b78e-e36c-4e41-bb26-ff8f2e1ff38d",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "MMA",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Fmma.jpeg?alt=media&token=7ce7315a-d5ae-4442-a05b-905cafbefde1",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "FITNESS",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Ffitness.jpeg?alt=media&token=8088e9a1-cc0d-4961-95b7-a56295e1b007",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "OUTDOOR",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Foutdoor.jpeg?alt=media&token=3694a8a8-11f2-4ad4-a61e-714947b852a4",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "ADVENTURE",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Fadventure.jpeg?alt=media&token=388e8f4b-68d5-496d-9272-997f67daec95",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "SOCCER",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Fsoccer.jpeg?alt=media&token=83064dc4-ae07-4a72-8bda-597793d670d7",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "BASKETBALL",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Fnba.jpeg?alt=media&token=e4d105e8-0848-47cd-a988-f6b8fe64d1e6",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "FOOTBALL",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Fnfl.jpeg?alt=media&token=c07ef5a3-168d-4b0c-b869-8ec6df86f8d8",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "BASEBALL",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Fmlb.jpeg?alt=media&token=472e974a-29f3-43c1-b24b-759e60ca522e",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "ENTERTAINMENT",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Fentertainment.jpeg?alt=media&token=27650081-6523-4ae9-9eff-013ae6cce71a",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "WORLD NEWS",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Fnews.jpeg?alt=media&token=39e2f643-a4e7-4d67-9dfd-ade69b086874",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "CARS",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Fcars.jpeg?alt=media&token=4a7cc72b-baba-44dc-b800-7fa53bc9d636",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "CRYPTO",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Fcrypto.jpeg?alt=media&token=bb5e38ba-c47b-4767-b64f-bb7187f84d32",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "PHOTO",
      desc: "",
      background:
        "https://thumbs.dreamstime.com/b/panorama-landscape-mountains-valley-sunset-natural-outdoor-background-concept-183364168.jpg",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "FOOD + DRINK",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Ffood.jpeg?alt=media&token=0ca94f6f-996d-4880-87fe-3a711e8b049c",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
    {
      name: "COLLEGES",
      desc: "",
      background:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/channels%2Fcollege.jpeg?alt=media&token=f73220f5-6788-4e87-8f8a-df05782249e7",
      id: uuid.v4(),
      active: true,
      createdAt: 1618040974250,
    },
  ];
  var index = 0;
  // const id = uuid.v4();

  channels.forEach((i) => {
    firestore()
      .collection("channels")
      .doc(i.id)
      .set({ ...i, showingOrder: index })
      .then((res) => {})
      .catch((e) => {});
    index++;
  });
};

export const uploadChannelPosts = () => {
  let channelsPost = [
    {
      createdAt: 1622211456941,
      id: uuid.v4(),
      photo:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/logo.png?alt=media&token=a0cb39cb-b6af-435c-9b5a-a861979e2c46",
      postPhoto:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20Vans%20Skateboarding%20Presents%20Alright%20Ok%20%20Skate%20%20VANS_480p.mp4?alt=media&token=95175ad7-2b78-4edb-a6b9-8d1c3a7f313d",
      postDescription: "",
      postLocation: "",
      preview: "",
      type: "channel",
      uid: 8458745,
      username: "vans",
      views: 0,
      type: "video",
      viewers: [],
      reports: [],
      comments: [],
      likes: [],
    },
    {
      createdAt: 1622211456942,
      id: uuid.v4(),
      photo:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/logo.png?alt=media&token=a0cb39cb-b6af-435c-9b5a-a861979e2c46",
      postPhoto:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20Vans%20Europe%20Presents%20Going%20Nowhere%20%20Skate%20%20VANS_480p.mp4?alt=media&token=fdd14f59-b9ab-468d-921c-f8979ed0cd10",
      postDescription: "",
      postLocation: "",
      preview: "",
      type: "channel",
      uid: 8458745,
      username: "vans",
      views: 0,
      type: "video",
      viewers: [],
      reports: [],
      comments: [],
      likes: [],
    },
    {
      createdAt: 1622211456943,
      id: uuid.v4(),
      photo:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/logo.png?alt=media&token=a0cb39cb-b6af-435c-9b5a-a861979e2c46",
      postPhoto:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20Sonagi%20%20Skate%20%20Vans_480p.mp4?alt=media&token=902f0676-17d1-46bf-9f5a-3c5be9a31390",
      postDescription: "",
      postLocation: "",
      preview: "",
      type: "channel",
      uid: 8458745,
      username: "vans",
      views: 0,
      type: "video",
      viewers: [],
      reports: [],
      comments: [],
      likes: [],
    },
    {
      createdAt: 1622211456944,
      id: uuid.v4(),
      photo:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/logo.png?alt=media&token=a0cb39cb-b6af-435c-9b5a-a861979e2c46",
      postPhoto:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20Eye%20Of%20The%20Storm%20%20Skate%20%20VANS_480p.mp4?alt=media&token=56bd3b48-1ad1-47d6-ad39-00b0024cc88b",
      postDescription: "",
      postLocation: "",
      preview: "",
      type: "channel",
      uid: 8458745,
      username: "vans",
      views: 0,
      type: "video",
      viewers: [],
      reports: [],
      comments: [],
      likes: [],
    },
    {
      createdAt: 1622211456945,
      id: uuid.v4(),
      photo:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/logo.png?alt=media&token=a0cb39cb-b6af-435c-9b5a-a861979e2c46",
      postPhoto:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20Vans%20Cash%20Out%20%20Skate%20%20VANS_480p.mp4?alt=media&token=f5c2c274-8f05-4f45-a017-ca4bed212264",
      postDescription: "",
      postLocation: "",
      preview: "",
      type: "channel",
      uid: 8458745,
      username: "vans",
      views: 0,
      type: "video",
      viewers: [],
      reports: [],
      comments: [],
      likes: [],
    },
    {
      createdAt: 1622211456946,
      id: uuid.v4(),
      photo:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/logo.png?alt=media&token=a0cb39cb-b6af-435c-9b5a-a861979e2c46",
      postPhoto:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20Vans%20China%20Presents%20CHENG%20%20Skate%20%20VANS_480p.mp4?alt=media&token=2a6928a1-f0d3-4fc8-85fd-52935c446778",
      postDescription: "",
      postLocation: "",
      preview: "",
      type: "channel",
      uid: 8458745,
      username: "vans",
      views: 0,
      type: "video",
      viewers: [],
      reports: [],
      comments: [],
      likes: [],
    },
    {
      createdAt: 1622211456947,
      id: uuid.v4(),
      photo:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/logo.png?alt=media&token=a0cb39cb-b6af-435c-9b5a-a861979e2c46",
      postPhoto:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20Vans%20Skateboarding%20by%20Frog%20Skateboards%20%20Skate%20%20VANS_480p.mp4?alt=media&token=8528525a-0980-44d4-8da5-88e30dac3d9a",
      postDescription: "",
      postLocation: "",
      preview: "",
      type: "channel",
      uid: 8458745,
      username: "vans",
      views: 0,
      type: "video",
      viewers: [],
      reports: [],
      comments: [],
      likes: [],
    },
    {
      createdAt: 1622211456948,
      id: uuid.v4(),
      photo:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/logo.png?alt=media&token=a0cb39cb-b6af-435c-9b5a-a861979e2c46",
      postPhoto:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20Tony%20Hawk%20Pipedreams%20%20Skate%20%20VANS_480p.mp4?alt=media&token=7226fdbb-89c9-4be2-bb52-fc3a30a2e117",
      postDescription: "",
      postLocation: "",
      preview: "",
      type: "channel",
      uid: 8458745,
      username: "vans",
      views: 0,
      type: "video",
      viewers: [],
      reports: [],
      comments: [],
      likes: [],
    },
    // {
    //   createdAt: 1622211456949,
    //   id: uuid.v4(),
    //   photo:
    //     "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/logo.png?alt=media&token=a0cb39cb-b6af-435c-9b5a-a861979e2c46",
    //   postPhoto:
    //     "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20Roberto%20Souzas%20Culture%20Part_480p.mp4?alt=media&token=fb630ac5-9e3f-4409-b7e8-8d4e74f6bea7",
    //   postDescription: "",
    //   postLocation: "",
    //   preview: "",
    //   type: "channel",
    //   uid: 8458745,
    //   username: "vans",
    //   views: 0,
    //   type: "video",
    //   viewers: [],
    //   reports: [],
    //   comments: [],
    //   likes: [],
    // },
    // {
    //   createdAt: 1622211456940,
    //   id: uuid.v4(),
    //   photo:
    //     "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/05FBB302-E4F5-47DC-9023-DEA44F3125B6.png?alt=media&token=3dc5d50b-606c-4f3e-ac67-cac794960f92",
    //   postPhoto:
    //     "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20Jorge%20Simoes%20Bones%20Part_480p.mp4?alt=media&token=d7d39ffa-7b8e-4d2d-b87a-443c08f7c0ee",
    //   postDescription: "",
    //   postLocation: "",
    //   preview: "",
    //   type: "channel",
    //   uid: 758748530,
    //   username: "thrasher",
    //   views: 0,
    //   type: "video",
    //   viewers: [],
    //   reports: [],
    //   comments: [],
    //   likes: [],
    // },
  ];

  channelsPost.forEach((i) => {
    firestore()
      .collection("channelposts")
      .doc(i.id)
      .set({ ...i, channelId: "ed9baf8f-8a73-4da8-93cb-d62eba90d160" })
      .then((res) => {})
      .catch((e) => {});
  });
};

// {
//   createdAt: 1618040974250,
//   id: uuid.v4(),
//   photo:
//     "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/sample%20images%2FFFF62B01-5A12-4558-BD7D-5B7957ED697A.png?alt=media&token=80212630-6cd1-46cf-b49c-e9057bd7d133",
//   postPhoto:
//     "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/959b3138069459b1c559ff298ec648c9.jpg?alt=media&token=c7ba530b-96c7-495d-a2b4-2d5a2c8b8433",
//   postDescription: "SURF",
//   postLocation: "",
//   preview: "",
//   type: "channel",
//   uid: 7878787,
//   username: "red bull",
//   views: 0,
//   type: "image",
//   viewers: [],
//   reports: [],
//   comments: [],
//   likes: [],
// },
