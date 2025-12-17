export const formRules = {
  required: (fieldName, type = "type") => ({
    required: true,
    message: `Vui lòng ${
      type === "type" ? "nhập" : "chọn"
    } ${fieldName.toLowerCase()}!`,
  }),

  minLength: (label, min) => ({
    min,
    message: `${label} ít nhất ${min} ký tự!`,
  }),

  maxLength: (label, max) => ({
    max,
    message: `${label} tối đa ${max} ký tự!`,
  }),

  textRange: (label, min, max) => ({
    validator: (_, value) => {
      if (!value) return Promise.resolve();
      const length = value.trim().length;
      if (length < min)
        return Promise.reject(new Error(`${label} ít nhất ${min} ký tự!`));
      if (length > max)
        return Promise.reject(new Error(`${label} tối đa ${max} ký tự!`));
      return Promise.resolve();
    },
  }),
  phone: (label, min = 6, max = 18) => ({
  validator: (_, value) => {
    if (!value) return Promise.resolve();
    const regex = new RegExp(`^[0-9]{${min},${max}}$`);
    if (!regex.test(value)) {
      return Promise.reject(
        new Error(`${label} phải từ ${min}–${max} chữ số`)
      );
    }
    return Promise.resolve();
  },
}),

};