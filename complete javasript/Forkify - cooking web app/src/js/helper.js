import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchData = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // It wil race witch function will be fast, fetch or timeout?
    const response = await Promise.race([fetchData, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok)
      throw new Error(data?.message ?? 'Fetching the recipe data FAILED!');

    return data;
  } catch (error) {
    // It will throw the error at the parent catch
    throw error;
  }
};

// export const getJson = async function (url) {
//   try {
//     // It wil race witch function will be fast, fetch or timeout?
//     const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     const data = await response.json();

//     if (!response.ok)
//       throw new Error(data?.message ?? 'Fetching the recipe data FAILED!');

//     return data;
//   } catch (error) {
//     // It will throw the error at the parent catch
//     throw error;
//   }
// };

// export const sendJson = async function (url, uploadData) {
//   try {
//     const fetchData = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });
//     // It wil race witch function will be fast, fetch or timeout?
//     const response = await Promise.race([fetchData, timeout(TIMEOUT_SEC)]);
//     const data = await response.json();

//     if (!response.ok)
//       throw new Error(data?.message ?? 'Fetching the recipe data FAILED!');

//     return data;
//   } catch (error) {
//     // It will throw the error at the parent catch
//     throw error;
//   }
// };
