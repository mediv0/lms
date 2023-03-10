const chatroom = document.querySelector(".chatroom");
const chatroomTitle = document.querySelector(".chatroom__title");
const chatroomInput = document.querySelector(".chatroom__input__val");
const chatroomInputContainer = document.querySelector(".chatroom__input");
const chatroomList = document.querySelector(".chatroom__list");

const chatList = [
    {
        content: "سلام وقت شما بخیر",
        name: "مهدی فخر",
        me: true,
    },
    {
        content: "ممنون بابت این کلاس آموزشی",
        name: "رضا زمانی",
        me: false,
    },

    {
        content: "خواهش میکنم",
        name: "مهدی فخر",
        me: true,
    },
    {
        content: "کلاس بعدی چه زمانی شروع میشه",
        name: "طاها نامدار",
        me: false,
    },
    {
        content: "ویدئو این جلسه رو لظفا بفرستید",
        name: "امیرعلی رستمی",
        me: false,
    },
];

/*

<li v-for="(user, i) in chats" :key="i" class="chatroom__content__item" :class="{ me: user.me, other: !user.me }">
<p class="chatroom__content__item__name">مهدی فخر</p>
<p v-if="typeof user.content === 'string'" class="chatroom__content__item__text">سلام حال شما چطوره</p>

*/

const chatNode = (chat) => {
    const item = document.createElement("li");
    const name = document.createElement("p");
    const content = document.createElement("p");

    // add classess
    const _class = chat.me ? "me" : "other";
    item.classList.add("chatroom__content__item", _class);
    name.classList.add("chatroom__content__item__name");
    content.classList.add("chatroom__content__item__text");

    name.innerHTML = chat.name;
    content.innerHTML = chat.content;

    item.appendChild(name);
    item.appendChild(content);

    return item;
};

(() => {
    const chatFragment = document.createDocumentFragment();
    for (let i = 0; i < chatList.length; i++) {
        const chat = chatList[i];

        const item = chatNode(chat);
        chatFragment.appendChild(item);
    }

    chatroomList.appendChild(chatFragment);
})();

const openChatroom = () => {
    chatroom.style.display = "flex";
};
const closeChatroom = () => {
    chatroom.style.display = "none";
};

chatroomInput.addEventListener("keypress", (e) => {
    if (e.which === 13) {
        e.preventDefault();
        postChat();
    }
});
const postChat = () => {
    if (!chatroomInput.value) {
        return;
    }
    const chat = chatNode({
        me: true,
        name: "مهدی فخر",
        content: chatroomInput.value,
    });

    chatroomInput.value = "";
    chatroomList.appendChild(chat);
    setTimeout(() => {
        chatroomList.scrollTop = chatroomList.scrollHeight;
    }, 20);
};
