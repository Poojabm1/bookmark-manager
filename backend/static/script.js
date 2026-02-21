const API_URL = "/bookmarks";   // Works for localhost & Render

// Load all bookmarks
async function loadBookmarks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch bookmarks");

        const data = await response.json();
        const list = document.getElementById("bookmarkList");
        list.innerHTML = "";

        data.forEach(bookmark => {
            const card = document.createElement("div");
            card.className = "bookmark-card";

            const title = document.createElement("h3");
            title.textContent = bookmark.title;

            const urlText = document.createElement("p");
            urlText.textContent = bookmark.url;

            const btnGroup = document.createElement("div");
            btnGroup.className = "btn-group";

            const viewBtn = document.createElement("button");
            viewBtn.className = "view-btn";
            viewBtn.innerText = "View";
            viewBtn.onclick = () => viewBookmark(bookmark.url);

            const editBtn = document.createElement("button");
            editBtn.className = "edit-btn";
            editBtn.innerText = "Update";
            editBtn.onclick = () => editBookmark(bookmark);

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.innerText = "Delete";
            deleteBtn.onclick = () => deleteBookmark(bookmark.id);

            btnGroup.appendChild(viewBtn);
            btnGroup.appendChild(editBtn);
            btnGroup.appendChild(deleteBtn);

            card.appendChild(title);
            card.appendChild(urlText);
            card.appendChild(btnGroup);

            list.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        alert("Error loading bookmarks");
    }
}

// Open bookmark
function viewBookmark(url) {
    window.open(url, "_blank");
}

// Add or Update
async function addOrUpdateBookmark() {
    const id = document.getElementById("bookmarkId").value;
    const title = document.getElementById("title").value.trim();
    const url = document.getElementById("url").value.trim();

    if (!title || !url) {
        alert("Please fill all fields!");
        return;
    }

    const method = id ? "PUT" : "POST";
    const endpoint = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(endpoint, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, url })
        });

        if (!response.ok) throw new Error("Operation failed");

        resetForm();
        loadBookmarks();

    } catch (error) {
        console.error(error);
        alert("Something went wrong!");
    }
}

// Fill form for editing
function editBookmark(bookmark) {
    document.getElementById("bookmarkId").value = bookmark.id;
    document.getElementById("title").value = bookmark.title;
    document.getElementById("url").value = bookmark.url;
    document.getElementById("saveBtn").innerText = "Update Bookmark";
}

// Delete bookmark
async function deleteBookmark(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Delete failed");

        loadBookmarks();

    } catch (error) {
        console.error(error);
        alert("Error deleting bookmark");
    }
}

// Reset form
function resetForm() {
    document.getElementById("bookmarkId").value = "";
    document.getElementById("title").value = "";
    document.getElementById("url").value = "";
    document.getElementById("saveBtn").innerText = "Add Bookmark";
}

// Load on page start
loadBookmarks();
