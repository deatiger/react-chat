import {firebaseApp} from '../firebase/index'
import {database, storage} from '../firebase/index'

/**
 * Delete a file from Firebase Storage.
 * @param {string} fileName UID of image file.
 * @return {Promise<T | boolean>}
 */
export const deleteFileFromStorage = (fileName) => {
    return storage.ref('images').child(fileName).delete()
        .then((response) => {
            return null
        }).catch((error) => {
            console.error("ファイルの削除に失敗しました。")
            return null
        })
};

/**
 * Delete HTML element for preview of image and the file from Storage
 * @param {HTMLElement} element The preview area of uploaded image.
 * @return {boolean}
 */
export const deleteUploadedFile = (element) => {
    const ret = window.confirm('画像を削除しますか？');

    if (!ret) {
        return false
    } else {
        const thumbBox = element.parentElement;
        const fileName = thumbBox.getAttribute('data-value');
        deleteFileFromStorage(fileName);
        thumbBox.outerHTML = "";
        return true
    }
};

/**
 * Get the current datetime and format as Number.
 * @returns {number} datetime The datetime as Number like YYYYMMDDHHmmss
 */
export const getDatetimeAsNumber = () => {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = ("00" + (now.getMonth()+1)).slice(-2);
    const day = ("00" + now.getDate()).slice(-2);
    const hour = ("00" + now.getHours()).slice(-2);
    const minute = ("00" + now.getMinutes()).slice(-2);
    const second = ("00" + now.getSeconds()).slice(-2);
    const datetime = (year + month + day + hour + minute + second);

    return Number(datetime)
};

/**
 * Verify the argument is NULL or not.
 * @param {*} checkedValue
 * @returns {*} When it is NULL, return "" as String
 */
export const isNull = (checkedValue) => {
    if (checkedValue) {
        return checkedValue
    }else{
        return ""
    }
};

/**
 * Verify the argument is NULL or not.
 * @param checkedValue
 * @returns {*} When the value is NULL, return the string to notice which the member does not exist.
 */
export const isNullMember = (checkedValue) => {
    if (checkedValue) {
        return checkedValue
    }else{
        return "このメンバーは存在しません"
    }
};

export const signOut = () => {
    return firebaseApp.auth().signOut().then(() => {
        return window.location.replace('/')
    }).catch((error) => {
        console.log(error);
    });
};

/**
 * Update firebase realtime database
 * @param updateJson {object} The keys are full paths to data to be updated. The values are updated values.
 * @returns {Promise}
 */
export const updateMultiPath = (updateJson) => {
    return database.ref().update(updateJson)
};
