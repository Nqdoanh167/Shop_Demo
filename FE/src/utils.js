/** @format */
//kiểm tra xem một chuỗi có thể được chuyển đổi thành đối tượng JSON hay không.
export const isJsonString = (data) => {
   try {
      JSON.parse(data);
   } catch (error) {
      return false;
   }
   return true;
};
export const getBase64 = (file) =>
   new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
   });
