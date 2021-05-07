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
      createdAt: 1618056755051,
      id: uuid.v4(),
      photo:
        "https://upload.wikimedia.org/wikipedia/commons/c/cb/World_Surf_League_Logo_2020.png",
      postPhoto:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20CALL%20OF%20DUTY%20BLACK%20OPS%20COLD%20WAR%20Campaign%20Gameplay%20PS5%202020%20HD_480p.mp4?alt=media&token=c65388c2-c256-48e0-b83a-522b66b59383",
      postDescription: "",
      postLocation: "",
      preview: "",
      type: "channel",
      uid: 8458745,
      username: "red bull",
      views: 0,
      type: "video",
      viewers: [],
      reports: [],
      comments: [],
      likes: [],
    },
    {
      createdAt: 1618056755052,
      id: uuid.v4(),
      photo:
        "https://upload.wikimedia.org/wikipedia/commons/c/cb/World_Surf_League_Logo_2020.png",
      postPhoto:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20Hogwarts%20Legacy%20%20Official%20Reveal%20Trailer%20%20PS5_480p.mp4?alt=media&token=0f0b2d84-dac2-4479-b2e4-4b881d9d8f09",
      postDescription: "",
      postLocation: "",
      preview: "",
      type: "channel",
      uid: 8458745,
      username: "red bull",
      views: 0,
      type: "video",
      viewers: [],
      reports: [],
      comments: [],
      likes: [],
    },
    {
      createdAt: 1618056755053,
      id: uuid.v4(),
      photo:
        "https://upload.wikimedia.org/wikipedia/commons/c/cb/World_Surf_League_Logo_2020.png",
      postPhoto:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20GoPro%20Mitchie%20Bruscos%20Road%20to%20X%20Games%20XVIII%20Episode%203_360p.mp4?alt=media&token=46ef6480-91b3-42f2-8424-5725687f424b",
      postDescription: "",
      postLocation: "",
      preview: "",
      type: "channel",
      uid: 8458745,
      username: "red bull",
      views: 0,
      type: "video",
      viewers: [],
      reports: [],
      comments: [],
      likes: [],
    },
    {
      createdAt: 1618056755054,
      id: uuid.v4(),
      photo:
        "https://upload.wikimedia.org/wikipedia/commons/c/cb/World_Surf_League_Logo_2020.png",
      postPhoto:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20The%20Virtuix%20Omni%20Actually%20Lets%20You%20Run%20Around%20Video%20Games_360p.mp4?alt=media&token=efc20963-842a-4407-93a0-8a52751a2d7c",
      postDescription: "",
      postLocation: "",
      preview: "",
      type: "channel",
      uid: 8458745,
      username: "red bull",
      views: 0,
      type: "video",
      viewers: [],
      reports: [],
      comments: [],
      likes: [],
    },
    {
      createdAt: 1618056755055,
      id: uuid.v4(),
      photo:
        "https://upload.wikimedia.org/wikipedia/commons/c/cb/World_Surf_League_Logo_2020.png",
      postPhoto:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20Magnetic%20Accelerators%20%20Magnetic%20Games_480p.mp4?alt=media&token=fbeff034-4e6b-4325-b4b8-903fec406dd8",
      postDescription: "",
      postLocation: "",
      preview: "",
      type: "channel",
      uid: 8458745,
      username: "red bull",
      views: 0,
      type: "video",
      viewers: [],
      reports: [],
      comments: [],
      likes: [],
    },
    {
      createdAt: 1618056755056,
      id: uuid.v4(),
      photo:
        "https://upload.wikimedia.org/wikipedia/commons/c/cb/World_Surf_League_Logo_2020.png",
      postPhoto:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20VR%20360%20Video%20of%20Top%205%20Roller%20Coaster%20Rides%204K%20Virtual%20Reality_360p.mp4?alt=media&token=d966500c-9b7a-4e49-afdb-df765accdbd6",
      postDescription: "",
      postLocation: "",
      preview: "",
      type: "channel",
      uid: 8458745,
      username: "red bull",
      views: 0,
      type: "video",
      viewers: [],
      reports: [],
      comments: [],
      likes: [],
    },
    {
      createdAt: 1618056755057,
      id: uuid.v4(),
      photo:
        "https://upload.wikimedia.org/wikipedia/commons/c/cb/World_Surf_League_Logo_2020.png",
      postPhoto:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20Marvels%20SpiderMan%20PS4%202017%20E3%20Gameplay_360p.mp4?alt=media&token=ff7a5e17-0d62-4695-b3a3-0b33d2955d8a",
      postDescription: "",
      postLocation: "",
      preview: "",
      type: "channel",
      uid: 8458745,
      username: "red bull",
      views: 0,
      type: "video",
      viewers: [],
      reports: [],
      comments: [],
      likes: [],
    },
    {
      createdAt: 1618056755058,
      id: uuid.v4(),
      photo:
        "https://upload.wikimedia.org/wikipedia/commons/c/cb/World_Surf_League_Logo_2020.png",
      postPhoto:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20Gamers%20Are%20Awesome%20%20Episode%20110_360p.mp4?alt=media&token=e806383f-ef1a-4c4a-bc47-34d67797466d",
      postDescription: "",
      postLocation: "",
      preview: "",
      type: "channel",
      uid: 8458745,
      username: "red bull",
      views: 0,
      type: "video",
      viewers: [],
      reports: [],
      comments: [],
      likes: [],
    },
    {
      createdAt: 1618056755059,
      id: uuid.v4(),
      photo:
        "https://upload.wikimedia.org/wikipedia/commons/c/cb/World_Surf_League_Logo_2020.png",
      postPhoto:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20JELLY%20TRAPPED%20IN%20VIDEO%20GAMES%202_360p.mp4?alt=media&token=caaf2df3-2c78-4fbb-8a34-52044ed38ccb",
      postDescription: "",
      postLocation: "",
      preview: "",
      type: "channel",
      uid: 8458745,
      username: "red bull",
      views: 0,
      type: "video",
      viewers: [],
      reports: [],
      comments: [],
      likes: [],
    },
    {
      createdAt: 1618056755060,
      id: uuid.v4(),
      photo:
        "https://upload.wikimedia.org/wikipedia/commons/c/cb/World_Surf_League_Logo_2020.png",
      postPhoto:
        "https://firebasestorage.googleapis.com/v0/b/super-b71be.appspot.com/o/yt1s.com%20-%20Best%20AWM%20and%20M82B%20OverPower%20Ajjubhai%20Gameplay%20with%20Jontybhai%20%20Garena%20Free%20Fire_360p.mp4?alt=media&token=9cf63c1b-86d8-4c71-9d41-f46303854635",
      postDescription: "",
      postLocation: "",
      preview: "",
      type: "channel",
      uid: 8458745,
      username: "red bull",
      views: 0,
      type: "video",
      viewers: [],
      reports: [],
      comments: [],
      likes: [],
    },
  ];

  channelsPost.forEach((i) => {
    firestore()
      .collection("channelposts")
      .doc(i.id)
      .set({ ...i, channelId: "75fb6aa2-3268-42ed-b694-7f07f80787865" })
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
