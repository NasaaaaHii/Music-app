// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbFY_zgKl0k0W7rjWYWn_QSvzkDJt7E9c",
  authDomain: "musicappdemo-8435e.firebaseapp.com",
  projectId: "musicappdemo-8435e",
  storageBucket: "musicappdemo-8435e.firebasestorage.app",
  messagingSenderId: "81586625781",
  appId: "1:81586625781:web:d46a0ac113626d198139bc",
  measurementId: "G-T7HLWV1HP3",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);

const FIREBASE_ERROR_MESSAGE: Record<string, string> = {
  // --- Email & Mật khẩu ---
  "auth/invalid-email": "Email không hợp lệ.",
  "auth/missing-email": "Vui lòng nhập email.",
  "auth/missing-password": "Vui lòng nhập mật khẩu.",
  "auth/wrong-password": "Mật khẩu không đúng.",
  "auth/user-not-found": "Không tìm thấy người dùng với email này.",
  "auth/user-disabled": "Tài khoản này đã bị vô hiệu hóa.",
  "auth/invalid-credential": "Email hoặc mật khẩu không hợp lệ.",
  "auth/email-already-in-use": "Email này đã được đăng ký.",
  "auth/weak-password": "Mật khẩu quá yếu, vui lòng chọn mật khẩu mạnh hơn.",
  "auth/operation-not-allowed":
    "Phương thức đăng nhập này chưa được bật trong Firebase Console.",
  "auth/missing-action-code": "Thiếu mã khôi phục mật khẩu.",

  // --- Xác thực Google / OAuth ---
  "auth/account-exists-with-different-credential":
    "Tài khoản đã tồn tại với phương thức đăng nhập khác.",
  "auth/credential-already-in-use":
    "Thông tin đăng nhập này đã được sử dụng cho tài khoản khác.",
  "auth/popup-blocked": "Trình duyệt đã chặn cửa sổ đăng nhập.",
  "auth/popup-closed-by-user":
    "Cửa sổ đăng nhập đã bị đóng trước khi hoàn tất.",
  "auth/cancelled-popup-request":
    "Yêu cầu đăng nhập bị hủy vì có yêu cầu khác đang xử lý.",
  "auth/unauthorized-domain":
    "Tên miền này chưa được cấp phép để sử dụng đăng nhập OAuth.",
  "auth/invalid-continue-uri": "Đường dẫn tiếp tục không hợp lệ.",
  "auth/invalid-action-code": "Mã hành động không hợp lệ hoặc đã hết hạn.",

  // --- Xác minh tài khoản ---
  "auth/requires-recent-login":
    "Hành động này yêu cầu bạn đăng nhập lại gần đây.",
  "auth/expired-action-code": "Mã xác minh đã hết hạn.",
  "auth/invalid-verification-code": "Mã xác minh không hợp lệ.",
  "auth/missing-verification-code": "Thiếu mã xác minh.",
  "auth/invalid-verification-id": "ID xác minh không hợp lệ.",
  "auth/missing-verification-id": "Thiếu ID xác minh.",
  "auth/missing-phone-number": "Thiếu số điện thoại.",
  "auth/invalid-phone-number": "Số điện thoại không hợp lệ.",
  "auth/quota-exceeded":
    "Bạn đã vượt quá số lần thử xác minh cho phép. Vui lòng thử lại sau.",

  // --- Token / Phiên đăng nhập ---
  "auth/invalid-user-token": "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.",
  "auth/user-token-expired":
    "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  "auth/invalid-id-token": "Mã ID token không hợp lệ.",
  "auth/id-token-expired": "Mã ID token đã hết hạn.",
  "auth/token-expired": "Phiên đăng nhập đã hết hạn.",
  "auth/session-cookie-expired":
    "Cookie phiên đã hết hạn. Vui lòng đăng nhập lại.",
  "auth/invalid-session-cookie": "Cookie phiên không hợp lệ.",

  // --- Mạng & Hệ thống ---
  "auth/network-request-failed":
    "Lỗi mạng, vui lòng kiểm tra kết nối Internet.",
  "auth/internal-error": "Lỗi hệ thống nội bộ, vui lòng thử lại sau.",
  "auth/invalid-api-key": "API Key Firebase không hợp lệ.",
  "auth/app-not-authorized":
    "Ứng dụng này chưa được cấp quyền truy cập Firebase.",
  "auth/app-deleted": "Ứng dụng Firebase này đã bị xóa.",
  "auth/timeout": "Yêu cầu quá thời gian chờ, vui lòng thử lại.",

  // --- Giới hạn & Bảo vệ ---
  "auth/too-many-requests":
    "Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau.",
  "auth/maximum-second-factor-count-exceeded":
    "Đã đạt giới hạn số yếu tố xác thực thứ hai.",
  "auth/multi-factor-auth-required": "Yêu cầu xác thực đa yếu tố.",
  "auth/unverified-email": "Email chưa được xác minh.",
  "auth/invalid-recipient-email": "Địa chỉ email người nhận không hợp lệ.",
  "auth/expired-popup-request": "Yêu cầu đăng nhập popup đã hết hạn.",

  // --- Lỗi khác ---
  "auth/argument-error": "Tham số truyền vào không hợp lệ.",
  "auth/missing-continue-uri": "Thiếu đường dẫn chuyển hướng sau khi xác minh.",
  "auth/missing-client-identifier": "Thiếu mã định danh ứng dụng khách.",
  "auth/unknown": "Lỗi không xác định.",
};

export function getError(message: string) {
  return FIREBASE_ERROR_MESSAGE[message] || `Error: ${message}`;
}

export {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut
};

    export { doc, setDoc };

