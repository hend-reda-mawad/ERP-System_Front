const apiBase = "http://erp-systemhend.runasp.net/api";

function showResult(id, text) {
  document.getElementById(id).textContent = text;
}

document.getElementById('btnCreateFolder').onclick = async () => {
  const name = document.getElementById('createFolderName').value.trim();
  const parentId = document.getElementById('createParentFolderId').value.trim() || null;
  if (!name) return alert('Please enter folder name');

  try {
    const res = await fetch(`${apiBase}/Folder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parentFolderId: parentId })
    });
    const data = await res.json();
    showResult('resCreateFolder', JSON.stringify(data, null, 2));
  } catch (e) {
    showResult('resCreateFolder', 'Error creating folder');
  }
};

document.getElementById('btnGetFolder').onclick = async () => {
  const id = document.getElementById('getFolderId').value.trim();
  if (!id) return alert('Please enter folder ID');

  try {
    const res = await fetch(`${apiBase}/Folder/${id}`);
    if (!res.ok) throw new Error('Folder not found');
    const data = await res.json();
    showResult('resGetFolder', JSON.stringify(data, null, 2));
  } catch (e) {
    showResult('resGetFolder', e.message || 'Error fetching folder');
  }
};

document.getElementById('btnUpdateFolder').onclick = async () => {
  const id = document.getElementById('updateFolderId').value.trim();
  const newName = document.getElementById('updateFolderName').value.trim();
  if (!id || !newName) return alert('Please enter folder ID and new name');

  try {
    const res = await fetch(`${apiBase}/Folder/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newName)
    });
    if (!res.ok) throw new Error('Update failed');
    const data = await res.json();
    showResult('resUpdateFolder', JSON.stringify(data, null, 2));
  } catch (e) {
    showResult('resUpdateFolder', e.message || 'Update failed');
  }
};

document.getElementById('btnDeleteFolder').onclick = async () => {
  const id = document.getElementById('deleteFolderId').value.trim();
  if (!id) return alert('Please enter folder ID');

  try {
    const res = await fetch(`${apiBase}/Folder/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    showResult('resDeleteFolder', 'Folder deleted successfully');
  } catch (e) {
    showResult('resDeleteFolder', e.message || 'Delete failed');
  }
};

document.getElementById('btnUploadFile').onclick = async () => {
  const fileInput = document.getElementById('uploadFileInput');
  const titleInput = document.getElementById('uploadTitle');
  const descriptionInput = document.getElementById('uploadDescription');
  const tagsInput = document.getElementById('uploadTags');

  if (!fileInput.files.length) {
    return alert('Please select a file');
  }

  const formData = new FormData();
  formData.append('File', fileInput.files[0]);  
  formData.append('Title', titleInput.value);
  formData.append('Description', descriptionInput.value);

  const tagsArray = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  tagsArray.forEach(tag => formData.append('Tags', tag));

  try {
    const res = await fetch(`${apiBase}/Files/upload`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    showResult('resUploadFile', JSON.stringify(data, null, 2));
  } catch (e) {
    showResult('resUploadFile', 'Error uploading file: ' + e.message);
  }
};

document.getElementById('btnGetFiles').onclick = async () => {
  try {
    const res = await fetch(`${apiBase}/Files`);
    if (!res.ok) throw new Error('Failed to fetch files');
    const data = await res.json();
    showResult('resGetFiles', JSON.stringify(data, null, 2));
  } catch (e) {
    showResult('resGetFiles', e.message || 'Error fetching files');
  }
};

document.getElementById('btnAssignAccess').onclick = async () => {
  const userId = document.getElementById('assignAccessUserId').value.trim();
  const documentId = document.getElementById('assignAccessDocumentId').value.trim();
  const permissionLevel = document.getElementById('assignAccessPermissionLevel').value;

  if (!userId || !documentId || !permissionLevel) {
    alert('Please enter User ID, Document ID and select Permission Level');
    return;
  }

  try {
    const res = await fetch(`${apiBase}/Access/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, documentId, permissionLevel })
    });

    if (!res.ok) throw new Error('Failed to assign access');

    const data = await res.json();
    showResult('resAssignAccess', JSON.stringify(data, null, 2));
  } catch (e) {
    showResult('resAssignAccess', 'Error assigning access: ' + e.message);
  }
};



document.getElementById('btnGetAccess').onclick = async () => {
  const documentId = document.getElementById('getAccessDocumentId').value.trim();

  if (!documentId) {
    alert('Please enter Document ID');
    return;
  }

  try {
    const res = await fetch(`${apiBase}/Access/document/${documentId}`);
    if (!res.ok) throw new Error('Failed to fetch access data');

    const data = await res.json();
    showResult('resGetAccess', JSON.stringify(data, null, 2));
  } catch (e) {
    showResult('resGetAccess', 'Error fetching access: ' + e.message);
  }
};

document.getElementById('btnRemoveAccess').onclick = async () => {
  const userId = document.getElementById('removeAccessUserId').value.trim();
  const documentId = document.getElementById('removeAccessDocumentId').value.trim();
  const permissionLevel = document.getElementById('removeAccessPermissionLevel').value;  // string

  if (!userId || !documentId || !permissionLevel) {
    alert('Please enter User ID, Document ID, and select Permission Level');
    return;
  }

  const payload = {
    documentId,
    userId,
    permissionLevel
  };

  try {
    const res = await fetch(`${apiBase}/Access/remove`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Failed to remove access');

    showResult('resRemoveAccess', 'Access removed successfully');
  } catch (e) {
    showResult('resRemoveAccess', 'Error removing access: ' + e.message);
  }
};

document.getElementById('btnGetTags').onclick = async () => {
    const documentId = document.getElementById('getTagsDocumentId').value.trim();
    if (!documentId) {
      alert('Please enter Document ID');
      return;
    }
    try {
      const res = await fetch(`${apiBase}/Tags/${encodeURIComponent(documentId)}`);
      if (!res.ok) throw new Error('Failed to get tags');
      const data = await res.json();
      showResult('resGetTags', JSON.stringify(data, null, 2));
    } catch (e) {
      showResult('resGetTags', 'Error: ' + e.message);
    }
  };

  document.getElementById('btnAddTags').onclick = async () => {
    const documentId = document.getElementById('addTagsDocumentId').value.trim();
    const tagsRaw = document.getElementById('addTagsList').value.trim();
    if (!documentId || !tagsRaw) {
      alert('Please enter Document ID and tags');
      return;
    }
    const tags = tagsRaw.split(',').map(t => t.trim()).filter(t => t);
    try {
      const res = await fetch(`${apiBase}/Tags/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, tags })
      });
      if (!res.ok) throw new Error('Failed to add tags');
      const data = await res.json();
      showResult('resAddTags', JSON.stringify(data, null, 2));
    } catch (e) {
      showResult('resAddTags', 'Error: ' + e.message);
    }
  };

document.getElementById('btnUpdateTags').onclick = async () => {
  const documentId = document.getElementById('updateTagsDocumentId').value.trim();
  const tagsRaw = document.getElementById('updateTagsList').value.trim();

  if (!documentId || !tagsRaw) {
    alert('Please enter Document ID and tags');
    return;
  }

  const tags = tagsRaw.split(',').map(t => t.trim()).filter(t => t);

  try {
    const res = await fetch(`${apiBase}/tags/${encodeURIComponent(documentId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags }) 
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update tags');
    }

    const data = await res.json();
    showResult('resUpdateTags', JSON.stringify(data, null, 2));
  } catch (e) {
    showResult('resUpdateTags', 'Error: ' + e.message);
  }
};


  document.getElementById('btnRemoveTag').onclick = async () => {
    const documentId = document.getElementById('removeTagDocumentId').value.trim();
    const tag = document.getElementById('removeTagName').value.trim();
    if (!documentId || !tag) {
      alert('Please enter Document ID and tag to remove');
      return;
    }
    try {
      const res = await fetch(`${apiBase}/Tags/${encodeURIComponent(documentId)}/${encodeURIComponent(tag)}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to remove tag');
      const data = await res.json();
      showResult('resRemoveTag', JSON.stringify(data, null, 2));
    } catch (e) {
      showResult('resRemoveTag', 'Error: ' + e.message);
    }
  };





