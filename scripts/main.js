var database;
var currentUser;
var rankTable;
$(document).ready(function () {
    console.log("init");
    let writerButton = document.getElementById("writer");
    let takerButton = document.getElementById("taker");
    let loginButton = document.getElementById("loginButton");
    let usernameInput = document.getElementById('username');
    let passwordInput = document.getElementById('password');
    rankTable = document.getElementById("rankTable");
    setupFirebase();
    loadRank();
    writerButton.onclick = function () {
        location.href = "writerPage.html";
        console.log("writer clicked");
    };

    takerButton.onclick = function () {
        console.log(currentUser);
        if (currentUser === undefined) {
            location.href = "takerPage.html";
        } else {
            location.href = "takerPage.html" + "?user=" + currentUser;
        }
        console.log("taker clicked");
    };

    loginButton.onclick = () => {
        console.log('login');
        let username = usernameInput.value;
        let password = passwordInput.value;
        makeUser(username, password);
    }

});

function loadRank() {
    let scoreSet = new Set();
    var nameMap = new Map();
    let currentRef = database.ref('users');
    currentRef.once('value').then(function (snapshot) {
        console.log(snapshot);
        snapshot.forEach(function (childSnapshot) {
            let entry = {
                key: childSnapshot.key,
                username: childSnapshot.val().username,
                password: childSnapshot.val().password,
                score: childSnapshot.val().score
            };
            console.log("load", entry);
            console.log(nameMap);
            let tempNames = nameMap.get(entry.score);
            console.log(tempNames);
            if (tempNames === undefined || tempNames.length === 0) {
                let temp = new Set();
                temp.add(entry.username);
                console.log("set");
                console.log(temp);
                nameMap.set(entry.score, temp);
            } else {
                console.log("current names:");
                console.log(tempNames);
                let addedArray = tempNames.add(entry.username);
                console.log("added array:");
                console.log(addedArray);
                nameMap.set(entry.score, addedArray);
            }
            scoreSet.add(entry.score);
        });
    }).then(() => {
        let scores = Array.from(scoreSet);
        scores.sort(function (a, b) {
            return b - a;
        });
        console.log(nameMap);
        var result = [];
        for (i = 0; i < scores.length; i++) {
            let entry = {
                usernames: nameMap.get(scores[i]),
                score: scores[i]
            };
            result.push(entry);
        }
        console.log(result);
        return result;
    }).then((result) => {
        updateTable(result);
    });
}

function updateTable(rankList) {
    var rowIndex = 1;
    for (var j = 0; j < rankList.length; j++) {
        var row = rankTable.insertRow(rowIndex);
        row.id = "ct";
        row.style.borderBottom = "1px solid var(--primary)";
        row.style.color="var(--primary-dark)";
        row.style.fontSize="1.5rem";
        row.style.height="3rem";
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        cell1.innerText = j + 1;
        cell1.style.textAlign="center";
        if(j+1<4){
            cell1.style.fontWeight="bold";
        }
        cell2.innerText = Array.from(rankList[j].usernames).join(", ");
        cell2.style.width="15rem";
        cell3.innerText = rankList[j].score;
        cell3.style.textAlign="center";
        rowIndex++;
    }

}

function makeUser(username, password) {
    let users = [];
    let pairs = new Map();
    let currentRef = database.ref('users');
    console.log(currentRef);
    currentRef.once('value').then(function (snapshot) {
        console.log(snapshot);
        snapshot.forEach(function (childSnapshot) {
            // var childData = childSnapshot.val();
            let entry = {
                key: childSnapshot.key,
                username: childSnapshot.val().username,
                password: childSnapshot.val().password,
            };
            console.log("load", entry);
            users.push(entry.username);
            pairs.set(entry.username, [entry.password, entry.key]);
        });
    }).then(() => {
        if (users.includes(username)) {
            if (password === pairs.get(username)[0]) {
                console.log("logged in");
                document.getElementById("login-message").innerText = "Logged in";
                document.getElementById("login-message").style.color = "#00bfa5";
                currentUser = pairs.get(username)[1];
                console.log(currentUser);
            } else {
                console.log("password wrong");
                document.getElementById("login-message").innerText = "Wrong password";
                document.getElementById("login-message").style.color = "#ff5252";
            }
        } else {
            let entry = {
                username: username,
                password: password,
                score: 0
            };
            console.log("new: %s", entry);
            document.getElementById("login-message").innerText = "New user";
            document.getElementById("login-message").style.color = "#002f6c";
            currentUser = database.ref('users').push(entry).key;
            console.log("save: %s", currentUser);
        }
    });
}

function setupFirebase() {
    var config = {
        apiKey: "AIzaSyD4Bv6pmrWj3zynIYBSlr0GR1ioCmbrQvA",
        authDomain: "wikiwiki-b0ce6.firebaseapp.com",
        databaseURL: "https://wikiwiki-b0ce6.firebaseio.com",
        projectId: "wikiwiki-b0ce6",
        storageBucket: "wikiwiki-b0ce6.appspot.com",
        messagingSenderId: "239915230249"
    };
    firebase.initializeApp(config);
    console.log(firebase);
    database = firebase.database();
    console.log(database);
}
