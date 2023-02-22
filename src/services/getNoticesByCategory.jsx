
const BASE_URL = 'https://pets-project-backend.onrender.com';


export const getNoticesByCategory = async ({ sell }) => {
  const noticesList = await fetch(
    `${BASE_URL}/api/notices/category/lost_found`
  );
  return noticesList.json();
};