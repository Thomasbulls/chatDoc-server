import { getAxiosInstance } from '../utils/http.js';
import FormData from 'form-data';
import fetch from 'node-fetch';

const proxyHost = process.env.PROXY_HOST || 'https://api.chatdoc.com';
// const proxyApiKey = 'ak-tqVV2zpX6s8CefIv0eqWcDOSHvuzFROQknIPS3X9zj8';
const proxyApiKey = process.env.PROXY_API_KEY;
const prefix = '/api/v1/';
const baseURL = `${proxyHost}${prefix}`;
const options = {
  baseURL,
  headers: {
    Authorization: `Bearer ${proxyApiKey}`,
  },
};

const http = getAxiosInstance(options);

export async function createDocCollectionAPI(name) {
  return http.post('/collections', {
    name,
  });
}

export async function uploadDocumentsAPI(collectionId, file) {
  const formData = new FormData();

  formData.append('file', file.stream, file.originalName);

  const params = {
    collection_id: collectionId,
  };
  return http.post('documents/upload', formData, {
    params,
  });
}

export async function getDocByUploadIdAPI(uploadId) {
  const url = `documents/${uploadId}`;
  return http.get(url);
}

export async function deleteDocByUploadIdAPI(uploadId) {
  const url = `documents/${uploadId}`;
  return http.delete(url);
}

export async function getDocElementsAPI(uploadId, pages) {
  const url = `documents/${uploadId}/elements`;
  const search = new URLSearchParams();

  [].concat(pages).forEach((id) => {
    search.append('page', id);
  });

  return http.get(url, {
    params: search,
  });
}

export async function chatWithDocumentAPI(uploadId, chatParams) {
  const response = await fetch(`${baseURL}/questions?upload_id=${uploadId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${proxyApiKey}`,
    },
    body: JSON.stringify(chatParams),
  });
  return response.body;
}

export async function getSuggestedQuestionsAPI(uploadId) {
  const url = `questions/suggested`;
  return http.get(url, { params: { upload_id: uploadId } });
}
