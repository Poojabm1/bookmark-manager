const API_URL = "http://127.0.0.1:5000/api/bookmarks";

function loadBookmarks() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById("bookmarkList");
            list.innerHTML = "";

            data.forEach(bookmark => {
                const card = document.createElement("div");
                card.className = "bookmark-card";

                card.innerHTML = `
                    <h3>${bookmark.title}</h3>
                    <p>${bookmark.url}</p>
                    <div class="btn-group">
                        <button class="view-btn" onclick="viewBookmark('${bookmark.url}')">View</button>
                        <button class="edit-btn" onclick="editBookmark(${bookmark.id}, '${bookmark.title}', '${bookmark.url}')">Update</button>
                        <button class="delete-btn" onclick="deleteBookmark(${bookmark.id})">Delete</button>
                    </div>
                `;

                list.appendChild(card);
            });
        });
}

function viewBookmark(url) {
    window.open(url, "_blank");
}

function addOrUpdateBookmark() {
    const id = document.getElementById("bookmarkId").value;
    const title = document.getElementById("title").value;
    const url = document.getElementById("url").value;

    if (!title || !url) {
        alert("Please fill all fields!");
        return;
    }

    if (id) {
        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, url })
        }).then(() => {
            resetForm();
            loadBookmarks();
        });
    } else {
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, url })
        }).then(() => {
            resetForm();
            loadBookmarks();
        });
    }
}

function editBookmark(id, title, url) {
    document.getElementById("bookmarkId").value = id;
    document.getElementById("title").value = title;
    document.getElementById("url").value = url;
    document.getElementById("saveBtn").innerText = "Update Bookmark";
}

function deleteBookmark(id) {
    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    }).then(() => loadBookmarks());
}

function resetForm() {
    document.getElementById("bookmarkId").value = "";
    document.getElementById("title").value = "";
    document.getElementById("url").value = "";
    document.getElementById("saveBtn").innerText = "Add Bookmark";
}
loadBookmarks();
