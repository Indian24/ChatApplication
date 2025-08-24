"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const currentUser = prompt("Enter your username (e.g. User1, User2):") || "User1";

    let currentReceiver = currentUser === "User1" ? "User2" : "User1";

    let currentConversationId = currentUser === "User1" ? "#conversation-1" : "#conversation-2";

    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/chatHub?username=" + encodeURIComponent(currentUser))
        .build();
        
    const sendButtons = document.querySelectorAll(".conversation-form-submit");
    const messageInputs = document.querySelectorAll(".conversation-form-input");


    document.querySelectorAll(".conversation").forEach(div => div.style.display = "none");
    document.querySelector(currentConversationId).style.display = "block";
    document.querySelectorAll(".conversation").forEach(conv => {
        conv.style.display = "none";
    });

    const defaultConv = document.querySelector(currentConversationId);
    if (defaultConv) {
        defaultConv.style.display = "block";
    }

    // 📥 Receive message from server
    connection.on("ReceiveMessage", function (sender, receiver, message, time) {
        const isInvolved = sender === currentUser || receiver === currentUser;
        if (!isInvolved) return;

        const isRelevant = sender === currentReceiver || receiver === currentReceiver;
        if (!isRelevant) return;

        const conversation = document.querySelector(currentConversationId);
        if (!conversation) return;

        let messageList = conversation.querySelector(".message-list");
        if (!messageList) {
            messageList = document.createElement("div");
            messageList.className = "message-list p-4 overflow-y-auto";
            conversation.insertBefore(messageList, conversation.querySelector(".conversation-form"));
        }

        const msg = document.createElement("div");
        msg.classList.add("message-item", "mb-2", sender === currentUser ? "text-right" : "text-left");
        msg.innerHTML = `<strong>${sender}</strong> <small class="text-gray-400">${time}</small><br>${message}`;

        messageList.appendChild(msg);
        messageList.scrollTop = messageList.scrollHeight;
    });

    // 🔌 Start SignalR connection
    connection.start().then(() => {
        console.log("SignalR connected.");
    }).catch(err => console.error(err.toString()));

    // 📤 Send message on button click
    sendButtons.forEach((btn, index) => {
        btn.addEventListener("click", async () => {
            const message = messageInputs[index].value.trim();
            if (!message) return;

            try {
                await connection.invoke("SendMessage", currentUser, currentReceiver, message);
                messageInputs[index].value = "";
            } catch (err) {
                console.error("Failed to send message:", err.toString());
            }
        });
    });

    // ↩️ Send message on Enter key
    messageInputs.forEach((input, index) => {
        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendButtons[index].click();
            }
        });
    });

    // 🔄 Switching conversation views
    document.querySelectorAll("[data-conversation]").forEach(function (item) {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            const targetSelector = this.getAttribute("data-conversation");
            currentConversationId = targetSelector;

            document.querySelectorAll(".conversation").forEach(conv => {
                conv.style.display = "none";
            });

            const targetConv = document.querySelector(targetSelector);
            if (targetConv) targetConv.style.display = "block";

            // 🔄 Update currentReceiver logic
            if (targetSelector.includes("1")) {
                currentReceiver = "User1";
            } else if (targetSelector.includes("2")) {
                currentReceiver = "User2";
            }

            // 🛑 Prevent chatting with self
            if (currentReceiver === currentUser) {
                currentReceiver = currentUser === "User1" ? "User2" : "User1";
            }
        });
    });
});


